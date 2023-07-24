import { quickPluginTest } from '../util/run'

quickPluginTest('backgroundColor', {
  safelist: [
    // Arbitrary values
    'bg-[#0088cc]',
    'bg-[var(--my-value)]',
  ],
}).toMatchSnapshot()

// With `backgroundOpacity` plugin enabled
quickPluginTest('backgroundColor', {
  safelist: [
    // Arbitrary values
    'bg-[#0088cc]',
    'bg-[var(--my-value)]',
  ],
  corePlugins: ['backgroundOpacity'],
}).toMatchSnapshot()
