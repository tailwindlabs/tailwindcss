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
        100: '#fee2e2',
        200: '#fecaca',
      },
    },
    opacity: {
      0: '0',
      50: '.5',
    },
  },
}).toMatchSnapshot()
