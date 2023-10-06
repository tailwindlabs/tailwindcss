import { quickPluginTest } from '../util/run'

quickPluginTest('textDecorationThickness', {
  safelist: [
    // Arbitrary values
    'decoration-[12px]',
    'decoration-[34%]',
  ],
}).toMatchSnapshot()
