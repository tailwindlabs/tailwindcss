import { quickPluginTest } from '../util/run'

quickPluginTest('transitionDuration', {
  safelist: [
    // Arbitrary values
    'duration-[3s]',
    'duration-[var(--my-value)]',
  ],
}).toMatchSnapshot()
