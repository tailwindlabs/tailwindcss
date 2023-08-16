import { css, quickPluginTest } from '../util/run'

quickPluginTest('textOpacity', {
  safelist: [
    // Arbitrary values
    'text-opacity-[12%]',
    'text-opacity-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .text-opacity-0 {
    --tw-text-opacity: 0;
  }
  .text-opacity-10 {
    --tw-text-opacity: 0.1;
  }
  .text-opacity-100 {
    --tw-text-opacity: 1;
  }
  .text-opacity-15 {
    --tw-text-opacity: 0.15;
  }
  .text-opacity-20 {
    --tw-text-opacity: 0.2;
  }
  .text-opacity-25 {
    --tw-text-opacity: 0.25;
  }
  .text-opacity-30 {
    --tw-text-opacity: 0.3;
  }
  .text-opacity-35 {
    --tw-text-opacity: 0.35;
  }
  .text-opacity-40 {
    --tw-text-opacity: 0.4;
  }
  .text-opacity-45 {
    --tw-text-opacity: 0.45;
  }
  .text-opacity-5 {
    --tw-text-opacity: 0.05;
  }
  .text-opacity-50 {
    --tw-text-opacity: 0.5;
  }
  .text-opacity-55 {
    --tw-text-opacity: 0.55;
  }
  .text-opacity-60 {
    --tw-text-opacity: 0.6;
  }
  .text-opacity-65 {
    --tw-text-opacity: 0.65;
  }
  .text-opacity-70 {
    --tw-text-opacity: 0.7;
  }
  .text-opacity-75 {
    --tw-text-opacity: 0.75;
  }
  .text-opacity-80 {
    --tw-text-opacity: 0.8;
  }
  .text-opacity-85 {
    --tw-text-opacity: 0.85;
  }
  .text-opacity-90 {
    --tw-text-opacity: 0.9;
  }
  .text-opacity-95 {
    --tw-text-opacity: 0.95;
  }
  .text-opacity-\[12\%\] {
    --tw-text-opacity: 12%;
  }
  .text-opacity-\[var\(--my-value\)\] {
    --tw-text-opacity: var(--my-value);
  }
`)
