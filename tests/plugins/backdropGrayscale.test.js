import { quickPluginTest } from '../util/run'

quickPluginTest('backdropGrayscale', {
  safelist: [
    // Arbitrary values
    'backdrop-grayscale-[50%]',
    'backdrop-grayscale-[var(--my-value)]',
  ],
}).toMatchSnapshot()
