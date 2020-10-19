import _ from 'lodash'
import functions from 'postcss-functions'

const themeTransforms = {
  fontSize(value) {
    return Array.isArray(value) ? value[0] : value
  },
  outline(value) {
    return Array.isArray(value) ? value[0] : value
  },
}

function defaultTransform(value) {
  return Array.isArray(value) ? value.join(', ') : value
}

export default function(config) {
  return functions({
    functions: {
      theme: (path, ...defaultValue) => {
        const trimmedPath = _.trim(path, `'"`)
        return _.thru(_.get(config.theme, trimmedPath, defaultValue), value => {
          const [themeSection] = trimmedPath.split('.')

          return _.get(themeTransforms, themeSection, defaultTransform)(value)
        })
      },
    },
  })
}
