import { quickPluginTest } from '../util/run'

quickPluginTest('gridAutoColumns', {
  safelist: [
    // Arbitrary values
    'auto-cols-[12px]',
    'auto-cols-[var(--my-value)]',
  ],
}).toMatchSnapshot()
