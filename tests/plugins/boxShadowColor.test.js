import { quickPluginTest } from '../util/run'

quickPluginTest('boxShadowColor', {
  safelist: [
    // Arbitrary values
    'shadow-[#0088cc]',
    'shadow-[var(--my-value)]',
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
