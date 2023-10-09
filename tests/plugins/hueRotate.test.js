import { quickPluginTest } from '../util/run'

quickPluginTest('hueRotate', {
  safelist: [
    // Arbitrary values
    'hue-rotate-[12deg]',
    'hue-rotate-[var(--my-value)]',
  ],
}).toMatchSnapshot()
