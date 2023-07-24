import { quickPluginTest } from '../util/run'

quickPluginTest('saturate', {
  safelist: [
    // Arbitrary values
    'saturate-[0.12]',
    'saturate-[var(--my-value)]',
  ],
}).toMatchSnapshot()
