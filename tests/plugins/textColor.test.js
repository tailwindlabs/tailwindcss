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
        100: '#fee2e2',
        200: '#fecaca',
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
