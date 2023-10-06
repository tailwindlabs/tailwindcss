import { quickPluginTest } from '../util/run'

quickPluginTest('backdropContrast', {
  safelist: [
    // Arbitrary values
    'backdrop-contrast-[.12]',
    'backdrop-contrast-[var(--my-value)]',
  ],
}).toMatchSnapshot()
