import _ from 'lodash'
import applyClassPrefix from '../util/applyClassPrefix'
import container from '../generators/container'
import fs from 'fs'
import generateModules from '../util/generateModules'
import postcss from 'postcss'
import utilityModules from '../utilityModules'
import wrapWithVariants from '../util/wrapWithVariants'

function defineSelector(selector, properties) {
  const decls = _.map(properties, (value, property) => {
    return postcss.decl({
      prop: `${property}`,
      value: `${value}`,
    })
  })

  return postcss.rule({ selector }).append(decls)
}

export default function(config) {
  return function(css) {
    const unwrappedConfig = config()

    const pluginComponents = []
    const pluginUtilities = []

    unwrappedConfig.plugins.forEach(plugin => {
      plugin({
        selector: defineSelector,
        addUtilities: (utilities, variants) => {
          pluginUtilities.push(wrapWithVariants(utilities, variants))
        },
        addComponents: components => {
          pluginComponents.push(...components)
        },
      })
    })

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'preflight') {
        atRule.before(
          postcss.parse(fs.readFileSync(`${__dirname}/../../css/preflight.css`, 'utf8'))
        )
        atRule.remove()
      }

      if (atRule.params === 'components') {
        const tailwindComponentTree = postcss.root({
          nodes: [...container(unwrappedConfig)],
        })

        const pluginComponentTree = postcss.root({
          nodes: [...pluginComponents],
        })

        applyClassPrefix(tailwindComponentTree, unwrappedConfig.options.prefix)

        tailwindComponentTree.walk(node => (node.source = atRule.source))
        pluginComponentTree.walk(node => (node.source = atRule.source))

        atRule.before(tailwindComponentTree)
        atRule.before(pluginComponentTree)
        atRule.remove()
      }

      if (atRule.params === 'utilities') {
        const utilities = generateModules(utilityModules, unwrappedConfig.modules, unwrappedConfig)

        if (unwrappedConfig.options.important) {
          utilities.walkDecls(decl => (decl.important = true))
        }

        const tailwindUtilityTree = postcss.root({
          nodes: [...utilities.nodes],
        })

        const pluginUtilityTree = postcss.root({
          nodes: [...pluginUtilities],
        })

        applyClassPrefix(tailwindUtilityTree, unwrappedConfig.options.prefix)

        tailwindUtilityTree.walk(node => (node.source = atRule.source))
        pluginUtilityTree.walk(node => (node.source = atRule.source))

        atRule.before(tailwindUtilityTree)
        atRule.before(pluginUtilityTree)
        atRule.remove()
      }
    })
  }
}
