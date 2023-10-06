import { quickPluginTest } from '../util/run'

quickPluginTest('caretColor', {
  safelist: [
    // Arbitrary values
    'caret-[#0088cc]',
    'caret-[var(--my-value)]',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      black: '#000',
      red: {
        100: '#f00',
        200: '#f00',
      },
    },
    opacity: {
      0: '0',
      50: '.5',
    },
  },
}).toMatchSnapshot()
