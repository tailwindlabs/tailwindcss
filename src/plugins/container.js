/* eslint-disable no-shadow */
import _ from 'lodash'

const extractMinWidths = breakpoints =>
  _.flatMap(breakpoints, breakpoints => {
    if (_.isString(breakpoints)) {
      breakpoints = { min: breakpoints }
    }

    if (!_.isArray(breakpoints)) {
      breakpoints = [breakpoints]
    }

    return _(breakpoints)
      .filter(breakpoint => _.has(breakpoint, 'min') || _.has(breakpoint, 'min-width'))
      .map(breakpoint => _.get(breakpoint, 'min-width', breakpoint.min))
      .value()
  })

module.exports = () => ({ addComponents, theme }) => {
  const minWidths = extractMinWidths(theme('container.screens', theme('screens')))

  const atRules = _.map(minWidths, minWidth => ({
    [`@media (min-width: ${minWidth})`]: {
      '.container': {
        'max-width': minWidth,
      },
    },
  }))

  addComponents([
    {
      '.container': {
        width: '100%',
        ...(theme('container.center', false) ? { marginRight: 'auto', marginLeft: 'auto' } : {}),
        ...(_.has(theme('container', {}), 'padding')
          ? {
              paddingRight: theme('container.padding'),
              paddingLeft: theme('container.padding'),
            }
          : {}),
      },
    },
    ...atRules,
  ])
}
