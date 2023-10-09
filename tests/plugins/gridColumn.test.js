import { quickPluginTest } from '../util/run'

quickPluginTest('gridColumn', {
  safelist: [
    // Arbitrary values
    'col-[span_1_/_span_1]',
    'col-[var(--my-value)]',
  ],
}).toMatchSnapshot()
