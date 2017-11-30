import _ from 'lodash'

function mergeModules(userModules, defaultModules) {
  if (userModules === 'all') {
    return _.mapValues(defaultModules, () => ['responsive', 'hover', 'focus', 'group-hover'])
  }

  return _.defaults(userModules, defaultModules)
}

export default function(userConfig, defaultConfig) {
  _.defaults(userConfig, defaultConfig)
  userConfig.modules = mergeModules(userConfig.modules, defaultConfig.modules)
  userConfig.options = _.defaults(userConfig.options, defaultConfig.options)
  return userConfig
}
