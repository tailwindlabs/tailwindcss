import { quickPluginTest } from '../util/run'

quickPluginTest('willChange', {
  safelist: [
    // Arbitrary values
    'will-change-[left,top]',
    'will-change-[var(--my-value)]',
  ],
}).toMatchSnapshot()
