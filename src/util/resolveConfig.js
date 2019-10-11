import some from 'lodash/some'
import mergeWith from 'lodash/mergeWith'
import assignWith from 'lodash/assignWith'
import isFunction from 'lodash/isFunction'
import isUndefined from 'lodash/isUndefined'
import defaults from 'lodash/defaults'
import map from 'lodash/map'
import reduce from 'lodash/reduce'
import toPath from 'lodash/toPath'
import negateValue from './negateValue'

const configUtils = {
  negative(scale) {
    return Object.keys(scale)
      .filter(key => scale[key] !== '0')
      .reduce(
        (negativeScale, key) => ({
          ...negativeScale,
          [`-${key}`]: negateValue(scale[key]),
        }),
        {}
      )
  },
}

function value(valueToResolve, ...args) {
  return isFunction(valueToResolve) ? valueToResolve(...args) : valueToResolve
}

function mergeThemes(themes) {
  const theme = (({ extend, ...t }) => t)(themes.reduce((merged, t) => {
    return defaults(merged, t)
  }, {}))

  // In order to resolve n config objects, we combine all of their `extend` properties
  // into arrays instead of objects so they aren't overridden.
  const extend = themes.reduce((merged, { extend }) => {
    return mergeWith(merged, extend, (mergedValue, extendValue) => {
      if (isUndefined(mergedValue)) {
        return [extendValue]
      }

      if (Array.isArray(mergedValue)) {
        return [...mergedValue, extendValue]
      }

      return [mergedValue, extendValue]
    })
  }, {})

  return {
    ...theme,
    extend,
  }
}

function mergeExtensions({ extend, ...theme }) {
  return mergeWith(theme, extend, (themeValue, extensions) => {
    // The `extend` property is an array, so we need to check if it contains any functions
    if (!isFunction(themeValue) && !some(extensions, isFunction)) {
      return {
        ...themeValue,
        ...Object.assign({}, ...extensions),
      }
    }

    return (resolveThemePath, utils) => ({
      ...value(themeValue, resolveThemePath, utils),
      ...Object.assign({}, ...extensions.map(e => value(e, resolveThemePath, utils))),
    })
  })
}

function resolveFunctionKeys(object) {
  const resolveThemePath = (key, defaultValue) => {
    const path = toPath(key)

    let index = 0
    let val = object

    while (val !== undefined && val !== null && index < path.length) {
      val = val[path[index++]]
      val = isFunction(val) ? val(resolveThemePath) : val
    }

    return val === undefined ? defaultValue : val
  }

  return Object.keys(object).reduce((resolved, key) => {
    return {
      ...resolved,
      [key]: isFunction(object[key]) ? object[key](resolveThemePath, configUtils) : object[key],
    }
  }, {})
}

export default function resolveConfig(configs) {
  return defaults(
    {
      theme: resolveFunctionKeys(mergeExtensions(mergeThemes(map(configs, 'theme')))),
      variants: (firstVariants => {
        return Array.isArray(firstVariants)
          ? firstVariants
          : defaults({}, ...map(configs, 'variants'))
      })(defaults({}, ...map(configs)).variants),
    },
    ...configs
  )
}
