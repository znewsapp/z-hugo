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

program.command('listlatest')
  .description('list latest daily zhihu')
  .action(function() {
    zhihu.listLatest().then(function(latestPosts) {
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
    zhihu.getLatestPostsInfo().then(function(posts) {
      console.log(prettyjson.render(posts))
    })
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}