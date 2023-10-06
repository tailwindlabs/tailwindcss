import { quickPluginTest } from '../util/run'

quickPluginTest('divideColor', {
  safelist: [
    // Arbitrary values
    'divide-[#0088cc]',
    'divide-[var(--my-value)]',
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
  },
}).toMatchSnapshot()

// With the `divideOpacity` plugin enabled
quickPluginTest('divideColor', {
  safelist: [
    // Arbitrary values
    'divide-[#0088cc]',
    'divide-[var(--my-value)]',
  ],
  corePlugins: ['divideOpacity'],
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
