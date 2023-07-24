import { css, quickPluginTest } from '../util/run'

quickPluginTest('gridTemplateRows', {
  safelist: [
    // Arbitrary values
    'grid-rows-[12]',
    'grid-rows-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .grid-rows-1 {
    grid-template-rows: repeat(1, minmax(0, 1fr));
  }
  .grid-rows-2 {
    grid-template-rows: repeat(2, minmax(0, 1fr));
  }
  .grid-rows-3 {
    grid-template-rows: repeat(3, minmax(0, 1fr));
  }
  .grid-rows-4 {
    grid-template-rows: repeat(4, minmax(0, 1fr));
  }
  .grid-rows-5 {
    grid-template-rows: repeat(5, minmax(0, 1fr));
  }
  .grid-rows-6 {
    grid-template-rows: repeat(6, minmax(0, 1fr));
  }
  .grid-rows-\[12\] {
    grid-template-rows: 12px;
  }
  .grid-rows-\[var\(--my-value\)\] {
    grid-template-rows: var(--my-value);
  }
  .grid-rows-none {
    grid-template-rows: none;
  }
`)
