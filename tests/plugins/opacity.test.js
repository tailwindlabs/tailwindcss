import { quickPluginTest } from '../util/run'

quickPluginTest('opacity', {
  safelist: [
    // Arbitrary values
    'opacity-[12%]',
    'opacity-[var(--my-value)]',
  ],
  theme: {
    opacity: {
      0: '0',
      50: '.5',
    },
  },
}).toMatchSnapshot()
