import { quickPluginTest } from '../util/run'

quickPluginTest('borderColor', {
  safelist: [
    // Arbitrary values
    'border-[#0088cc]',
    'border-[var(--my-value)]',
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
quickPluginTest('borderColor', {
  safelist: [
    // Arbitrary values
    'border-[#0088cc]',
    'border-[var(--my-value)]',
  ],
  corePlugins: ['borderOpacity'],
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
