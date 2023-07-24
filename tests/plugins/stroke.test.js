import { quickPluginTest } from '../util/run'

quickPluginTest('stroke', {
  safelist: [
    // Arbitrary values
    'stroke-[#0088cc]',
    'stroke-[var(--my-value)]',
  ],
}).toMatchSnapshot()
