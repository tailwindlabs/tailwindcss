import mergeWith from 'lodash/mergeWith'
import isFunction from 'lodash/isFunction'
import defaults from 'lodash/defaults'
import map from 'lodash/map'
import toPath from 'lodash/toPath'

const configUtils = {
  negative(scale) {
    return Object.keys(scale)
      .filter(key => scale[key] !== '0')
      .reduce(
        (negativeScale, key) => ({
          ...negativeScale,
          [`-${key}`]: `-${scale[key]}`,
        }),
        {}
      )
  },
}

function value(valueToResolve, ...args) {
  return isFunction(valueToResolve) ? valueToResolve(...args) : valueToResolve
}

function mergeExtensions({ extend, ...theme }) {
  return mergeWith(theme, extend, (themeValue, extensions) => {
    if (!isFunction(themeValue) && !isFunction(extensions)) {
      return {
        ...themeValue,
        ...extensions,
      }
    }

    return (resolveThemePath, utils) => ({
      ...value(themeValue, resolveThemePath, utils),
      ...value(extensions, resolveThemePath, utils),
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

  function createObject(newObject) {
    function resolveFunction(otherObject, key) {
      if (isFunction(otherObject[key])) {
        return otherObject[key](resolveThemePath, configUtils)
      } else {
        if (Array.isArray(otherObject[key])) {
          return otherObject[key]
        } else if (typeof object === 'object') {
          return createObject(otherObject[key])
        }
        return otherObject[key]
      }
    }

    if (typeof newObject === 'object') {
      return Object.keys(newObject).reduce((resolved, key) => {
        return {
          ...resolved,
          [key]: resolveFunction(newObject, key),
        }
      }, {})
    } else {
      return newObject
    }
  }

  return createObject(object)
}

export default function resolveConfig(configs) {
  return defaults(
    {
      theme: resolveFunctionKeys(mergeExtensions(defaults({}, ...map(configs, 'theme')))),
      variants: (firstVariants => {
        return Array.isArray(firstVariants)
          ? firstVariants
          : defaults({}, ...map(configs, 'variants'))
      })(defaults({}, ...map(configs)).variants),
    },
    ...configs
  )
}
