import { quickPluginTest } from '../util/run'

quickPluginTest('ringOpacity', {
  safelist: [
    // Arbitrary values
    'ring-opacity-[0.12]',
    'ring-opacity-[var(--my-value)]',
  ],
  theme: {
    opacity: {
      0: '0',
      50: '.5',
    },
  },
}).toMatchSnapshot()

// With `respectDefaultRingColorOpacity` enabled
quickPluginTest('ringOpacity', {
  safelist: [
    // Arbitrary values
    'ring-opacity-[0.12]',
    'ring-opacity-[var(--my-value)]',
  ],
  future: {
    respectDefaultRingColorOpacity: true,
  },
  theme: {
    opacity: {
      0: '0',
      50: '.5',
    },
  },
}).toMatchSnapshot()
