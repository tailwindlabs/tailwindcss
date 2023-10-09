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
        100: '#fee2e2',
        200: '#fecaca',
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
