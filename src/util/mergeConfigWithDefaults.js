import _ from 'lodash'

export default function(userConfig, defaultConfig) {
  return _.defaults(
    {
      theme: _.defaults(userConfig.theme, defaultConfig.theme),
      variants: _.defaults(userConfig.variants, defaultConfig.variants),
    },
    userConfig,
    defaultConfig
  )
}
