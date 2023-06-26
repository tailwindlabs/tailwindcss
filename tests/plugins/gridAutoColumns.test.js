import { css, quickPluginTest } from '../util/run'

quickPluginTest('gridAutoColumns', {
  safelist: [
    // Arbitrary values
    'auto-cols-[12px]',
    'auto-cols-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .auto-cols-\[12px\] {
    grid-auto-columns: 12px;
  }
  .auto-cols-\[var\(--my-value\)\] {
    grid-auto-columns: var(--my-value);
  }
  .auto-cols-auto {
    grid-auto-columns: auto;
  }
  .auto-cols-fr {
    grid-auto-columns: minmax(0, 1fr);
  }
  .auto-cols-max {
    grid-auto-columns: max-content;
  }
  .auto-cols-min {
    grid-auto-columns: min-content;
  }
`)
