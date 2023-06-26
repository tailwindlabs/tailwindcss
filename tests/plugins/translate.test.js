import { quickPluginTest } from '../util/run'

quickPluginTest('translate', {
  safelist: [
    // Arbitrary values
    'translate-x-[12px]',
    'translate-x-[var(--my-value)]',
    'translate-y-[12px]',
    'translate-y-[var(--my-value)]',
  ],
}).toMatchSnapshot()
