import { quickPluginTest } from '../util/run'

quickPluginTest('fill', {
  safelist: [
    // Arbitrary values
    'fill-[#0088cc]',
    'fill-[var(--my-value)]',
  ],
}).toMatchSnapshot()
