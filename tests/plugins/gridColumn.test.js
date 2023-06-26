import { css, quickPluginTest } from '../util/run'

quickPluginTest('gridColumn', {
  safelist: [
    // Arbitrary values
    'col-[span_1_/_span_1]',
    'col-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .col-\[span_1_\/_span_1\] {
    grid-column: span 1 / span 1;
  }
  .col-\[var\(--my-value\)\] {
    grid-column: var(--my-value);
  }
  .col-auto {
    grid-column: auto;
  }
  .col-span-1 {
    grid-column: span 1 / span 1;
  }
  .col-span-10 {
    grid-column: span 10 / span 10;
  }
  .col-span-11 {
    grid-column: span 11 / span 11;
  }
  .col-span-12 {
    grid-column: span 12 / span 12;
  }
  .col-span-2 {
    grid-column: span 2 / span 2;
  }
  .col-span-3 {
    grid-column: span 3 / span 3;
  }
  .col-span-4 {
    grid-column: span 4 / span 4;
  }
  .col-span-5 {
    grid-column: span 5 / span 5;
  }
  .col-span-6 {
    grid-column: span 6 / span 6;
  }
  .col-span-7 {
    grid-column: span 7 / span 7;
  }
  .col-span-8 {
    grid-column: span 8 / span 8;
  }
  .col-span-9 {
    grid-column: span 9 / span 9;
  }
  .col-span-full {
    grid-column: 1 / -1;
  }
`)
