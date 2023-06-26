import { quickPluginTest } from '../util/run'

quickPluginTest('minWidth', {
  safelist: [
    // Arbitrary values
    'min-w-[12px]',
    'min-w-[var(--my-value)]',
  ],
}).toMatchSnapshot()
