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
        100: '#fee2e2',
        200: '#fecaca',
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
