import { quickPluginTest } from '../util/run'

quickPluginTest('lineHeight', {
  safelist: [
    // Arbitrary values
    'leading-[12px]',
    'leading-[var(--my-value)]',
  ],
}).toMatchSnapshot()
