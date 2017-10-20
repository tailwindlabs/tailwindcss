import fs from 'fs'
import path from 'path'

import _ from 'lodash'
import postcss from 'postcss'
import stylefmt from 'stylefmt'

import defaultConfig from '../defaultConfig'
import mergeConfig from './util/mergeConfig'

import substituteResetAtRule from './lib/substituteResetAtRule'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import generateUtilities from './lib/generateUtilities'
import substituteHoverableAtRules from './lib/substituteHoverableAtRules'
import substituteFocusableAtRules from './lib/substituteFocusableAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

const plugin = postcss.plugin('tailwind', (options = {}) => {
  if (_.isString(options)) {
    options = require(path.resolve(options))
  }

  const config = mergeConfig(defaultConfig, options)

  return postcss([
    substituteResetAtRule(config),
    evaluateTailwindFunctions(config),
    generateUtilities(config),
    substituteHoverableAtRules(config),
    substituteFocusableAtRules(config),
    substituteResponsiveAtRules(config),
    substituteScreenAtRules(config),
    substituteClassApplyAtRules(config),
    stylefmt,
  ])
})

module.exports = plugin
