import { quickPluginTest } from '../util/run'

quickPluginTest('textColor', {
  safelist: [
    // Arbitrary values
    'text-[#0088cc]',
    'text-[var(--my-value)]',
  ],
}).toMatchSnapshot()

// With `textOpacity` plugin enabled
quickPluginTest('textColor', {
  safelist: [
    // Arbitrary values
    'text-[#0088cc]',
    'text-[var(--my-value)]',
  ],
  corePlugins: ['textOpacity'],
}).toMatchSnapshot()
