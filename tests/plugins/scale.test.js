import { quickPluginTest } from '../util/run'

quickPluginTest('scale', {
  safelist: [
    // Arbitrary values
    'scale-[12px]',
    'scale-[var(--my-value)]',

    'scale-x-[23px]',
    'scale-x-[var(--my-value)]',

    'scale-y-[34px]',
    'scale-y-[var(--my-value)]',
  ],
}).toMatchSnapshot()
