import { quickPluginTest } from '../util/run'

quickPluginTest('gridColumnStart', {
  safelist: [
    // Arbitrary values
    'col-start-[123]',
    'col-start-[var(--my-value)]',
  ],
}).toMatchSnapshot()
