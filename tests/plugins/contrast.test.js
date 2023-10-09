import { quickPluginTest } from '../util/run'

quickPluginTest('contrast', {
  safelist: [
    // Arbitrary values
    'contrast-[.12]',
    'contrast-[var(--my-value)]',
  ],
}).toMatchSnapshot()
