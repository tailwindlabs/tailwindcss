import { quickPluginTest } from '../util/run'

quickPluginTest('gap', {
  safelist: [
    // Arbitrary values
    'gap-[12px]',
    'gap-[var(--my-value)]',

    'gap-x-[34px]',
    'gap-x-[var(--my-value)]',
    'gap-y-[56px]',
    'gap-y-[var(--my-value)]',
  ],
}).toMatchSnapshot()
