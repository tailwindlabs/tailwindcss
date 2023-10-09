import { quickPluginTest } from '../util/run'

quickPluginTest('transitionTimingFunction', {
  safelist: [
    // Arbitrary values
    'ease-[cubiz-bezier(0.1,1,1,4)]',
    'ease-[var(--my-value)]',
  ],
}).toMatchSnapshot()
