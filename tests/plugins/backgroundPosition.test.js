import { quickPluginTest } from '../util/run'

quickPluginTest('backgroundPosition', {
  safelist: [
    // Arbitrary values
    'bg-[50%_25%]',
  ],
}).toMatchSnapshot()
