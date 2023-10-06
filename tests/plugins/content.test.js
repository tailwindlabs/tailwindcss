import { quickPluginTest } from '../util/run'

quickPluginTest('content', {
  safelist: [
    // Arbitrary values
    'content-["hello_world"]',
    'content-[var(--my-value)]',
  ],
}).toMatchSnapshot()
