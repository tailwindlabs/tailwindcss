import fs from 'fs'
import path from 'path'

import _ from 'lodash'
import postcss from 'postcss'
import stylefmt from 'stylefmt'

import substitutePreflightAtRule from './lib/substitutePreflightAtRule'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import generateUtilities from './lib/generateUtilities'
import substituteHoverableAtRules from './lib/substituteHoverableAtRules'
import substituteFocusableAtRules from './lib/substituteFocusableAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

const plugin = postcss.plugin('tailwind', (config) => {
  if (_.isUndefined(config)) {
    config = require('../defaultConfig')
  }

  if (_.isString(config)) {
    config = require(path.resolve(config))
  }

  return postcss([
    substitutePreflightAtRule(config),
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

plugin.defaultConfig = function () {
  return _.cloneDeep(require('../defaultConfig'))
}

module.exports = plugin
