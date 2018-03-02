import _ from 'lodash'
import postcss from 'postcss'
import escapeClassName from '../util/escapeClassName'
import wrapWithVariants from '../util/wrapWithVariants'

const defaultConfig = require('../../defaultConfig')();

function defineRule(selector, properties) {
  const decls = _.map(properties, (value, property) => {
    return postcss.decl({
      prop: `${property}`,
      value: `${value}`,
    })
  })

  return postcss.rule({ selector }).append(decls)
}

function defineAtRule(atRule, rules) {
  const [name, ...params] = atRule.split(' ')

  return postcss
    .atRule({
      name: name.startsWith('@') ? name.slice(1) : name,
      params: params.join(' '),
    })
    .append(rules)
}

export default function(config) {
  const pluginComponents = []
  const pluginUtilities = []

  const tryConfig = (defaultValue, ...paths) => {
    for (let source of [config, defaultConfig]) {
      for (let path of paths) {
        if (_.has(source, path)) {
          return _.get(source, path)
        }
      }
    }

    return defaultValue
  }

  config.plugins.forEach(plugin => {
    plugin({
      customUserConfig: config,
      config: tryConfig,
      rule: defineRule,
      atRule: defineAtRule,
      e: escapeClassName,
      addUtilities: (utilities, variants) => {
        pluginUtilities.push(wrapWithVariants(utilities, variants))
      },
      addComponents: components => {
        pluginComponents.push(...components)
      },
    })
  })

  return [pluginComponents, pluginUtilities]
}
