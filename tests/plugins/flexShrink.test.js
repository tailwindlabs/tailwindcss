import { quickPluginTest } from '../util/run'

quickPluginTest('flexShrink', {
  safelist: [
    // Arbitrary values
    'shrink-[12]',
    'shrink-[var(--my-value)]',
  ],
}).toMatchSnapshot()
