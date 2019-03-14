import path from 'path'
import fs from 'fs'

import _ from 'lodash'
import postcss from 'postcss'
import perfectionist from 'perfectionist'

import registerConfigAsDependency from './lib/registerConfigAsDependency'
import processTailwindFeatures from './processTailwindFeatures'
import resolveConfig from './util/resolveConfig'

import defaultConfig from '../stubs/defaultConfig.stub.js'

function resolveConfigPath(filePath) {
  if (_.isObject(filePath)) {
    return undefined
  }

  if (!_.isUndefined(filePath)) {
    return path.resolve(filePath)
  }

  try {
    const defaultConfigPath = path.resolve('./tailwind.config.js')
    fs.accessSync(defaultConfigPath)
    return defaultConfigPath
  } catch (err) {
    return undefined
  }
}

const getConfigFunction = config => () => {
  if (_.isUndefined(config) && !_.isObject(config)) {
    return resolveConfig([defaultConfig])
  }

  if (!_.isObject(config)) {
    delete require.cache[require.resolve(config)]
  }

  return resolveConfig([_.isObject(config) ? config : require(config), defaultConfig])
}

const plugin = postcss.plugin('tailwind', config => {
  const plugins = []
  const resolvedConfigPath = resolveConfigPath(config)

  if (!_.isUndefined(resolvedConfigPath)) {
    plugins.push(registerConfigAsDependency(resolvedConfigPath))
  }

  return postcss([
    ...plugins,
    processTailwindFeatures(getConfigFunction(resolvedConfigPath || config)),
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
