import { quickPluginTest } from '../util/run'

quickPluginTest('fontStretch', {
  safelist: [
    // Arbitrary values
    'stretch-[100%]',
    'stretch-[var(--my-value)]',
  ],
}).toMatchSnapshot()
