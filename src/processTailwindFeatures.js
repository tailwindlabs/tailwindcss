import path from 'path'

import _ from 'lodash'
import postcss from 'postcss'

import registerConfigAsDependency from './lib/registerConfigAsDependency'
import substituteTailwindAtRules from './lib/substituteTailwindAtRules'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import substituteVariantsAtRules from './lib/substituteVariantsAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

export default function(lazyConfig) {
  const config = lazyConfig()

  return postcss([
    substituteTailwindAtRules(config),
    evaluateTailwindFunctions(config),
    substituteVariantsAtRules(config),
    substituteResponsiveAtRules(config),
    substituteScreenAtRules(config),
    substituteClassApplyAtRules(config),
  ])
}
