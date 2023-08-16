import { css, quickPluginTest } from '../util/run'

quickPluginTest('divideOpacity', {
  safelist: [
    // Arbitrary values
    'divide-opacity-[0.12]',
    'divide-opacity-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .divide-opacity-0 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0;
  }
  .divide-opacity-10 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.1;
  }
  .divide-opacity-100 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 1;
  }
  .divide-opacity-15 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.15;
  }
  .divide-opacity-20 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.2;
  }
  .divide-opacity-25 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.25;
  }
  .divide-opacity-30 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.3;
  }
  .divide-opacity-35 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.35;
  }
  .divide-opacity-40 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.4;
  }
  .divide-opacity-45 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.45;
  }
  .divide-opacity-5 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.05;
  }
  .divide-opacity-50 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.5;
  }
  .divide-opacity-55 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.55;
  }
  .divide-opacity-60 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.6;
  }
  .divide-opacity-65 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.65;
  }
  .divide-opacity-70 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.7;
  }
  .divide-opacity-75 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.75;
  }
  .divide-opacity-80 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.8;
  }
  .divide-opacity-85 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.85;
  }
  .divide-opacity-90 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.9;
  }
  .divide-opacity-95 > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.95;
  }
  .divide-opacity-\[0\.12\] > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: 0.12;
  }
  .divide-opacity-\[var\(--my-value\)\] > :not([hidden]) ~ :not([hidden]) {
    --tw-divide-opacity: var(--my-value);
  }
`)
