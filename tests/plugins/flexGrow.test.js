import { css, quickPluginTest } from '../util/run'

quickPluginTest('flexGrow', {
  safelist: [
    // Arbitrary values
    'grow-[12]',
    'grow-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .flex-grow {
    flex-grow: 1;
  }
  .flex-grow-0 {
    flex-grow: 0;
  }
  .grow {
    flex-grow: 1;
  }
  .grow-0 {
    flex-grow: 0;
  }
  .grow-\[12\] {
    flex-grow: 12;
  }
  .grow-\[var\(--my-value\)\] {
    flex-grow: var(--my-value);
  }
`)
