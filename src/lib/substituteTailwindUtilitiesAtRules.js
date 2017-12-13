import postcss from 'postcss'
import applyClassPrefix from '../util/applyClassPrefix'
import generateModules from '../util/generateModules'
import container from '../generators/container'
import utilityModules from '../utilityModules'

export default function(config) {
  return function(css) {
    const unwrappedConfig = config()

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params !== 'utilities') {
        return
      }

      const utilities = generateModules(utilityModules, unwrappedConfig.modules, unwrappedConfig)

      if (unwrappedConfig.options.important) {
        utilities.walkDecls(decl => (decl.important = true))
      }

      const tailwindClasses = postcss.root({
        nodes: [...container(unwrappedConfig), ...utilities.nodes],
      })

      applyClassPrefix(tailwindClasses, unwrappedConfig.options.prefix)

      tailwindClasses.walk(node => (node.source = atRule.source))

      atRule.before(tailwindClasses)
      atRule.remove()
    })
  }
}
