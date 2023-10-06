import { quickPluginTest } from '../util/run'

quickPluginTest('borderOpacity', {
  safelist: [
    // Arbitrary values
    'border-opacity-[12%]',
    'border-opacity-[var(--my-value)]',
  ],
  theme: {
    opacity: {
      0: '0',
      50: '.5',
    },
  },
}).toMatchSnapshot()
