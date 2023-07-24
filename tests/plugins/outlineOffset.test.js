import { quickPluginTest } from '../util/run'

quickPluginTest('outlineOffset', {
  safelist: [
    // Arbitrary values
    'outline-offset-[12px]',
    'outline-offset-[34%]',
    'outline-offset-[56]',
    'outline-offset-[var(--my-value)]',
  ],
}).toMatchSnapshot()
