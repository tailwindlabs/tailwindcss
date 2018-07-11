import _ from 'lodash'
import postcss from 'postcss'
import utilityModules from '../utilityModules'
import prefixTree from '../util/prefixTree'
import generateModules from '../util/generateModules'

export default function(config, pluginUtilities) {
  const utilities = generateModules(utilityModules, config.modules, config)

  if (config.options.important) {
    utilities.walkDecls(decl => (decl.important = true))
  }

  const tailwindUtilityTree = postcss.root({
    nodes: utilities.nodes,
  })

  prefixTree(tailwindUtilityTree, config.options.prefix)

  return _.tap(postcss.root(), root => {
    root.append(tailwindUtilityTree.nodes)
    root.append(pluginUtilities)
  })
}
