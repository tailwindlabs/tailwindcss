import { quickPluginTest } from '../util/run'

quickPluginTest('backgroundColor', {
  safelist: [
    // Arbitrary values
    'bg-[#0088cc]',
    'bg-[var(--my-value)]',
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

// With `backgroundOpacity` plugin enabled
quickPluginTest('backgroundColor', {
  safelist: [
    // Arbitrary values
    'bg-[#0088cc]',
    'bg-[var(--my-value)]',
  ],
  corePlugins: ['backgroundOpacity'],
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
