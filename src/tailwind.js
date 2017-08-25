const _ = require('lodash')
const postcss = require('postcss')
const cssnext = require('postcss-cssnext')
const fs = require('fs')

const backgroundColors = require('./generators/background-colors')
const shadows = require('./generators/shadows')
const flex = require('./generators/flex')

function cloneNodes(nodes) {
  return _.map(nodes, node => node.clone())
}

function findMixin(css, mixin, onError) {
  const matches = []

  css.walkRules((rule) => {
    if (rule.selector === mixin) {
      matches.push(rule)
    }
  })

  if (_.isEmpty(matches) && _.isFunction(onError)) {
    onError()
  }

  return _.flatten(matches.map(match => match.clone().nodes))
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
      rules.push(...cloneNodes(nodes))
      css.insertBefore(atRule, nodes)
      atRule.remove()
    }
    if (atRule.name === 'tailwind' && atRule.params === 'utilities') {
      const utilities = _.flatten([
        backgroundColors(options),
        shadows(options),
        flex(),
      ])
      rules.push(...cloneNodes(utilities))
      css.insertBefore(atRule, utilities)
      atRule.remove()
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

function substituteClassApplyAtRules(css) {
  css.walkRules(function (rule) {
    rule.walkAtRules('apply', atRule => {
      const mixins = postcss.list.space(atRule.params)

      const [customProperties, classes] = _.partition(mixins, (mixin) => {
        return _.startsWith(mixin, '--')
      })

      const decls = _.flatMap(classes, (mixin) => {
        return findMixin(css, mixin, () => {
          throw atRule.error(`No ${mixin} class found.`);
        })
      })

      rule.insertBefore(atRule, decls)

      atRule.params = customProperties.join(' ')

      if (_.isEmpty(customProperties)) {
        atRule.remove()
      }
    })
  })
}

module.exports = postcss.plugin('tailwind', function (options) {
  return function (css) {
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
