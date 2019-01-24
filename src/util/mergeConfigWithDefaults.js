import _ from 'lodash'

export default function(userConfig, defaultConfig) {
  return _.defaults(userConfig, defaultConfig)
}
