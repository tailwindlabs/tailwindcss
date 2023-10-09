import { quickPluginTest } from '../util/run'

quickPluginTest('backgroundSize', {
  safelist: [
    // Arbitrary values
    'bg-[50%]',
  ],
}).toMatchSnapshot()
