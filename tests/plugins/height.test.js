import { quickPluginTest } from '../util/run'

quickPluginTest('height', {
  safelist: [
    // Arbitrary values
    'h-[12px]',
    'h-[var(--my-value)]',
  ],
}).toMatchSnapshot()
