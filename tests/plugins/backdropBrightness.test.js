import { quickPluginTest } from '../util/run'

quickPluginTest('backdropBrightness', {
  safelist: [
    // Arbitrary values
    'backdrop-brightness-[.12]',
    'backdrop-brightness-[var(--my-value)]',
  ],
}).toMatchSnapshot()
