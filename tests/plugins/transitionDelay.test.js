import { css, quickPluginTest } from '../util/run'

quickPluginTest('transitionDelay', {
  safelist: [
    // Arbitrary values
    'delay-[3s]',
    'delay-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .delay-0 {
    transition-delay: 0s;
  }
  .delay-100 {
    transition-delay: 0.1s;
  }
  .delay-1000 {
    transition-delay: 1s;
  }
  .delay-150 {
    transition-delay: 0.15s;
  }
  .delay-200 {
    transition-delay: 0.2s;
  }
  .delay-300 {
    transition-delay: 0.3s;
  }
  .delay-500 {
    transition-delay: 0.5s;
  }
  .delay-700 {
    transition-delay: 0.7s;
  }
  .delay-75 {
    transition-delay: 75ms;
  }
  .delay-\[3s\] {
    transition-delay: 3s;
  }
  .delay-\[var\(--my-value\)\] {
    transition-delay: var(--my-value);
  }
`)
