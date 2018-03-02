import fs from 'fs'
import postcss from 'postcss'
import container from '../generators/container'
import utilityModules from '../utilityModules'
import applyClassPrefix from '../util/applyClassPrefix'
import generateModules from '../util/generateModules'
import processPlugins from '../util/processPlugins'

export default function(config) {
  return function(css) {
    const unwrappedConfig = config()

    const [pluginComponents, pluginUtilities] = processPlugins(unwrappedConfig)

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'preflight') {
        atRule.before(
          postcss.parse(fs.readFileSync(`${__dirname}/../../css/preflight.css`, 'utf8'))
        )
        atRule.remove()
      }

      if (atRule.params === 'components') {
        const tailwindComponentTree = postcss.root({
          nodes: container(unwrappedConfig),
        })

        const pluginComponentTree = postcss.root({
          nodes: pluginComponents,
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
          nodes: utilities.nodes,
        })

        const pluginUtilityTree = postcss.root({
          nodes: pluginUtilities,
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
