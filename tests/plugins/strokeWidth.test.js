import { css, quickPluginTest } from '../util/run'

quickPluginTest('strokeWidth', {
  safelist: [
    // Arbitrary values
    'stroke-[12px]',
    'stroke-[34%]',
    'stroke-[56]',
  ],
}).toMatchFormattedCss(css`
  .stroke-0 {
    stroke-width: 0;
  }
  .stroke-1 {
    stroke-width: 1px;
  }
  .stroke-2 {
    stroke-width: 2px;
  }
  .stroke-\[12px\] {
    stroke-width: 12px;
  }
  .stroke-\[34\%\] {
    stroke-width: 34%;
  }
  .stroke-\[56\] {
    stroke-width: 56px;
  }
`)
