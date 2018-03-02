import _ from 'lodash'
import postcss from 'postcss'
import escapeClassName from '../util/escapeClassName'
import wrapWithVariants from '../util/wrapWithVariants'

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

  config.plugins.forEach(plugin => {
    plugin({
      config: (path, defaultValue) => _.get(config, path, defaultValue),
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
