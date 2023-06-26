import { css, quickPluginTest } from '../util/run'

quickPluginTest('willChange', {
  safelist: [
    // Arbitrary values
    'will-change-[left,top]',
    'will-change-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .will-change-\[left\,top\] {
    will-change: left, top;
  }
  .will-change-\[var\(--my-value\)\] {
    will-change: var(--my-value);
  }
  .will-change-auto {
    will-change: auto;
  }
  .will-change-contents {
    will-change: contents;
  }
  .will-change-scroll {
    will-change: scroll-position;
  }
  .will-change-transform {
    will-change: transform;
  }
`)
