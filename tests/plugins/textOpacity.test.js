import { quickPluginTest } from '../util/run'

quickPluginTest('textOpacity', {
  safelist: [
    // Arbitrary values
    'text-opacity-[12%]',
    'text-opacity-[var(--my-value)]',
  ],
  theme: {
    opacity: {
      0: '0',
      50: '.5',
    },
  },
}).toMatchSnapshot()
