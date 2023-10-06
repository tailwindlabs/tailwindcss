import { quickPluginTest } from '../util/run'

quickPluginTest('invert', {
  safelist: [
    // Arbitrary values
    'invert-[50%]',
    'invert-[var(--my-value)]',
  ],
}).toMatchSnapshot()
