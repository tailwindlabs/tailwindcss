import { css, quickPluginTest } from '../util/run'

quickPluginTest('transitionTimingFunction', {
  safelist: [
    // Arbitrary values
    'ease-[cubiz-bezier(0.1,1,1,4)]',
    'ease-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .ease-\[cubiz-bezier\(0\.1\,1\,1\,4\)\] {
    transition-timing-function: cubiz-bezier(0.1, 1, 1, 4);
  }
  .ease-\[var\(--my-value\)\] {
    transition-timing-function: var(--my-value);
  }
  .ease-in {
    transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
  }
  .ease-in-out {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .ease-linear {
    transition-timing-function: linear;
  }
  .ease-out {
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`)
