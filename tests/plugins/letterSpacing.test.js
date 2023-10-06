import { quickPluginTest } from '../util/run'

quickPluginTest('letterSpacing', {
  safelist: [
    // Arbitrary values
    'tracking-[12px]',
    'tracking-[var(--my-value)]',
  ],
}).toMatchSnapshot()
