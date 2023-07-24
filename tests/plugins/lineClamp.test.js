import { css, quickPluginTest } from '../util/run'

quickPluginTest('lineClamp', {
  safelist: [
    // Arbitrary values
    'line-clamp-[12px]',
    'line-clamp-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .line-clamp-1 {
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
  }
  .line-clamp-2 {
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
  }
  .line-clamp-3 {
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
  }
  .line-clamp-4 {
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
  }
  .line-clamp-5 {
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
  }
  .line-clamp-6 {
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
  }
  .line-clamp-\[12px\] {
    -webkit-line-clamp: 12px;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
  }

  .line-clamp-\[var\(--my-value\)\] {
    -webkit-line-clamp: var(--my-value);
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
  }
  .line-clamp-none {
    -webkit-line-clamp: none;
    -webkit-box-orient: horizontal;
    display: block;
    overflow: visible;
  }
`)
