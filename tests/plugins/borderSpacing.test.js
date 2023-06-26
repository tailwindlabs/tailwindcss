import { quickPluginTest } from '../util/run'

quickPluginTest('borderSpacing', {
  safelist: [
    // Arbitrary values
    'border-spacing-[12px]',

    'border-spacing-x-[23px]',
    'border-spacing-y-[34px]',
  ],
}).toMatchSnapshot()
