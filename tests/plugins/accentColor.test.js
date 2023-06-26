import { quickPluginTest } from '../util/run'

quickPluginTest('accentColor', {
  safelist: [
    // Arbitrary values
    'accent-[#0088cc]',
    'accent-[var(--my-value)]',
  ],
}).toMatchSnapshot()
