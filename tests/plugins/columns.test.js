import { quickPluginTest } from '../util/run'

quickPluginTest('columns', {
  safelist: [
    // Arbitrary values
    'columns-[12]',
    'columns-[var(--my-value)]',
  ],
}).toMatchSnapshot()
