import { quickPluginTest } from '../util/run'

quickPluginTest('backdropBlur', {
  safelist: [
    // Arbitrary values
    'backdrop-blur-[12px]',
    'backdrop-blur-[var(--my-value)]',
  ],
}).toMatchSnapshot()
