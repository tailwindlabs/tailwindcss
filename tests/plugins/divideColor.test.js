import { quickPluginTest } from '../util/run'

quickPluginTest('divideColor', {
  safelist: [
    // Arbitrary values
    'divide-[#0088cc]',
    'divide-[var(--my-value)]',
  ],
}).toMatchSnapshot()

// With the `divideOpacity` plugin enabled
quickPluginTest('divideColor', {
  safelist: [
    // Arbitrary values
    'divide-[#0088cc]',
    'divide-[var(--my-value)]',
  ],
  corePlugins: ['divideOpacity'],
}).toMatchSnapshot()
