import { quickPluginTest } from '../util/run'

quickPluginTest('margin', {
  safelist: [
    // Arbitrary values
    'm-[12px]',
    'm-[var(--my-value)]',
  ],
}).toMatchSnapshot()
