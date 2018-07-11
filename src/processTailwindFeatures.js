import postcss from 'postcss'

import substituteTailwindAtRules from './lib/substituteTailwindAtRules'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import substituteVariantsAtRules from './lib/substituteVariantsAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'
import processPlugins from './util/processPlugins'

export default function(lazyConfig) {
  const config = lazyConfig()
  const plugins = processPlugins(config)

  return postcss([
    substituteTailwindAtRules(config, plugins),
    evaluateTailwindFunctions(config),
    substituteVariantsAtRules(config, plugins),
    substituteResponsiveAtRules(config),
    substituteScreenAtRules(config),
    substituteClassApplyAtRules(config),
  ])
}
