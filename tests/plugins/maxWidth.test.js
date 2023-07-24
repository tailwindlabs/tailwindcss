import { quickPluginTest } from '../util/run'

quickPluginTest('maxWidth', {
  safelist: [
    // Arbitrary values
    'max-w-[12px]',
    'max-w-[var(--my-value)]',
  ],
}).toMatchSnapshot()
