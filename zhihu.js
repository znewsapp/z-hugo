import got from 'got'
import prettyjson from 'prettyjson'

export default {
  async getLatest() {
    const res = await got('http://news-at.zhihu.com/api/4/news/latest')
    console.log(prettyjson.render(JSON.parse(res.body)))
  },
}
