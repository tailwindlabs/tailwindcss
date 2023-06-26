import { css, quickPluginTest } from '../util/run'

quickPluginTest('zIndex', {
  safelist: [
    // Arbitrary values
    'z-[12px]',
    'z-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .-z-0 {
    z-index: 0;
  }
  .-z-10 {
    z-index: -10;
  }
  .-z-20 {
    z-index: -20;
  }
  .-z-30 {
    z-index: -30;
  }
  .-z-40 {
    z-index: -40;
  }
  .-z-50 {
    z-index: -50;
  }
  .z-0 {
    z-index: 0;
  }
  .z-10 {
    z-index: 10;
  }
  .z-20 {
    z-index: 20;
  }
  .z-30 {
    z-index: 30;
  }
  .z-40 {
    z-index: 40;
  }
  .z-50 {
    z-index: 50;
  }
  .z-\[12px\] {
    z-index: 12px;
  }
  .z-\[var\(--my-value\)\] {
    z-index: var(--my-value);
  }
  .z-auto {
    z-index: auto;
  }
`)
