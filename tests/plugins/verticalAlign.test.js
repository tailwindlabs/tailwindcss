import { quickPluginTest } from '../util/run'

quickPluginTest('verticalAlign', {
  safelist: [
    // Arbitrary values
    'align-[12px]',
    'align-[var(--my-value)]',
  ],
}).toMatchSnapshot()
