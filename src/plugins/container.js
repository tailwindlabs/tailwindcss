/* eslint-disable no-shadow */
import _ from 'lodash'

function extractMinWidths(breakpoints) {
  return _.flatMap(breakpoints, breakpoints => {
    if (_.isString(breakpoints)) {
      breakpoints = { min: breakpoints }
    }

    if (!Array.isArray(breakpoints)) {
      breakpoints = [breakpoints]
    }

    return _(breakpoints)
      .filter(breakpoint => {
        return _.has(breakpoint, 'min') || _.has(breakpoint, 'min-width')
      })
      .map(breakpoint => {
        return _.get(breakpoint, 'min-width', breakpoint.min)
      })
      .value()
  })
}

module.exports = function() {
  return function({ addComponents, theme }) {
    const minWidths = extractMinWidths(theme('container.screens', theme('screens')))

    const atRules = _(minWidths)
      .sortBy(minWidth => parseInt(minWidth))
      .sortedUniq()
      .map(minWidth => {
        return {
          [`@media (min-width: ${minWidth})`]: {
            '.container': {
              'max-width': minWidth,
            },
          },
        }
      })
      .value()

    addComponents([
      {
        '.container': Object.assign(
          { width: '100%' },
          theme('container.center', false) ? { marginRight: 'auto', marginLeft: 'auto' } : {},
          _.has(theme('container', {}), 'padding')
            ? {
                paddingRight: theme('container.padding'),
                paddingLeft: theme('container.padding'),
              }
            : {}
        ),
      },
      ...atRules,
    ])
  }
}
