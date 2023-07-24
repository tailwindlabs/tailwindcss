import { css, quickPluginTest } from '../util/run'

quickPluginTest('lineHeight', {
  safelist: [
    // Arbitrary values
    'leading-[12px]',
    'leading-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .leading-10 {
    line-height: 2.5rem;
  }
  .leading-3 {
    line-height: 0.75rem;
  }
  .leading-4 {
    line-height: 1rem;
  }
  .leading-5 {
    line-height: 1.25rem;
  }
  .leading-6 {
    line-height: 1.5rem;
  }
  .leading-7 {
    line-height: 1.75rem;
  }
  .leading-8 {
    line-height: 2rem;
  }
  .leading-9 {
    line-height: 2.25rem;
  }
  .leading-\[12px\] {
    line-height: 12px;
  }
  .leading-\[var\(--my-value\)\] {
    line-height: var(--my-value);
  }
  .leading-loose {
    line-height: 2;
  }
  .leading-none {
    line-height: 1;
  }
  .leading-normal {
    line-height: 1.5;
  }
  .leading-relaxed {
    line-height: 1.625;
  }
  .leading-snug {
    line-height: 1.375;
  }
  .leading-tight {
    line-height: 1.25;
  }
`)
