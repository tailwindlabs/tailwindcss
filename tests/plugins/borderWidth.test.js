import { quickPluginTest } from '../util/run'

quickPluginTest('borderWidth', {
  safelist: [
    // Arbitrary values
    'border-[12px]',

    'border-x-[23px]',
    'border-y-[34px]',

    'border-s-[45px]',
    'border-e-[56px]',
    'border-t-[67px]',
    'border-r-[78px]',
    'border-b-[89px]',
    'border-l-[90px]',
  ],
}).toMatchSnapshot()
