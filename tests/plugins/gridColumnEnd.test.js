import { quickPluginTest } from '../util/run'

quickPluginTest('gridColumnEnd', {
  safelist: [
    // Arbitrary avlues
    'col-end-[123]',
    'col-end-[var(--my-value)]',
  ],
}).toMatchSnapshot()
