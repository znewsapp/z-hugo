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
    postInfo.newBody = html.html()
    postInfo.postDate = postDate
    return postInfo
  },

  async fetchPostsInfo(date) {
    const posts = await this.list(date)
    const promises = posts.stories.map(p => this.getPost(p.id, posts.date))

    const results = []
    for (const promise of promises) {
      try {
        const postDetail = await promise
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

  async download(date) {
    try {
      // download batch 1
      const allPosts = []
      const posts1 = await this.fetchPostsInfo(date)
      allPosts.push(...posts1)
      // if (allPosts.length) {
      //   const posts2 = await this.fetchPostsInfo(allPosts[0].postDate)
      //   allPosts.push(...posts2)
      // }
      console.log(`got ${allPosts.length} postinfo total, now write them to file`)
      allPosts.forEach(p => this.writePost(p))
      return 'download succeeded'
    } catch (err) {
      return err
    }
  },

  writePost(post) {
    const dir = `hugo/content/post/${post.postDate}/`
    const dateInHugo =
      `${post.postDate.slice(0, 4)}-${post.postDate.slice(4, 6)}-${post.postDate.slice(6, 8)}`
    // mkdirp.sync(dir)
    const fileName = `${post.ga_prefix}-${post.id}.html`
    let fileContent = '+++\n'
    fileContent += `date = "${dateInHugo}"\n`
    fileContent += `title = "${post.title}"\n`
    fileContent += `titleimage = "${post.image}"\n`
    fileContent += '+++\n\n'
    fileContent += post.newBody
    console.log(dir)
    console.log(fileName)
    console.log(fileContent)
  },
}
