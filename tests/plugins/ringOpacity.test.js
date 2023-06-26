import { quickPluginTest } from '../util/run'

quickPluginTest('ringOpacity', {
  safelist: [
    // Arbitrary values
    'ring-opacity-[0.12]',
    'ring-opacity-[var(--my-value)]',
  ],
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
}).toMatchSnapshot()
