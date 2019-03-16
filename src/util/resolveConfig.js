import mergeWith from 'lodash/mergeWith'
import isFunction from 'lodash/isFunction'
import defaults from 'lodash/defaults'
import map from 'lodash/map'
import get from 'lodash/get'

function resolveFunctionKeys(object) {
  const getKey = (key, defaultValue) => get(object, key, defaultValue)

  return Object.keys(object).reduce((resolved, key) => {
    return {
      ...resolved,
      [key]: isFunction(object[key]) ? object[key](getKey) : object[key],
    }
  }, {})
}

function mergeExtensions({ extend, ...theme }) {
  return mergeWith({}, theme, extend, (_, extensions, key) => {
    return isFunction(theme[key])
      ? mergedTheme => ({
          ...theme[key](mergedTheme),
          ...extensions,
        })
      : {
          ...theme[key],
          ...extensions,
        }
  })
}

export default function(configs) {
  return defaults(
    {
      theme: resolveFunctionKeys(mergeExtensions(defaults(...map(configs, 'theme')))),
      variants: defaults(...map(configs, 'variants')),
    },
    ...configs
  )
}
