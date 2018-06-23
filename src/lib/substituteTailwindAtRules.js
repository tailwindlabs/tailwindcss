import fs from 'fs'
import postcss from 'postcss'
import utilityModules from '../utilityModules'
import prefixTree from '../util/prefixTree'
import generateModules from '../util/generateModules'
import processPlugins from '../util/processPlugins'

export default function(config) {
  return function(css) {
    const { components: pluginComponents, utilities: pluginUtilities } = processPlugins(
      config
    )

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'preflight') {
        const preflightTree = postcss.parse(
          fs.readFileSync(`${__dirname}/../../css/preflight.css`, 'utf8')
        )

        preflightTree.walk(node => (node.source = atRule.source))

        atRule.before(preflightTree)
        atRule.remove()
      }

      if (atRule.params === 'components') {
        const pluginComponentTree = postcss.root({
          nodes: pluginComponents,
        })

        pluginComponentTree.walk(node => (node.source = atRule.source))

        atRule.before(pluginComponentTree)
        atRule.remove()
      }

      if (atRule.params === 'utilities') {
        const utilities = generateModules(utilityModules, config.modules, config)

        if (config.options.important) {
          utilities.walkDecls(decl => (decl.important = true))
        }

        const tailwindUtilityTree = postcss.root({
          nodes: utilities.nodes,
        })

        const pluginUtilityTree = postcss.root({
          nodes: pluginUtilities,
        })

        prefixTree(tailwindUtilityTree, config.options.prefix)

        tailwindUtilityTree.walk(node => (node.source = atRule.source))
        pluginUtilityTree.walk(node => (node.source = atRule.source))

        atRule.before(tailwindUtilityTree)
        atRule.before(pluginUtilityTree)
        atRule.remove()
      }
    })
  }
}
