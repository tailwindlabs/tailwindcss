import { quickPluginTest } from '../util/run'

quickPluginTest('width', {
  safelist: [
    // Arbitrary values
    'w-[12px]',
    'w-[var(--my-value)]',
  ],
}).toMatchSnapshot()
