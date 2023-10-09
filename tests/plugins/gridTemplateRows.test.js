import { quickPluginTest } from '../util/run'

quickPluginTest('gridTemplateRows', {
  safelist: [
    // Arbitrary values
    'grid-rows-[12]',
    'grid-rows-[var(--my-value)]',
  ],
}).toMatchSnapshot()
