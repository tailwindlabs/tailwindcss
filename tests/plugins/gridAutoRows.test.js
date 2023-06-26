import { css, quickPluginTest } from '../util/run'

quickPluginTest('gridAutoRows', {
  safelist: [
    // Arbitrary values
    'auto-rows-[12px]',
    'auto-rows-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .auto-rows-\[12px\] {
    grid-auto-rows: 12px;
  }
  .auto-rows-\[var\(--my-value\)\] {
    grid-auto-rows: var(--my-value);
  }
  .auto-rows-auto {
    grid-auto-rows: auto;
  }
  .auto-rows-fr {
    grid-auto-rows: minmax(0, 1fr);
  }
  .auto-rows-max {
    grid-auto-rows: max-content;
  }
  .auto-rows-min {
    grid-auto-rows: min-content;
  }
`)
