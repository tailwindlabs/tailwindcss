import { quickPluginTest } from '../util/run'

quickPluginTest('transformOrigin', {
  safelist: [
    // Arbitrary values
    'origin-[50%_50%]',
    'origin-[var(--my-value)]',
  ],
}).toMatchSnapshot()
