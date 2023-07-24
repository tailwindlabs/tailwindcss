import { quickPluginTest } from '../util/run'

quickPluginTest('backdropInvert', {
  safelist: [
    // Arbitrary values
    'backdrop-invert-[50%]',
    'backdrop-invert-[var(--my-value)]',
  ],
}).toMatchSnapshot()
