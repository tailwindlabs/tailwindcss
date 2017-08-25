const _ = require('lodash')
const postcss = require('postcss')
const cssnext = require('postcss-cssnext')
const fs = require('fs')

const addCustomMediaQueries = require('./lib/addCustomMediaQueries')
const generateUtilities = require('./lib/generateUtilities')
const substituteClassApplyAtRules = require('./lib/substituteClassApplyAtRules')

module.exports = postcss.plugin('tailwind', function(options) {
  return function(css) {
    options = options || require('./default-config')

    // const normalize = fs.readFileSync('../node_modules/normalize.css/normalize.css')
    // const base = fs.readFileSync('../node_modules/suitcss-base/lib/base.css')
    // css.prepend(postcss.parse(base))
    // css.prepend(postcss.parse(normalize))

    addCustomMediaQueries(css, options)
    generateUtilities(css, options)
    substituteClassApplyAtRules(css)
  }
})
