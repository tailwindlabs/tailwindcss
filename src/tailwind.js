const _ = require('lodash')
const postcss = require('postcss')
const fs = require('fs')

const addCustomMediaQueries = require('./lib/addCustomMediaQueries')
const generateUtilities = require('./lib/generateUtilities')
const substituteClassApplyAtRules = require('./lib/substituteClassApplyAtRules')

module.exports = postcss.plugin('tailwind', options => {
  options = options || require('./default-config')

  return postcss([
    addCustomMediaQueries(options),
    generateUtilities(options),
    substituteClassApplyAtRules(options),
    require('postcss-cssnext')(),
    require('stylefmt'),
  ])
})
