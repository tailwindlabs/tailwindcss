import { quickPluginTest } from '../util/run'

quickPluginTest('stroke', {
  safelist: [
    // Arbitrary values
    'stroke-[#0088cc]',
    'stroke-[var(--my-value)]',
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
