import { quickPluginTest } from '../util/run'

quickPluginTest('size', {
  safelist: [
    // Arbitrary values
    's-[12px]',
    's-[var(--my-value)]',
  ],
}).toMatchSnapshot()
