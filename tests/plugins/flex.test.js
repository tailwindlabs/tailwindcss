import { quickPluginTest } from '../util/run'

quickPluginTest('flex', {
  safelist: [
    // Arbitrary values
    'flex-[12_auto]',
    'flex-[var(--my-value)]',
  ],
}).toMatchSnapshot()
