import { quickPluginTest } from '../util/run'

quickPluginTest('outlineWidth', {
  safelist: [
    // Arbitrary values
    'outline-[12px]',
    'outline-[34%]',
    'outline-[56]',
  ],
}).toMatchSnapshot()
