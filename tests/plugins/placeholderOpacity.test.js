import { quickPluginTest } from '../util/run'

quickPluginTest('placeholderOpacity', {
  safelist: [
    // Arbitrary values
    'placeholder-opacity-[0.12]',
    'placeholder-opacity-[var(--my-value)]',
  ],
}).toMatchSnapshot()
