import { quickPluginTest } from '../util/run'

quickPluginTest('minHeight', {
  safelist: [
    // Arbitrary values
    'min-h-[12px]',
    'min-h-[var(--my-value)]',
  ],
}).toMatchSnapshot()
