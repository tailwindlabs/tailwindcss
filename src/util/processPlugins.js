import _ from 'lodash'
import postcss from 'postcss'
import escapeClassName from '../util/escapeClassName'
import prefixSelector from '../util/prefixSelector'
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

function defineUtility(selector, properties, options) {
  if (selector.startsWith('.')) {
    return defineUtility(selector.slice(1), properties, options)
  }

  const rule = defineRule(prefixSelector(options.prefix, `.${escapeClassName(selector)}`), properties)

  if (options.important) {
    rule.walkDecls(decl => (decl.important = true))
  }

  return rule
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
      utility: (selector, properties) => defineUtility(selector, properties, config.options),
      atRule: defineAtRule,
      e: escapeClassName,
      addUtilities: (utilities, variants = []) => {
        pluginUtilities.push(wrapWithVariants(utilities, variants))
      },
      addComponents: components => {
        pluginComponents.push(...components)
      },
      prefix: selector => {
        return prefixSelector(config.options.prefix, selector)
      },
    })
  })

  return [pluginComponents, pluginUtilities]
}
