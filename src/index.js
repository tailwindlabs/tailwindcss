import fs from 'fs'
import path from 'path'

import _ from 'lodash'
import postcss from 'postcss'
import stylefmt from 'stylefmt'

import registerConfigAsDependency from './lib/registerConfigAsDependency'
import substitutePreflightAtRule from './lib/substitutePreflightAtRule'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import generateUtilities from './lib/generateUtilities'
import substituteHoverableAtRules from './lib/substituteHoverableAtRules'
import substituteFocusableAtRules from './lib/substituteFocusableAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

const plugin = postcss.plugin('tailwind', config => {
  const plugins = []

  if (!_.isUndefined(config)) {
    plugins.push(registerConfigAsDependency(path.resolve(config)))
  }

  const lazyConfig = () => {
    if (_.isUndefined(config)) {
      return require('../defaultConfig')
    }

    delete require.cache[require.resolve(path.resolve(config))]
    return require(path.resolve(config))
  }

  return postcss(
    ...plugins,
    ...[
      substitutePreflightAtRule(lazyConfig),
      evaluateTailwindFunctions(lazyConfig),
      generateUtilities(lazyConfig),
      substituteHoverableAtRules(lazyConfig),
      substituteFocusableAtRules(lazyConfig),
      substituteResponsiveAtRules(lazyConfig),
      substituteScreenAtRules(lazyConfig),
      substituteClassApplyAtRules(lazyConfig),
      stylefmt
    ]
  )
})

plugin.defaultConfig = function() {
  return _.cloneDeep(require('../defaultConfig'))
}

module.exports = plugin
