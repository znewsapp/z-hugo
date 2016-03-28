#!/usr/bin/env node
/*eslint-disable */
require('babel-core/register')({
  presets: ['es2015', 'stage-3'],
})

var program = require('commander')
var zhihu = require('./zhihu').default

program.version((require('./package').version))

program.command('getlatest')
  .description('get latest daily zhihu')
  .action(function() {
    console.log(zhihu.getLatest())
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}