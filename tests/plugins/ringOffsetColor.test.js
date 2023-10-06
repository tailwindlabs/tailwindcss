import { quickPluginTest } from '../util/run'

quickPluginTest('ringOffsetColor', {
  safelist: [
    // Arbitrary values
    'ring-offset-[#0088cc]',
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
