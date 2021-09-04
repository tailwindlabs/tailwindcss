function extractMinWidths(breakpoints) {
  return Object.values(breakpoints ?? {}).flatMap((breakpoints) => {
    if (typeof breakpoints === 'string') {
      breakpoints = { min: breakpoints }
    }

    if (!Array.isArray(breakpoints)) {
      breakpoints = [breakpoints]
    }

    return breakpoints
      .filter((breakpoint) => {
        return breakpoint?.hasOwnProperty?.('min') || breakpoint?.hasOwnProperty('min-width')
      })
      .map((breakpoint) => {
        return breakpoint['min-width'] ?? breakpoint.min
      })
  })
}

function mapMinWidthsToPadding(minWidths, screens, paddings) {
  if (typeof paddings === 'undefined') {
    return []
  }

  if (!(typeof paddings === 'object' && paddings !== null)) {
    return [
      {
        screen: 'DEFAULT',
        minWidth: 0,
        padding: paddings,
      },
    ]
  }

  let mapping = []

  if (paddings.DEFAULT) {
    mapping.push({
      screen: 'DEFAULT',
      minWidth: 0,
      padding: paddings.DEFAULT,
    })
  }

  for (let minWidth of minWidths) {
    for (let [screen, value] of Object.entries(screens)) {
      let screenMinWidth =
        typeof value === 'object' && value !== null ? value.min || value['min-width'] : value

      if (`${screenMinWidth}` === `${minWidth}`) {
        mapping.push({
          screen,
          minWidth,
          padding: paddings[screen],
        })
      }
    }
  }

  return mapping
}

module.exports = function () {
  return function ({ addComponents, theme, variants }) {
    let screens = theme('container.screens', theme('screens'))
    let minWidths = extractMinWidths(screens)
    let paddings = mapMinWidthsToPadding(minWidths, screens, theme('container.padding'))

    let generatePaddingFor = (minWidth) => {
      let paddingConfig = paddings.find((padding) => `${padding.minWidth}` === `${minWidth}`)

      if (!paddingConfig) {
        return {}
      }

      return {
        paddingRight: paddingConfig.padding,
        paddingLeft: paddingConfig.padding,
      }
    }

    let atRules = Array.from(
      new Set(minWidths.slice().sort((a, z) => parseInt(a) - parseInt(z)))
    ).map((minWidth) => ({
      [`@media (min-width: ${minWidth})`]: {
        '.container': {
          'max-width': minWidth,
          ...generatePaddingFor(minWidth),
        },
      },
    }))

    addComponents(
      [
        {
          '.container': Object.assign(
            { width: '100%' },
            theme('container.center', false) ? { marginRight: 'auto', marginLeft: 'auto' } : {},
            generatePaddingFor(0)
          ),
        },
        ...atRules,
      ],
      variants('container')
    )
  }
}
