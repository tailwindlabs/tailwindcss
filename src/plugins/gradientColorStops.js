import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'
import { withAlphaValue } from '../util/withAlphaVariable'

function transparentTo(value) {
  return withAlphaValue(value, 0, 'rgba(255, 255, 255, 0)')
}

export default function () {
  return function ({ matchUtilities, theme, variants }) {
    let options = {
      values: flattenColorPalette(theme('gradientColorStops')),
      variants: variants('gradientColorStops'),
      type: 'any',
    }

    matchUtilities(
      {
        from: (value) => {
          let transparentToValue = transparentTo(value)

          return {
            '--tw-gradient-from': toColorValue(value, 'from'),
            '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to, ${transparentToValue})`,
          }
        },
      },
      options
    )
    matchUtilities(
      {
        via: (value) => {
          let transparentToValue = transparentTo(value)

          return {
            '--tw-gradient-stops': `var(--tw-gradient-from), ${toColorValue(
              value,
              'via'
            )}, var(--tw-gradient-to, ${transparentToValue})`,
          }
        },
      },
      options
    )
    matchUtilities(
      {
        to: (value) => {
          return { '--tw-gradient-to': toColorValue(value, 'to') }
        },
      },
      options
    )
  }
}
