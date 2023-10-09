import { quickPluginTest } from '../util/run'

quickPluginTest('boxShadow', {
  safelist: [
    // Arbitrary values
    'shadow-[0_1px_2px_#0088cc]',
  ],
}).toMatchSnapshot()
