import { quickPluginTest } from '../util/run'

quickPluginTest('brightness', {
  safelist: [
    // Arbitrary values
    'brightness-[12]',
    'brightness-[var(--my-value)]',
  ],
}).toMatchSnapshot()
