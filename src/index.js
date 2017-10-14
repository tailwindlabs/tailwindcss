import fs from 'fs'
import _ from 'lodash'
import postcss from 'postcss'
import stylefmt from 'stylefmt'

import defaultConfig from './defaultConfig'
import mergeConfig from './util/mergeConfig'

import substituteResetAtRule from './lib/substituteResetAtRule'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import generateUtilities from './lib/generateUtilities'
import substituteHoverableAtRules from './lib/substituteHoverableAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

const plugin = postcss.plugin('tailwind', (options = {}) => {
  const config = mergeConfig(defaultConfig, options)

  return postcss([
    substituteResetAtRule(config),
    evaluateTailwindFunctions(config),
    generateUtilities(config),
    substituteHoverableAtRules(config),
    substituteResponsiveAtRules(config),
    substituteScreenAtRules(config),
    substituteClassApplyAtRules(config),
    stylefmt,
  ])
})

module.exports = plugin
