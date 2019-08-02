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
  if (_.isObject(filePath) && !_.has(filePath, 'config')) {
    return undefined
  }

  if (_.isObject(filePath) && _.has(filePath, 'config')) {
    return path.resolve(filePath.config)
  }

  if (!_.isUndefined(filePath)) {
    return path.resolve(filePath)
  }

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
    formatCSS,
  ])
})

module.exports = plugin
