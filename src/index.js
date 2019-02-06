import path from 'path'

import _ from 'lodash'
import postcss from 'postcss'
import perfectionist from 'perfectionist'

import registerConfigAsDependency from './lib/registerConfigAsDependency'
import processTailwindFeatures from './processTailwindFeatures'
import resolveConfig from './util/resolveConfig'

const plugin = postcss.plugin('tailwind', config => {
  const plugins = []

  if (!_.isUndefined(config) && !_.isObject(config)) {
    plugins.push(registerConfigAsDependency(path.resolve(config)))
  }

  const getConfig = () => {
    if (_.isUndefined(config)) {
      return resolveConfig([require('../defaultConfig')()])
    }

    if (!_.isObject(config)) {
      delete require.cache[require.resolve(path.resolve(config))]
    }

    return resolveConfig([
      _.isObject(config) ? config : require(path.resolve(config)),
      require('../defaultConfig')(),
    ])
  }

  return postcss([
    ...plugins,
    processTailwindFeatures(getConfig),
    perfectionist({
      cascade: true,
      colorShorthand: true,
      indentSize: 2,
      maxSelectorLength: 1,
      maxValueLength: false,
      trimLeadingZero: true,
      trimTrailingZeros: true,
      zeroLengthNoUnit: false,
    }),
  ])
})

plugin.defaultConfig = function() {
  // prettier-ignore
  throw new Error("`require('tailwindcss').defaultConfig()` is no longer a function, access it instead as `require('tailwindcss/defaultConfig')()`.")
}

module.exports = plugin
