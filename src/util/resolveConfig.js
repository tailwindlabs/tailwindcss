import mergeWith from 'lodash/mergeWith'
import isFunction from 'lodash/isFunction'
import defaults from 'lodash/defaults'
import map from 'lodash/map'
import get from 'lodash/get'

function resolveFunctionKeys(object) {
  return Object.keys(object).reduce((resolved, key) => {
    return {
      ...resolved,
      [key]: isFunction(object[key]) ? object[key](object) : object[key],
    }
  }, {})
}

function without(object, key) {
  return (({[key]: _, ...rest }) => rest)(object)
}

function mergeExtensions(theme) {
  return mergeWith({}, without(theme, 'extend'), theme.extend, (_, value, key) => {
    return isFunction(theme[key])
      ? mergedTheme => ({
          ...theme[key](mergedTheme),
          ...get(theme.extend, key, {})
        })
      : {
          ...theme[key],
          ...get(theme.extend, key, {}),
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
