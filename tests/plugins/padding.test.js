import { quickPluginTest } from '../util/run'

quickPluginTest('padding', {
  safelist: [
    // Arbitrary values
    'p-[12px]',
    'p-[var(--my-value)]',
  ],
}).toMatchSnapshot()
