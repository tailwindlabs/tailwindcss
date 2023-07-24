import { css, quickPluginTest } from '../util/run'

quickPluginTest('flex', {
  safelist: [
    // Arbitrary values
    'flex-[12_auto]',
    'flex-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .flex-1 {
    flex: 1;
  }
  .flex-\[12_auto\] {
    flex: 12 auto;
  }
  .flex-\[var\(--my-value\)\] {
    flex: var(--my-value);
  }
  .flex-auto {
    flex: auto;
  }
  .flex-initial {
    flex: 0 auto;
  }
  .flex-none {
    flex: none;
  }
`)
