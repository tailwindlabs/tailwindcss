const _ = require('lodash');
const postcss = require('postcss');
const cssnext = require('postcss-cssnext');

const findMixin = function (css, mixin) {
  let match;

  css.walkRules((rule) => {
    if (_.trimStart(rule.selector, '.') === mixin) {
      match = rule
      return false
    }
  })

  return match.clone().nodes
}

module.exports = postcss.plugin('tailwind', function (options) {
  return function (css) {
    options = options || {}

    // Add custom media query declarations to top of node tree

    // Generate utilities
    // css.

    // Substitute component mixins
    css.walkRules(function (rule) {
      rule.walkAtRules('class', atRule => {
        const mixins = _.trim(atRule.params, ` "'`).split(' ')
        const decls = _.flatMap(mixins, (mixin) => {
          return findMixin(css, mixin)
        })

        atRule.before(decls)
        atRule.remove()
      })
    })

    return cssnext.process(css)
  }
})
