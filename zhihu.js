import got from 'got'
import cheerio from 'cheerio'
import mkdirp from 'mkdirp'
import fs from 'fs'

export default {
  async list(date) {
    let url = 'http://news-at.zhihu.com/api/4/news/'
    if (date) {
      url += 'before/'
      url += date
    } else {
      url += 'latest'
    }
    const res = await got(url)
    const result = JSON.parse(res.body)
    console.log(`listed ${result.stories.length} posts for date ${result.date}`)
    return result
  },

  async getPost(postId, postDate) {
    const res = await got(`http://news-at.zhihu.com/api/4/news/${postId}`)
    console.log(`got post detail: ${postId}`)
    const postInfo = JSON.parse(res.body)
    // trim
    const html = cheerio.load(postInfo.body, { decodeEntities: false })
    // link to zh
    html('div.view-more').remove()
    // meta
    html('div.meta').remove()
    // remove p wrapper around img
    html('p img').each(function () {
      const parent = html(this).parent()
      html(this).insertAfter(parent)
      parent.remove()
    })
    postInfo.newBody = html.html()
    postInfo.postDate = postDate
    return postInfo
  },

  async fetchPostsInfo(date) {
    const posts = await this.list(date)

    const results = []
    for (const post of posts.stories) {
      try {
        const postDetail = await this.getPost(post.id, posts.date)
        if (postDetail.section && postDetail.section.id && postDetail.section.id === 2) {
          // we don't need 瞎扯
        } else {
          results.push(postDetail)
        }
      } catch (err) {
        console.error(`error getting post: ${err}`)
      }
    }
    return results
  },

  async download(date, forceWrite) {
    try {
      // download batch 1
      const allPosts = []
      const posts1 = await this.fetchPostsInfo(date)
      allPosts.push(...posts1)
      if (allPosts.length) {
        const posts2 = await this.fetchPostsInfo(allPosts[0].postDate)
        allPosts.push(...posts2)
      }
      console.log(`got ${allPosts.length} postinfo total, now write them to file`)
      allPosts.forEach(p => this.writePost(p, forceWrite))
      return 'download succeeded'
    } catch (err) {
      return err.stack
    }
  },

  writePost(post, forceWrite) {
    const dir = `hugo/content/post/${post.postDate.slice(0, 6)}/${post.postDate.slice(6, 8)}/`
    const dateInHugo =
      `${post.postDate.slice(0, 4)}-${post.postDate.slice(4, 6)}-${post.postDate.slice(6, 8)}`
    const fileName = `${post.ga_prefix}-${post.id}.html`
    const path = dir + fileName
    let fileContent = '+++\n'
    fileContent += `date = "${dateInHugo}T${post.ga_prefix.slice(4, 6)}:00:00"\n`
    fileContent += `title = "${post.title}"\n`
    fileContent += `titleimage = "${post.image}"\n`
    fileContent += `ga = ${post.ga_prefix}\n`
    fileContent += '+++\n\n'
    fileContent += post.newBody
    if (fs.existsSync(path) && !forceWrite) {
      console.log(`${path} already exists, skip.......`)
      return
    }
    mkdirp.sync(dir)
    fs.writeFileSync(path, fileContent)
    console.log(`!!! ${path} created, great !!!`)
  },
}
