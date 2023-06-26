import { css, quickPluginTest } from '../util/run'

quickPluginTest('gridRowStart', {
  safelist: [
    // Arbitrary values
    'row-start-[123]',
    'row-start-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .row-start-1 {
    grid-row-start: 1;
  }
  .row-start-2 {
    grid-row-start: 2;
  }
  .row-start-3 {
    grid-row-start: 3;
  }
  .row-start-4 {
    grid-row-start: 4;
  }
  .row-start-5 {
    grid-row-start: 5;
  }
  .row-start-6 {
    grid-row-start: 6;
  }
  .row-start-7 {
    grid-row-start: 7;
  }
  .row-start-\[123\] {
    grid-row-start: 123;
  }
  .row-start-\[var\(--my-value\)\] {
    grid-row-start: var(--my-value);
  }
  .row-start-auto {
    grid-row-start: auto;
  }
`)
