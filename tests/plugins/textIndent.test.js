import { quickPluginTest } from '../util/run'

quickPluginTest('textIndent', {
  safelist: [
    // Arbitrary values
    'indent-[12px]',
    'indent-[var(--my-value)]',
  ],
}).toMatchSnapshot()
