import mergeWith from 'lodash/mergeWith'
import isFunction from 'lodash/isFunction'
import defaults from 'lodash/defaults'
import map from 'lodash/map'
import get from 'lodash/get'

const value = (valueToResolve, ...args) =>
  isFunction(valueToResolve) ? valueToResolve(...args) : valueToResolve

const mergeExtensions = ({ extend, ...theme }) =>
  mergeWith(theme, extend, (themeValue, extensions) => {
    if (!isFunction(themeValue) && !isFunction(extensions)) {
      return {
        ...themeValue,
        ...extensions,
      }
    }

    return resolveThemePath => ({
      ...value(themeValue, resolveThemePath),
      ...value(extensions, resolveThemePath),
    })
  })

const resolveFunctionKeys = object => {
  const resolveObjectPath = (key, defaultValue) => {
    const val = get(object, key, defaultValue)
    return isFunction(val) ? val(resolveObjectPath) : val
  }

  return Object.keys(object).reduce(
    (resolved, key) => ({
      ...resolved,
      [key]: isFunction(object[key]) ? object[key](resolveObjectPath) : object[key],
    }),
    {}
  )
}

export default configs =>
  defaults(
    {
      theme: resolveFunctionKeys(mergeExtensions(defaults({}, ...map(configs, 'theme')))),
      variants: defaults({}, ...map(configs, 'variants')),
    },
    ...configs
  )
