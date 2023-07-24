import { quickPluginTest } from '../util/run'

quickPluginTest('caretColor', {
  safelist: [
    // Arbitrary values
    'caret-[#0088cc]',
    'caret-[var(--my-value)]',
  ],
}).toMatchSnapshot()
