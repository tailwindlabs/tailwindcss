import _ from 'lodash'
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

      const utilities = generateModules(
        utilityModules,
        unwrappedConfig.options.modules,
        unwrappedConfig
      )

      if (_.get(unwrappedConfig, 'options.important', false)) {
        utilities.walkDecls(decl => (decl.important = true))
      }

      const tailwindClasses = postcss.root({
        nodes: [...container(unwrappedConfig), ...utilities.nodes],
      })

      applyClassPrefix(tailwindClasses, _.get(unwrappedConfig, 'options.prefix', ''))

      atRule.before(tailwindClasses)
      atRule.remove()
    })
  }
}
