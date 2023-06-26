import { quickPluginTest } from '../util/run'

quickPluginTest('borderColor', {
  safelist: [
    // Arbitrary values
    'border-[#0088cc]',
    'border-[var(--my-value)]',
  ],
}).toMatchSnapshot()

// With `ringOpacity` plugin enabled
quickPluginTest('borderColor', {
  safelist: [
    // Arbitrary values
    'border-[#0088cc]',
    'border-[var(--my-value)]',
  ],
  corePlugins: ['borderOpacity'],
}).toMatchSnapshot()
