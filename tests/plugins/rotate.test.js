import { quickPluginTest } from '../util/run'

quickPluginTest('rotate', {
  safelist: [
    // Arbitrary values
    'rotate-[12deg]',
    'rotate-[var(--my-value)]',
  ],
}).toMatchSnapshot()
