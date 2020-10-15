import _ from 'lodash'
import functions from 'postcss-functions'

function findClosestExistingPath(theme, path) {
  const parts = _.toPath(path)
  do {
    parts.pop()

    if (_.hasIn(theme, parts)) break
  } while (parts.length)

  return parts
}

function buildError(root, theme, path) {
  const closestPath = findClosestExistingPath(theme, path).join('.') || 'theme'
  const closestValue = _.get(theme, closestPath, theme)

  let message = `"${path}" does not exist in your tailwind theme.\n`

  if (typeof closestValue === 'object') {
    message += `Valid keys for "${closestPath}" are: ${Object.keys(closestValue)
      .map(k => `"${k}"`)
      .join(', ')}`
  } else {
    message += `"${closestPath}" exists but is not an object.`
  }

  return root.error(message)
}

const themeTransforms = {
  fontSize(value) {
    return Array.isArray(value) ? value[0] : value
  },
}

function defaultTransform(value) {
  return Array.isArray(value) ? value.join(', ') : value
}

export default function(config) {
  return root =>
    functions({
      functions: {
        theme: (path, ...defaultValue) => {
          const trimmedPath = _.trim(path, `'"`)

          if (!defaultValue.length && !_.hasIn(config.theme, trimmedPath)) {
            throw buildError(root, config.theme, trimmedPath)
          }

          return _.thru(_.get(config.theme, trimmedPath, defaultValue), value => {
            const [themeSection] = trimmedPath.split('.')

            return _.get(themeTransforms, themeSection, defaultTransform)(value)
          })
        },
      },
    })(root)
}
