import _ from 'lodash'

export default function(userConfig, defaultConfig) {
  _.defaults(userConfig, defaultConfig)
  userConfig.modules = _.defaults(userConfig.modules, defaultConfig.modules)
  userConfig.options = _.defaults(userConfig.options, defaultConfig.options)
  return userConfig
}
