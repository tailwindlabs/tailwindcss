import { quickPluginTest } from '../util/run'

quickPluginTest('outlineColor', {
  safelist: [
    // Arbitrary values
    'outline-[#0088cc]',
    'outline-[var(--my-value)]',
  ],
}).toMatchSnapshot()
