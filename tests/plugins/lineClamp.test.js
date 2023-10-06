import { quickPluginTest } from '../util/run'

quickPluginTest('lineClamp', {
  safelist: [
    // Arbitrary values
    'line-clamp-[12px]',
    'line-clamp-[var(--my-value)]',
  ],
}).toMatchSnapshot()
