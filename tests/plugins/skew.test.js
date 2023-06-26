import { quickPluginTest } from '../util/run'

quickPluginTest('skew', {
  safelist: [
    // Arbitrary values
    'skew-x-[12px]',
    'skew-x-[var(--my-value)]',
    'skew-y-[34px]',
    'skew-y-[var(--my-value)]',
  ],
}).toMatchSnapshot()
