import postcss from 'postcss'

import substituteTailwindAtRules from './lib/substituteTailwindAtRules'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import substituteVariantsAtRules from './lib/substituteVariantsAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

import generateUtilities from './util/generateUtilities'
import processPlugins from './util/processPlugins'

export default function(lazyConfig) {
  return function(css) {
    const config = lazyConfig()
    const processedPlugins = processPlugins(config)
    const utilities = generateUtilities(config, processedPlugins.utilities)

    return postcss([
      substituteTailwindAtRules(config, processedPlugins, utilities),
      evaluateTailwindFunctions(config),
      substituteVariantsAtRules(config, processedPlugins),
      substituteResponsiveAtRules(config),
      substituteScreenAtRules(config),
      substituteClassApplyAtRules(config, utilities),
    ]).process(css, { from: css.source.input.file })
  }
}
