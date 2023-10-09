import { quickPluginTest } from '../util/run'

quickPluginTest('transitionDelay', {
  safelist: [
    // Arbitrary values
    'delay-[3s]',
    'delay-[var(--my-value)]',
  ],
}).toMatchSnapshot()
