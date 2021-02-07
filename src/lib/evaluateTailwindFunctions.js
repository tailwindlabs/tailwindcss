import _ from 'lodash'
import functions from 'postcss-functions'
import didYouMean from 'didyoumean'
import transformThemeValue from '../util/transformThemeValue'

function findClosestExistingPath(theme, path) {
  const parts = _.toPath(path)
  do {
    parts.pop()

    if (_.hasIn(theme, parts)) break
  } while (parts.length)

  return parts.length ? parts : undefined
}

function pathToString(path) {
  if (typeof path === 'string') return path
  return path.reduce((acc, cur, i) => {
    if (cur.includes('.')) return `${acc}[${cur}]`
    return i === 0 ? cur : `${acc}.${cur}`
  }, '')
}

function list(items) {
  return items.map((key) => `'${key}'`).join(', ')
}

function listKeys(obj) {
  return list(Object.keys(obj))
}

function validatePath(config, path, defaultValue) {
  const pathString = Array.isArray(path) ? pathToString(path) : _.trim(path, `'"`)
  const pathSegments = Array.isArray(path) ? path : _.toPath(pathString)
  const value = _.get(config.theme, pathString, defaultValue)

  if (typeof value === 'undefined') {
    let error = `'${pathString}' does not exist in your theme config.`
    const parentSegments = pathSegments.slice(0, -1)
    const parentValue = _.get(config.theme, parentSegments)

    if (_.isObject(parentValue)) {
      const validKeys = Object.keys(parentValue).filter(
        (key) => validatePath(config, [...parentSegments, key]).isValid
      )
      const suggestion = didYouMean(_.last(pathSegments), validKeys)
      if (suggestion) {
        error += ` Did you mean '${pathToString([...parentSegments, suggestion])}'?`
      } else if (validKeys.length > 0) {
        error += ` '${pathToString(parentSegments)}' has the following valid keys: ${list(
          validKeys
        )}`
      }
    } else {
      const closestPath = findClosestExistingPath(config.theme, pathString)
      if (closestPath) {
        const closestValue = _.get(config.theme, closestPath)
        if (_.isObject(closestValue)) {
          error += ` '${pathToString(closestPath)}' has the following keys: ${listKeys(
            closestValue
          )}`
        } else {
          error += ` '${pathToString(closestPath)}' is not an object.`
        }
      } else {
        error += ` Your theme has the following top-level keys: ${listKeys(config.theme)}`
      }
    }

    return {
      isValid: false,
      error,
    }
  }

  if (
    !(
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'function' ||
      value instanceof String ||
      value instanceof Number ||
      Array.isArray(value)
    )
  ) {
    let error = `'${pathString}' was found but does not resolve to a string.`

    if (_.isObject(value)) {
      let validKeys = Object.keys(value).filter(
        (key) => validatePath(config, [...pathSegments, key]).isValid
      )
      if (validKeys.length) {
        error += ` Did you mean something like '${pathToString([...pathSegments, validKeys[0]])}'?`
      }
    }

    return {
      isValid: false,
      error,
    }
  }

  const [themeSection] = pathSegments

  return {
    isValid: true,
    value: transformThemeValue(themeSection)(value),
  }
}

export default function (config) {
  return (root) =>
    functions({
      functions: {
        theme: (path, ...defaultValue) => {
          const { isValid, value, error } = validatePath(
            config,
            path,
            defaultValue.length ? defaultValue : undefined
          )

          if (!isValid) {
            throw root.error(error)
          }

          return value
        },
      },
    })(root)
}
