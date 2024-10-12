import type { PluginAPI } from './plugin-api'

module.exports = function ({ addBase, addVariant, addUtilities, matchUtilities }: PluginAPI) {
  addBase({
    div: {
      transform: 'skewY(-10deg)',
    },
  })

  addVariant('hover', ':hover')
  addVariant('marker', ['::marker', '* ::marker'])

  addUtilities({
    '.skew-10deg': {
      transform: 'skewY(-10deg)',
    },
  })

  matchUtilities(
    { skew: (value) => ({ transform: `skewY(${value})` }) },
    {
      values: {
        f10: '10deg',
      },
    },
  )
}
