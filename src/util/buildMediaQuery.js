import _ from 'lodash'

export default function buildMediaQuery(breakpoints) {
  if (_.isString(breakpoints)) {
    breakpoints = { min: breakpoints }
  }

  if (!_.isArray(breakpoints)) {
    breakpoints = [breakpoints]
  }

  return _(breakpoints).map((breakpoint) => {
    return _(breakpoint).map((value, feature) => {
        feature = _.get(
          {
            min: 'min-width',
            max: 'max-width',
          },
          feature,
          feature
        )
        return `(${feature}: ${value})`
      }).join(' and ')
  }).join(', ')
}
