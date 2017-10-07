import fs from 'fs'
import _ from 'lodash'
import postcss from 'postcss'
import stylefmt from 'stylefmt'

import defaultConfig from './defaultConfig'
import mergeConfig from './util/mergeConfig'

import generateUtilities from './lib/generateUtilities'
import substituteResetAtRule from './lib/substituteResetAtRule'
import substituteHoverableAtRules from './lib/substituteHoverableAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteBreakpointAtRules from './lib/substituteBreakpointAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

const plugin = postcss.plugin('tailwind', (options = {}) => {
  const config = mergeConfig(defaultConfig, options)

  return postcss([
    substituteResetAtRule(config),
    generateUtilities(config),
    substituteHoverableAtRules(config),
    substituteResponsiveAtRules(config),
    substituteBreakpointAtRules(config),
    substituteClassApplyAtRules(config),
    stylefmt,
  ])
})

module.exports = plugin
