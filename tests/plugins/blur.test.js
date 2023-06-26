import { quickPluginTest } from '../util/run'

quickPluginTest('blur', {
  safelist: [
    // Arbitrary values
    'blur-[12px]',
    'blur-[var(--my-value)]',
  ],
}).toMatchSnapshot()
