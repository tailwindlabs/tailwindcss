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

function mapMinWidthsToPadding(minWidths, screens, paddings) {
  if (typeof paddings === 'undefined') {
    return []
  }

  if (!_.isObject(paddings)) {
    return [
      {
        screen: 'default',
        minWidth: 0,
        padding: paddings,
      },
    ]
  }

  const mapping = []

  if (paddings.default) {
    mapping.push({
      screen: 'default',
      minWidth: 0,
      padding: paddings.default,
    })
  }

  _.each(minWidths, minWidth => {
    Object.keys(screens).forEach(screen => {
      if (`${screens[screen]}` === `${minWidth}`) {
        mapping.push({
          screen,
          minWidth,
          padding: paddings[screen],
        })
      }
    })
  })

  return mapping
}

module.exports = function() {
  return function({ addComponents, theme }) {
    const screens = theme('container.screens', theme('screens'))
    const minWidths = extractMinWidths(screens)
    const paddings = mapMinWidthsToPadding(minWidths, screens, theme('container.padding'))

    const generatePaddingFor = minWidth => {
      const paddingConfig = _.find(paddings, padding => `${padding.minWidth}` === `${minWidth}`)

      if (!paddingConfig) {
        return {}
      }

      return {
        paddingRight: paddingConfig.padding,
        paddingLeft: paddingConfig.padding,
      }
    }

    const atRules = _(minWidths)
      .sortBy(minWidth => parseInt(minWidth))
      .sortedUniq()
      .map(minWidth => {
        return {
          [`@media (min-width: ${minWidth})`]: {
            '.container': {
              'max-width': minWidth,
              ...generatePaddingFor(minWidth),
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
          generatePaddingFor(0)
        ),
      },
      ...atRules,
    ])
  }
}
