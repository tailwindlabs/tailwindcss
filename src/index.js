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
import substituteVariantsAtRules from './lib/substituteVariantsAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

function mergeConfigWithDefaults(config) {
  const defaultConfig = require('../defaultConfig')()
  _.defaults(config, defaultConfig)
  config.options = _.defaults(config.options, defaultConfig.options)
  config.options.modules = _.defaults(config.options.modules, defaultConfig.options.modules)
  return config
}

const plugin = postcss.plugin('tailwind', config => {
  const plugins = []

  if (!_.isUndefined(config)) {
    plugins.push(registerConfigAsDependency(path.resolve(config)))
  }

  const lazyConfig = () => {
    if (_.isUndefined(config)) {
      return require('../defaultConfig')()
    }

    delete require.cache[require.resolve(path.resolve(config))]
    return mergeConfigWithDefaults(require(path.resolve(config)))
  }

  return postcss(
    ...plugins,
    ...[
      substitutePreflightAtRule(lazyConfig),
      evaluateTailwindFunctions(lazyConfig),
      generateUtilities(lazyConfig),
      substituteHoverableAtRules(lazyConfig),
      substituteFocusableAtRules(lazyConfig),
      substituteVariantsAtRules(lazyConfig),
      substituteResponsiveAtRules(lazyConfig),
      substituteScreenAtRules(lazyConfig),
      substituteClassApplyAtRules(lazyConfig),
      stylefmt,
    ]
  )
})

plugin.defaultConfig = function() {
  // prettier-ignore
  throw new Error("`require('tailwindcss').defaultConfig()` is no longer a function, access it instead as `require('tailwindcss/defaultConfig')()`.")
}

module.exports = plugin
