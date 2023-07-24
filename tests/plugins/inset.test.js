import { quickPluginTest } from '../util/run'

quickPluginTest('inset', {
  safelist: [
    // Arbitrary values
    'inset-[12px]',
    'inset-[var(--my-value)]',
  ],
}).toMatchSnapshot()
