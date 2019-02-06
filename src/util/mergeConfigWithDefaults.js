import _ from 'lodash'

function resolveFunctionKeys(object) {
  return Object.keys(object).reduce((resolved, key) => {
    return {
      ...resolved,
      [key]: _.isFunction(object[key]) ? object[key](object) : object[key]
    }
  }, {})
}

export default function(userConfig, defaultConfig) {
  return _.defaults(
    {
      theme: resolveFunctionKeys(_.defaults(userConfig.theme, defaultConfig.theme)),
      variants: _.defaults(userConfig.variants, defaultConfig.variants),
    },
    userConfig,
    defaultConfig
  )
}
