import { quickPluginTest } from '../util/run'

quickPluginTest('ringColor', {
  safelist: [
    // Arbitrary values
    'ring-[#0088cc]',
    'ring-[var(--my-value)]',
  ],
}).toMatchSnapshot()

// With `ringOpacity` plugin enabled
quickPluginTest('ringColor', {
  safelist: [
    // Arbitrary values
    'ring-[#0088cc]',
    'ring-[var(--my-value)]',
  ],
  corePlugins: ['ringOpacity'],
}).toMatchSnapshot()
