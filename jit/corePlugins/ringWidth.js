const dlv = require('dlv')
const toRgba = require('../../lib/util/withAlphaVariable').toRgba
const { asLength, nameClass } = require('../pluginUtils')

function safeCall(callback, defaultValue) {
  try {
    return callback()
  } catch (_error) {
    return defaultValue
  }
}

module.exports = function ({ addBase, matchUtilities, addUtilities, jit: { theme } }) {
  let ringColorDefault = (([r, g, b]) => {
    return `rgba(${r}, ${g}, ${b}, ${dlv(theme, ['ringOpacity', 'DEFAULT'], '0.5')})`
  })(safeCall(() => toRgba(dlv(theme, ['ringColor', 'DEFAULT'])), ['147', '197', '253']))

  let ringReset = {
    '*': {
      '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-ring-offset-width': dlv(theme, ['ringOffsetWidth', 'DEFAULT'], '0px'),
      '--tw-ring-offset-color': dlv(theme, ['ringOffsetColor', 'DEFAULT'], '#fff'),
      '--tw-ring-color': ringColorDefault,
      '--tw-ring-offset-shadow': '0 0 #0000',
      '--tw-ring-shadow': '0 0 #0000',
    },
  }

  addBase(ringReset)

  matchUtilities({
    ring: (modifier, { theme }) => {
      let value = asLength(modifier, theme['ringWidth'])

      if (value === undefined) {
        return []
      }

      return [
        {
          [nameClass('ring', modifier)]: {
            '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
            '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
            'box-shadow': [
              `var(--tw-ring-offset-shadow)`,
              `var(--tw-ring-shadow)`,
              `var(--tw-shadow, 0 0 #0000)`,
            ].join(', '),
          },
        },
      ]
    },
  })

  addUtilities({
    '.ring-inset': {
      '--tw-ring-inset': 'inset',
    },
  })
}
