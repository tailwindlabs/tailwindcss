import { css, quickPluginTest } from '../util/run'

quickPluginTest('transformOrigin', {
  safelist: [
    // Arbitrary values
    'origin-[50%_50%]',
    'origin-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .origin-\[50\%_50\%\] {
    transform-origin: 50%;
  }
  .origin-\[var\(--my-value\)\] {
    transform-origin: var(--my-value);
  }
  .origin-bottom {
    transform-origin: bottom;
  }
  .origin-bottom-left {
    transform-origin: 0 100%;
  }
  .origin-bottom-right {
    transform-origin: 100% 100%;
  }
  .origin-center {
    transform-origin: center;
  }
  .origin-left {
    transform-origin: 0;
  }
  .origin-right {
    transform-origin: 100%;
  }
  .origin-top {
    transform-origin: top;
  }
  .origin-top-left {
    transform-origin: 0 0;
  }
  .origin-top-right {
    transform-origin: 100% 0;
  }
`)
