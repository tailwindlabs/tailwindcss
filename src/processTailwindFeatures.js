import _ from 'lodash'
import postcss from 'postcss'

import substituteTailwindAtRules from './lib/substituteTailwindAtRules'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import substituteVariantsAtRules from './lib/substituteVariantsAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

import corePlugins from './corePlugins'
import processPlugins from './util/processPlugins'

export default getConfig => css => {
  const config = getConfig()
  const processedPlugins = processPlugins([...corePlugins(config), ...config.plugins], config)

  return postcss([
    substituteTailwindAtRules(config, processedPlugins),
    evaluateTailwindFunctions(config),
    substituteVariantsAtRules(config, processedPlugins),
    substituteResponsiveAtRules(config),
    substituteScreenAtRules(config),
    substituteClassApplyAtRules(config, processedPlugins.utilities),
  ]).process(css, { from: _.get(css, 'source.input.file') })
}
