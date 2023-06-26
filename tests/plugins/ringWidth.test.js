import { quickPluginTest } from '../util/run'

quickPluginTest('ringWidth', {
  safelist: [
    // Arbitrary values
    'ring-[12px]',
    'ring-[var(--my-value)]',
  ],
}).toMatchSnapshot()

// With `respectDefaultRingColorOpacity` enabled
quickPluginTest('ringWidth', {
  safelist: [
    // Arbitrary values
    'ring-[12px]',
    'ring-[var(--my-value)]',
  ],
  future: {
    respectDefaultRingColorOpacity: true,
  },
}).toMatchSnapshot()

// With `respectDefaultRingColorOpacity` enabled and a DEFAULT ring opacity
quickPluginTest('ringWidth', {
  safelist: [
    // Arbitrary values
    'ring-[12px]',
    'ring-[var(--my-value)]',
  ],
  theme: {
    extend: {
      ringOpacity: {
        DEFAULT: '0.12',
      },
    },
  },
  future: {
    respectDefaultRingColorOpacity: true,
  },
  corePlugins: ['ringOpacity'],
}).toMatchSnapshot()
