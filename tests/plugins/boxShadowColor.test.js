import { quickPluginTest } from '../util/run'

quickPluginTest('boxShadowColor', {
  safelist: [
    // Arbitrary values
    'shadow-[#0088cc]',
    'shadow-[var(--my-value)]',
  ],
}).toMatchSnapshot()
