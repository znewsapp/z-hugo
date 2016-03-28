import got from 'got'
import prettyjson from 'prettyjson'
import cheerio from 'cheerio'

export default {
  async getLatest() {
    const res = await got('http://news-at.zhihu.com/api/4/news/latest')
    console.log(prettyjson.render(JSON.parse(res.body)))
  },

  async getPost(postId) {
    const res = await got(`http://news-at.zhihu.com/api/4/news/${postId}`)
    const postInfo = JSON.parse(res.body)
    // trim
    const html = cheerio.load(postInfo.body, { decodeEntities: false })
    // link to zh
    html('div.view-more').remove()
    // meta
    html('div.meta').remove()
    postInfo.newBody = html.html()
    console.log(prettyjson.render(postInfo))
  },
}
