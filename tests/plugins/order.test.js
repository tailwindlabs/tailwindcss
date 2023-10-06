import { quickPluginTest } from '../util/run'

quickPluginTest('order', {
  safelist: [
    // Arbitrary values
    'order-[13]',
    'order-[var(--my-value)]',
  ],
}).toMatchSnapshot()
