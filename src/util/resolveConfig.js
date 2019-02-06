import _ from 'lodash'

function resolveFunctionKeys(object) {
  return Object.keys(object).reduce((resolved, key) => {
    return {
      ...resolved,
      [key]: _.isFunction(object[key]) ? object[key](object) : object[key],
    }
  }, {})
}

export default function(configs) {
  return _.defaults(
    {
      theme: resolveFunctionKeys(_.defaults(..._.map(configs, 'theme'))),
      variants: _.defaults(..._.map(configs, 'variants')),
    },
    ...configs
  )
}
