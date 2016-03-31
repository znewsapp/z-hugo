#!/usr/bin/env node
/*eslint-disable */
require('babel-core/register')({
  presets: ['es2015', 'stage-3'],
})
require('babel-polyfill')

var program = require('commander')
var prettyjson = require('prettyjson')
var zhihu = require('./zhihu').default

program.version(require('./package').version)
program.option('-d, --date [date]', 'date + 1day to get')
program.option('-f, --forcewrite', 'write to post file even if it already exists')

program.command('list')
  .description('list latest daily zhihu')
  .action(function() {
    zhihu.list(program.date).then(function(latestPosts) {
      console.log(prettyjson.render(latestPosts))
    })
  })

program.command('getpost <postId>')
  .description('get a single post')
  .action(function(postId) {
    zhihu.getPost(postId).then(function(post) {
      console.log(prettyjson.render(post))
    })
  })

program.command('fetch')
  .description('fetch latest posts info')
  .action(function() {
    zhihu.fetchPostsInfo(program.date).then(function(posts) {
      console.log(prettyjson.render(posts))
    })
  })

// daily job
program.command('download')
  .description('get postinfo and write to hugo post')
  .action(function() {
    zhihu.download(program.date, program.forcewrite).then(function(result) {
      console.log(result)
    })
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}