let postcss = require('postcss')
let nesting = require('./plugin')

module.exports = postcss.plugin('tailwindcss/nesting', nesting)
