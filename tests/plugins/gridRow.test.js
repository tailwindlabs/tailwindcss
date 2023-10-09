import { quickPluginTest } from '../util/run'

quickPluginTest('gridRow', {
  safelist: [
    // Arbitrary values
    'row-[span_1_/_span_1]',
    'row-[var(--my-value)]',
  ],
}).toMatchSnapshot()
