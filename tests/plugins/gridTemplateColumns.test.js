import { quickPluginTest } from '../util/run'

quickPluginTest('gridTemplateColumns', {
  safelist: [
    // Arbitrary values
    'grid-cols-[12]',
    'grid-cols-[var(--my-value)]',
  ],
}).toMatchSnapshot()
