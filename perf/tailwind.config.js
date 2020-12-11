let colors = require('../colors')
module.exports = {
  purge: [],
  darkMode: 'class',
  theme: {
    extend: { colors },
  },
  variants: [
    'responsive',
    'group-hover',
    'group-focus',
    'hover',
    'focus-within',
    'focus-visible',
    'focus',
    'active',
    'visited',
    'disabled',
    'checked',
  ],
  plugins: [],
}
