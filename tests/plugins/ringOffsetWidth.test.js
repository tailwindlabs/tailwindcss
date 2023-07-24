import { quickPluginTest } from '../util/run'

quickPluginTest('ringOffsetWidth', {
  safelist: [
    // Arbitrary values
    'ring-offset-[12px]',
  ],
}).toMatchSnapshot()
