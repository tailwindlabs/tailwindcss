import { css, quickPluginTest } from '../util/run'

quickPluginTest('gridRowEnd', {
  safelist: [
    // Arbitrary values
    'row-end-[123]',
    'row-end-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .row-end-1 {
    grid-row-end: 1;
  }
  .row-end-2 {
    grid-row-end: 2;
  }
  .row-end-3 {
    grid-row-end: 3;
  }
  .row-end-4 {
    grid-row-end: 4;
  }
  .row-end-5 {
    grid-row-end: 5;
  }
  .row-end-6 {
    grid-row-end: 6;
  }
  .row-end-7 {
    grid-row-end: 7;
  }
  .row-end-\[123\] {
    grid-row-end: 123;
  }
  .row-end-\[var\(--my-value\)\] {
    grid-row-end: var(--my-value);
  }
  .row-end-auto {
    grid-row-end: auto;
  }
`)
