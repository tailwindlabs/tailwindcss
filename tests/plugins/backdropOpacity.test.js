import { quickPluginTest } from '../util/run'

quickPluginTest('backdropOpacity', {
  safelist: [
    // Arbitrary values
    'backdrop-opacity-[0.12]',
    'backdrop-opacity-[var(--my-value)]',
  ],
  theme: {
    opacity: {
      0: '0',
      50: '.5',
    },
  },
}).toMatchSnapshot()
