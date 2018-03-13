/* eslint-disable no-shadow */
import _ from 'lodash'

function extractMinWidths(breakpoints) {
  return _.flatMap(breakpoints, breakpoints => {
    if (_.isString(breakpoints)) {
      breakpoints = { min: breakpoints }
    }

    if (!_.isArray(breakpoints)) {
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

module.exports = function(options) {
  return function({ addComponents, config }) {
    const screens = _.get(options, 'screens', config('screens'))

    const minWidths = extractMinWidths(screens)

    const atRules = _.map(minWidths, minWidth => {
      return {
        [`@media (min-width: ${minWidth})`]: {
          '.container': {
            'max-width': minWidth,
          },
        },
      }
    })

    addComponents([
      {
        '.container': Object.assign(
          { width: '100%' },
          _.get(options, 'center', false) ? { marginRight: 'auto', marginLeft: 'auto' } : {},
          _.has(options, 'padding')
            ? { paddingRight: options.padding, paddingLeft: options.padding }
            : {}
        ),
      },
      ...atRules,
    ])
  }
}
