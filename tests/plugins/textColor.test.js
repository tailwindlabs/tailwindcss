import { quickPluginTest } from '../util/run'

quickPluginTest('textColor', {
  safelist: [
    // Arbitrary values
    'text-[#0088cc]',
    'text-[var(--my-value)]',
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

// With `textOpacity` plugin enabled
quickPluginTest('textColor', {
  safelist: [
    // Arbitrary values
    'text-[#0088cc]',
    'text-[var(--my-value)]',
  ],
  corePlugins: ['textOpacity'],
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
