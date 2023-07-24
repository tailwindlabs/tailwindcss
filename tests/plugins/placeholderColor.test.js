import { quickPluginTest } from '../util/run'

quickPluginTest('placeholderColor', {
  safelist: [
    // Arbitrary values
    'placeholder-[#0088cc]',
    'placeholder-[var(--my-value)]',
  ],
}).toMatchSnapshot()

// With `placeholderOpacity` enabled
quickPluginTest('placeholderColor', {
  safelist: [
    // Arbitrary values
    'placeholder-[#0088cc]',
    'placeholder-[var(--my-value)]',
  ],
  corePlugins: ['placeholderOpacity'],
}).toMatchSnapshot()
