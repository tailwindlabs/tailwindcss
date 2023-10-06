import { quickPluginTest } from '../util/run'

quickPluginTest('flexGrow', {
  safelist: [
    // Arbitrary values
    'grow-[12]',
    'grow-[var(--my-value)]',
  ],
}).toMatchSnapshot()
