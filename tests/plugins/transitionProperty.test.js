import { quickPluginTest } from '../util/run'

quickPluginTest('transitionProperty', {
  safelist: [
    // Arbitrary values
    'transition-[accentColor]',
    'transition-[var(--my-value)]',
  ],
}).toMatchSnapshot()
