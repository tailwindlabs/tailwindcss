import { quickPluginTest } from '../util/run'

quickPluginTest('backdropHueRotate', {
  safelist: [
    // Arbitrary values
    'backdrop-hue-rotate-[12deg]',
    'backdrop-hue-rotate-[var(--my-value)]',
  ],
}).toMatchSnapshot()
