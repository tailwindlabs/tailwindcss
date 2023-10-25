import { quickPluginTest } from '../util/run'

quickPluginTest('size', {
  safelist: [
    // Arbitrary values
    'size-[12px]',
    'size-[var(--my-value)]',
  ],
}).toMatchSnapshot()
