import { quickPluginTest } from '../util/run'

quickPluginTest('textUnderlineOffset', {
  safelist: [
    // Arbitrary values
    'underline-offset-[12px]',
    'underline-offset-[20%]',
    'underline-offset-[var(--my-value)]',
  ],
}).toMatchSnapshot()
