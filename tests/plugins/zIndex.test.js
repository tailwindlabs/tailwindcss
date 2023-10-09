import { quickPluginTest } from '../util/run'

quickPluginTest('zIndex', {
  safelist: [
    // Arbitrary values
    'z-[12px]',
    'z-[var(--my-value)]',
  ],
}).toMatchSnapshot()
