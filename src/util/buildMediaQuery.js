import _ from 'lodash'

function isInvalidValue(value) {
  return !value || value === '' || value === 0 || value === '0' || value === '0px'
}

export default function buildMediaQuery(screens) {
  if (isInvalidValue(screens)) {
    return ''
  }

  if (_.isString(screens)) {
    screens = { min: screens }
  }

  if (!Array.isArray(screens)) {
    screens = [screens]
  }

  return _(screens)
    .map((screen) => {
      if (_.has(screen, 'raw')) {
        return screen.raw
      }

      return _(screen)
        .map((value, feature) => {
          feature = _.get(
            {
              min: 'min-width',
              max: 'max-width',
            },
            feature,
            feature
          )

          if (isInvalidValue(value)) {
            return ''
          }

          return `(${feature}: ${value})`
        })
        .uniq()
        .filter((v) => !isInvalidValue(v))
        .join(' and ')
    })
    .filter((v) => !isInvalidValue(v))
    .join(', ')
}
