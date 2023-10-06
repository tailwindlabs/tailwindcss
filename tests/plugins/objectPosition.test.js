import { quickPluginTest } from '../util/run'

quickPluginTest('objectPosition', {
  safelist: [
    // Arbitrary values
    'object-[top,center]',
    'object-[var(--my-value)]',
  ],
}).toMatchSnapshot()
