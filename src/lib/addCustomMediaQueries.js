import _ from 'lodash'
import postcss from 'postcss'

function buildMediaQuery(breakpoints) {
  if (_.isString(breakpoints)) {
    breakpoints = {min: breakpoints}
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

export default function(options) {
  let breakpoints = options.breakpoints

  return function(css) {
    Object.keys(breakpoints).forEach(breakpoint => {
      const variableName = `--breakpoint-${breakpoint}`
      const mediaQuery = buildMediaQuery(breakpoints[breakpoint])
      const rule = postcss.atRule({
        name: 'custom-media',
        params: `${variableName} ${mediaQuery}`,
      })
      css.prepend(rule)
    })
  }
}
