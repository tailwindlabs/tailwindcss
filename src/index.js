import path from 'path'
import fs from 'fs'

import _ from 'lodash'
import postcss from 'postcss'

import registerConfigAsDependency from './lib/registerConfigAsDependency'
import processTailwindFeatures from './processTailwindFeatures'
import formatCSS from './lib/formatCSS'
import resolveConfig from './util/resolveConfig'
import { defaultConfigFile } from './constants'

import defaultConfig from '../stubs/defaultConfig.stub.js'

function resolveConfigPath(filePath) {
  // require('tailwindcss')({ theme: ..., variants: ... })
  if (_.isObject(filePath) && !_.has(filePath, 'config') && !_.isEmpty(filePath)) {
    return undefined
  }

  // require('tailwindcss')({ config: 'custom-config.js' })
  if (_.isObject(filePath) && _.has(filePath, 'config') && _.isString(filePath.config)) {
    return path.resolve(filePath.config)
  }

  // require('tailwindcss')({ config: { theme: ..., variants: ... } })
  if (_.isObject(filePath) && _.has(filePath, 'config') && _.isObject(filePath.config)) {
    undefined
  }

  // require('tailwindcss')('custom-config.js')
  if (_.isString(filePath)) {
    return path.resolve(filePath)
  }

  // require('tailwindcss')
  try {
    const defaultConfigPath = path.resolve(defaultConfigFile)
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

  return resolveConfig([
    _.isObject(config) ? _.get(config, 'config', config) : require(config),
    defaultConfig,
  ])
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
    formatCSS,
  ])
})

module.exports = plugin
