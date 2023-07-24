import { quickPluginTest } from '../util/run'

quickPluginTest('maxHeight', {
  safelist: [
    // Arbitrary values
    'max-h-[12px]',
    'max-h-[var(--my-value)]',
  ],
}).toMatchSnapshot()
