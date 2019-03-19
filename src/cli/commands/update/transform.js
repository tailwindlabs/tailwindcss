import { cloneDeep, get, isFunction } from 'lodash'

import defaultConfig from '../../../../stubs/defaultConfig.stub.js'

const keyMap = {
  backgroundColor: 'backgroundColors',
  borderColor: 'borderColors',
  borderWidth: 'borderWidths',
  flexDirection: 'flex',
  flexWrap: 'flex',
  alignItems: 'flex',
  alignSelf: 'flex',
  justifyContent: 'flex',
  alignContent: 'flex',
  flexGrow: 'flex',
  flexShrink: 'flex',
  fontFamily: 'fonts',
  lineHeight: 'leading',
  listStylePosition: 'lists',
  listStyleType: 'lists',
  boxShadow: 'shadows',
  fill: 'svgFill',
  stroke: 'svgStroke',
  textColor: 'textColors',
  fontSize: 'textSizes',
  fontStyle: 'textStyle',
  textTransform: 'textStyle',
  textDecoration: 'textStyle',
  fontSmoothing: 'textStyle',
  letterSpacing: 'tracking',
  wordBreak: 'whitespace',
}

/**
 * Checks if the provided object is a container plugin standin
 *
 * @param {object} obj
 * @return {boolean}
 */
function isContainerPlugin(obj) {
  return get(obj, 'plugin') === 'container'
}

/**
 * Transforms old configuration format to new configuration format
 *
 * @param {object} oldConfig
 * @return {object}
 */
export default function(oldConfig) {
  const newConfig = cloneDeep(defaultConfig)

  // Theme
  Object.keys(newConfig.theme).forEach(key => {
    newConfig.theme[key] = get(oldConfig, get(keyMap, key, key), defaultConfig.theme[key])
  })

  // Variants
  Object.keys(newConfig.variants).forEach(key => {
    const value = get(oldConfig.modules, get(keyMap, key, key), defaultConfig.variants[key])
    value ? (newConfig.variants[key] = value) : (newConfig.corePlugins[key] = false)
  })

  // Options and plugins
  Object.assign(newConfig, {
    ...oldConfig.options,
    plugins: oldConfig.plugins.filter(isFunction),
  })

  // Container plugin
  const containerPlugin = oldConfig.plugins.find(isContainerPlugin)
  !containerPlugin && (newConfig.corePlugins.container = false)
  newConfig.theme.container = get(containerPlugin, 'options', {})

  return newConfig
}
