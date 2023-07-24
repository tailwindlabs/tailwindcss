import { css, quickPluginTest } from '../util/run'

quickPluginTest('textUnderlineOffset', {
  safelist: [
    // Arbitrary values
    'underline-offset-[12px]',
    'underline-offset-[20%]',
    'underline-offset-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .underline-offset-0 {
    text-underline-offset: 0px;
  }
  .underline-offset-1 {
    text-underline-offset: 1px;
  }
  .underline-offset-2 {
    text-underline-offset: 2px;
  }
  .underline-offset-4 {
    text-underline-offset: 4px;
  }
  .underline-offset-8 {
    text-underline-offset: 8px;
  }
  .underline-offset-\[12px\] {
    text-underline-offset: 12px;
  }
  .underline-offset-\[20\%\] {
    text-underline-offset: 20%;
  }
  .underline-offset-\[var\(--my-value\)\] {
    text-underline-offset: var(--my-value);
  }
  .underline-offset-auto {
    text-underline-offset: auto;
  }
`)
