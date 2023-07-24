import { quickPluginTest } from '../util/run'

quickPluginTest('flexBasis', {
  safelist: [
    // Arbitrary values
    'basis-[12px]',
    'basis-[var(--my-value)]',
  ],
}).toMatchSnapshot()
