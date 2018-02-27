import path from 'path'

import _ from 'lodash'
import postcss from 'postcss'
import perfectionist from 'perfectionist'

import registerConfigAsDependency from './lib/registerConfigAsDependency'
import substituteTailwindAtRules from './lib/substituteTailwindAtRules'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import substituteVariantsAtRules from './lib/substituteVariantsAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

import mergeConfigWithDefaults from './util/mergeConfigWithDefaults'

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
    return mergeConfigWithDefaults(require(path.resolve(config)), require('../defaultConfig')())
  }

  return postcss(
    ...plugins,
    ...[
      substituteTailwindAtRules(lazyConfig),
      evaluateTailwindFunctions(lazyConfig),
      substituteVariantsAtRules(lazyConfig),
      substituteResponsiveAtRules(lazyConfig),
      substituteScreenAtRules(lazyConfig),
      substituteClassApplyAtRules(lazyConfig),
      perfectionist({
        cascade: true,
        colorShorthand: true,
        indentSize: 2,
        maxSelectorLength: 1,
        maxValueLength: false,
        trimLeadingZero: true,
        trimTrailingZeros: true,
      }),
    ]
  )
})

plugin.defaultConfig = function() {
  // prettier-ignore
  throw new Error("`require('tailwindcss').defaultConfig()` is no longer a function, access it instead as `require('tailwindcss/defaultConfig')()`.")
}

module.exports = plugin
