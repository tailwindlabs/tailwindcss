import { css, quickPluginTest } from '../util/run'

quickPluginTest('flexShrink', {
  safelist: [
    // Arbitrary values
    'shrink-[12]',
    'shrink-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .flex-shrink {
    flex-shrink: 1;
  }
  .flex-shrink-0 {
    flex-shrink: 0;
  }
  .shrink {
    flex-shrink: 1;
  }
  .shrink-0 {
    flex-shrink: 0;
  }
  .shrink-\[12\] {
    flex-shrink: 12;
  }
  .shrink-\[var\(--my-value\)\] {
    flex-shrink: var(--my-value);
  }
`)
