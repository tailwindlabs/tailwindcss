import _ from 'lodash'
import postcss from 'postcss'

import substituteTailwindAtRules from './lib/substituteTailwindAtRules'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import substituteVariantsAtRules from './lib/substituteVariantsAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

import generateUtilities from './legacy/generateUtilities'
import processPlugins from './util/processPlugins'

import defaultPlugins from './defaultPlugins'

export default function(getConfig) {
  return function(css) {
    const config = getConfig()
    const processedPlugins = processPlugins([
      ...defaultPlugins,
      ...config.plugins
    ], config)
    const utilities = generateUtilities(config, processedPlugins.utilities)

    return postcss([
      substituteTailwindAtRules(config, processedPlugins, utilities),
      evaluateTailwindFunctions(config),
      substituteVariantsAtRules(config, processedPlugins),
      substituteResponsiveAtRules(config),
      substituteScreenAtRules(config),
      substituteClassApplyAtRules(config, utilities),
    ]).process(css, { from: _.get(css, 'source.input.file') })
  }
}
