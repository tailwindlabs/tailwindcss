import { quickPluginTest } from '../util/run'

quickPluginTest('borderOpacity', {
  safelist: [
    // Arbitrary values
    'border-opacity-[12%]',
    'border-opacity-[var(--my-value)]',
  ],
}).toMatchSnapshot()
