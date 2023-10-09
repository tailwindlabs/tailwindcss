import { quickPluginTest } from '../util/run'

quickPluginTest('listStyleType', {
  safelist: [
    // Arbitrary values
    'list-[cube]',
    'list-[var(--my-value)]',
  ],
}).toMatchSnapshot()
