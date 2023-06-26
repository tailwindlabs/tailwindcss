import { quickPluginTest } from '../util/run'

quickPluginTest('backdropSaturate', {
  safelist: [
    // Arbitrary values
    'backdrop-saturate-[0.12]',
    'backdrop-saturate-[var(--my-value)]',
  ],
}).toMatchSnapshot()
