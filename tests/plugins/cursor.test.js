import { quickPluginTest } from '../util/run'

quickPluginTest('cursor', {
  safelist: [
    // Arbitrary values
    'cursor-[url(/images/cursor.png)]',
    'cursor-[var(--my-value)]',
  ],
}).toMatchSnapshot()
