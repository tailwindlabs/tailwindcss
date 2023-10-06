import { quickPluginTest } from '../util/run'

quickPluginTest('ringColor', {
  safelist: [
    // Arbitrary values
    'ring-[#0088cc]',
    'ring-[var(--my-value)]',
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

// With `ringOpacity` plugin enabled
quickPluginTest('ringColor', {
  safelist: [
    // Arbitrary values
    'ring-[#0088cc]',
    'ring-[var(--my-value)]',
  ],
  corePlugins: ['ringOpacity'],
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
