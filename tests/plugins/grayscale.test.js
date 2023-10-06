import { quickPluginTest } from '../util/run'

quickPluginTest('grayscale', {
  safelist: [
    // Arbitrary values
    'grayscale-[50%]',
    'grayscale-[var(--my-value)]',
  ],
}).toMatchSnapshot()
