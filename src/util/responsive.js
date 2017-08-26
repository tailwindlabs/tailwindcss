const postcss = require('postcss')
const cloneNodes = require('./cloneNodes')

module.exports = function responsive(rules) {
  const atRule = postcss.atRule({
    name: 'responsive',
  })
  atRule.append(cloneNodes(rules))
  return atRule
}
