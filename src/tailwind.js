const _ = require('lodash');
const postcss = require('postcss');
const cssnext = require('postcss-cssnext');

function defaultOptions() {
  return {
    breakpoints: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
  }
}

function findMixin(css, mixin) {
  let match;

  css.walkRules((rule) => {
    if (_.trimStart(rule.selector, '.') === mixin) {
      match = rule
      return false
    }
  })

  return match.clone().nodes
}

function addCustomMediaQueries(css, breakpoints) {
  function buildMediaQuery(breakpoint) {
    if (_.isString(breakpoint)) {
      breakpoint = { min: breakpoint }
    }
    return _(breakpoint).toPairs().map(([feature, value]) => {
      feature = _.get({
        min: 'min-width',
        max: 'max-width',
      }, feature, feature)

      return `(${feature}: ${value})`
    }).join(' and ')
  }

  Object.keys(breakpoints).forEach(breakpoint => {
    const variableName = `--breakpoint-${breakpoint}`
    const mediaQuery = buildMediaQuery(breakpoints[breakpoint])
    const rule = postcss.atRule({
      name: 'custom-media',
      params: `${variableName} ${mediaQuery}`
    })
    css.prepend(rule)
  })
}

function substituteClassMixins(css) {
  css.walkRules(function (rule) {
    rule.walkAtRules('class', atRule => {
      const mixins = _.trim(atRule.params, ` "'`).split(' ')
      const decls = _.flatMap(mixins, (mixin) => {
        return findMixin(css, mixin)
      })

      rule.insertBefore(atRule, decls)
      atRule.remove()
    })
  })
}

module.exports = postcss.plugin('tailwind', function (options) {
  return function (css) {
    options = options || defaultOptions()

    addCustomMediaQueries(css, options.breakpoints)

    // Generate utilities
    // css.

    substituteClassMixins(css)

    // return cssnext.process(css)
  }
})
