import { quickPluginTest } from '../util/run'

quickPluginTest('divideOpacity', {
  safelist: [
    // Arbitrary values
    'divide-opacity-[0.12]',
    'divide-opacity-[var(--my-value)]',
  ],
  theme: {
    opacity: {
      0: '0',
      50: '.5',
    },
  },
}).toMatchSnapshot()
