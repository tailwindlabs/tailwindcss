import { quickPluginTest } from '../util/run'

quickPluginTest('sepia', {
  safelist: [
    // Arbitrary values
    'sepia-[50%]',
    'sepia-[var(--my-value)]',
  ],
}).toMatchSnapshot()
