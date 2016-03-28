#!/usr/bin/env node
/*eslint-disable */
require('babel-core/register')({
  presets: ['es2015', 'stage-3'],
})
require('babel-polyfill')

var program = require('commander')
var zhihu = require('./zhihu').default

program.version(require('./package').version)

program.command('getlatest')
  .description('get latest daily zhihu')
  .action(function() {
    zhihu.getLatest()
  })

program.command('getpost <postId>')
  .description('get a single post')
  .action(function(postId) {
    zhihu.getPost(postId)
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}