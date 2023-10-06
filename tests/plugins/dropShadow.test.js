import { quickPluginTest } from '../util/run'

quickPluginTest('dropShadow', {
  safelist: [
    // Arbitrary values
    'drop-shadow-[0_1px_2px_#0088cc]',
    'drop-shadow-[var(--my-value)]',
  ],
}).toMatchSnapshot()
