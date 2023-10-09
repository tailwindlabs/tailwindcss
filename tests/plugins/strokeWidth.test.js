import { quickPluginTest } from '../util/run'

quickPluginTest('strokeWidth', {
  safelist: [
    // Arbitrary values
    'stroke-[12px]',
    'stroke-[34%]',
    'stroke-[56]',
  ],
}).toMatchSnapshot()
