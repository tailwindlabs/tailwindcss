import { quickPluginTest } from '../util/run'

quickPluginTest('gridRowStart', {
  safelist: [
    // Arbitrary values
    'row-start-[123]',
    'row-start-[var(--my-value)]',
  ],
}).toMatchSnapshot()
