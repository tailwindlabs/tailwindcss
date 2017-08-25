const _ = require('lodash')
const postcss = require('postcss')
const cssnext = require('postcss-cssnext')
const fs = require('fs')

const backgroundColors = require('./generators/background-colors')
const shadows = require('./generators/shadows')
const flex = require('./generators/flex')

function findMixin(css, mixin, onError) {
  let match

  css.walkRules((rule) => {
    if (_.trimStart(rule.selector, '.') === mixin) {
      match = rule
      return false
    }
  })

  if (_.isUndefined(match) && _.isFunction(onError)) {
    onError()
  }

  return match.clone().nodes
}

function addCustomMediaQueries(css, { breakpoints }) {
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

function generateUtilities(css, options) {
  const rules = []

  css.walkAtRules(atRule => {
    if (atRule.name === 'responsive') {
      const nodes = atRule.nodes
      css.insertBefore(atRule, nodes)
      atRule.remove()
      rules.push(...nodes)
    }
    if (atRule.name === 'tailwind' && atRule.params === 'utilities') {
      const utilities = _.flatten([
        backgroundColors(options),
        shadows(options),
        flex(),
      ])
      css.insertBefore(atRule, utilities)
      atRule.remove()
      rules.push(...utilities)
    }
  })

  Object.keys(options.breakpoints).forEach(breakpoint => {
    const mediaQuery = postcss.atRule({
      name: 'media',
      params: `(--breakpoint-${breakpoint})`,
    })

    mediaQuery.append(rules.map(rule => {
      const cloned = rule.clone()
      cloned.selector = `.${breakpoint}\\:${rule.selector.slice(1)}`
      return cloned
    }))
    css.append(mediaQuery)
  })
}

function substituteClassMixins(css) {
  css.walkRules(function (rule) {
    rule.walkAtRules('class', atRule => {
      const mixins = _.trim(atRule.params, ` "'`).split(' ')
      const decls = _.flatMap(mixins, (mixin) => {
        return findMixin(css, mixin, () => {
          throw atRule.error(`No .${mixin} class found.`);
        })
      })

      rule.insertBefore(atRule, decls)
      atRule.remove()
    })
  })
}

module.exports = postcss.plugin('tailwind', function (options) {
  return function (css) {
    options = options || require('./default-config')

    addCustomMediaQueries(css, options)
    generateUtilities(css, options)
    substituteClassMixins(css)
  }
})
