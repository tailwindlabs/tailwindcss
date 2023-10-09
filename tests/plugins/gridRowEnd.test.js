import { quickPluginTest } from '../util/run'

quickPluginTest('gridRowEnd', {
  safelist: [
    // Arbitrary values
    'row-end-[123]',
    'row-end-[var(--my-value)]',
  ],
}).toMatchSnapshot()
