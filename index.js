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

program.command('getlatest')
  .description('get latest daily zhihu')
  .action(function() {
    zhihu.getLatest().then(function(latestPosts) {
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

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}