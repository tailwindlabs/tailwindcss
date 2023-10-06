import { quickPluginTest } from '../util/run'

quickPluginTest('backdropSepia', {
  safelist: [
    // Arbitrary values
    'backdrop-sepia-[50%]',
    'backdrop-sepia-[var(--my-value)]',
  ],
}).toMatchSnapshot()
