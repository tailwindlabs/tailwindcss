import { quickPluginTest } from '../util/run'

quickPluginTest('gridAutoRows', {
  safelist: [
    // Arbitrary values
    'auto-rows-[12px]',
    'auto-rows-[var(--my-value)]',
  ],
}).toMatchSnapshot()
