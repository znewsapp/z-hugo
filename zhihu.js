function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms))
}

export default {
  async getLatest() {
    console.log('hello')
    await sleep(1000)
    console.log('world')
  },
}
