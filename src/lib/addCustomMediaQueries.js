import _ from 'lodash'
import postcss from 'postcss'

function buildMediaQuery(breakpoint) {
  if (_.isString(breakpoint)) {
    breakpoint = {min: breakpoint}
  }
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
