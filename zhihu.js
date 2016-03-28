import got from 'got'
import cheerio from 'cheerio'

export default {
  async listLatest() {
    const res = await got('http://news-at.zhihu.com/api/4/news/latest')
    console.log('got latest post list')
    return JSON.parse(res.body)
  },

  async getPost(postId) {
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
    return postInfo
  },

  async getLatestPostsInfo() {
    const posts = await this.listLatest()
    const promises = posts.stories.map(p => this.getPost(p.id))

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
}
