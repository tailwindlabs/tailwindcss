import { css, quickPluginTest } from '../util/run'

quickPluginTest('transitionDuration', {
  safelist: [
    // Arbitrary values
    'duration-[3s]',
    'duration-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .duration-0 {
    transition-duration: 0s;
  }
  .duration-100 {
    transition-duration: 0.1s;
  }
  .duration-1000 {
    transition-duration: 1s;
  }
  .duration-150 {
    transition-duration: 0.15s;
  }
  .duration-200 {
    transition-duration: 0.2s;
  }
  .duration-300 {
    transition-duration: 0.3s;
  }
  .duration-500 {
    transition-duration: 0.5s;
  }
  .duration-700 {
    transition-duration: 0.7s;
  }
  .duration-75 {
    transition-duration: 75ms;
  }
  .duration-\[3s\] {
    transition-duration: 3s;
  }
  .duration-\[var\(--my-value\)\] {
    transition-duration: var(--my-value);
  }
`)
