import { quickPluginTest } from '../util/run'

quickPluginTest('ringOffsetColor', {
  safelist: [
    // Arbitrary values
    'ring-offset-[#0088cc]',
  ],
}).toMatchSnapshot()
