import { quickPluginTest } from '../util/run'

quickPluginTest('borderRadius', {
  safelist: [
    // Arbitrary values
    'rounded-[1px]',

    'rounded-s-[2px]',
    'rounded-e-[3px]',
    'rounded-t-[4px]',
    'rounded-r-[5px]',
    'rounded-b-[6px]',
    'rounded-l-[7px]',

    'rounded-ss-[8px]',
    'rounded-se-[9px]',
    'rounded-ee-[10px]',
    'rounded-es-[11px]',
    'rounded-tl-[12px]',
    'rounded-tr-[13px]',
    'rounded-br-[14px]',
    'rounded-bl-[15px]',
  ],
}).toMatchSnapshot()
