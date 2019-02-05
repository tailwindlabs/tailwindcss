import _ from 'lodash'

export default function(userConfig, defaultConfig) {
  return _.defaults(
    {
      theme: _.defaults(userConfig.theme, {
        ...defaultConfig.theme,
        backgroundColors: _.get(userConfig.theme, 'colors', defaultConfig.theme.backgroundColors),
        textColors: _.get(userConfig.theme, 'colors', defaultConfig.theme.textColors),
        borderColors: _.get(userConfig.theme, 'colors', defaultConfig.theme.borderColors),
      }),
      variants: _.defaults(userConfig.variants, defaultConfig.variants),
    },
    userConfig,
    defaultConfig
  )
}
