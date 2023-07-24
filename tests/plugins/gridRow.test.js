import { css, quickPluginTest } from '../util/run'

quickPluginTest('gridRow', {
  safelist: [
    // Arbitrary values
    'row-[span_1_/_span_1]',
    'row-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .row-\[span_1_\/_span_1\] {
    grid-row: span 1 / span 1;
  }
  .row-\[var\(--my-value\)\] {
    grid-row: var(--my-value);
  }
  .row-auto {
    grid-row: auto;
  }
  .row-span-1 {
    grid-row: span 1 / span 1;
  }
  .row-span-2 {
    grid-row: span 2 / span 2;
  }
  .row-span-3 {
    grid-row: span 3 / span 3;
  }
  .row-span-4 {
    grid-row: span 4 / span 4;
  }
  .row-span-5 {
    grid-row: span 5 / span 5;
  }
  .row-span-6 {
    grid-row: span 6 / span 6;
  }
  .row-span-full {
    grid-row: 1 / -1;
  }
`)
