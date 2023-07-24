import { css, quickPluginTest } from '../util/run'

quickPluginTest('order', {
  safelist: [
    // Arbitrary values
    'order-[13]',
    'order-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .-order-1 {
    order: -1;
  }
  .-order-10 {
    order: -10;
  }
  .-order-11 {
    order: -11;
  }
  .-order-12 {
    order: -12;
  }
  .-order-2 {
    order: -2;
  }
  .-order-3 {
    order: -3;
  }
  .-order-4 {
    order: -4;
  }
  .-order-5 {
    order: -5;
  }
  .-order-6 {
    order: -6;
  }
  .-order-7 {
    order: -7;
  }
  .-order-8 {
    order: -8;
  }
  .-order-9 {
    order: -9;
  }
  .-order-first {
    order: 9999;
  }
  .-order-last {
    order: -9999;
  }
  .-order-none {
    order: 0;
  }
  .order-1 {
    order: 1;
  }
  .order-10 {
    order: 10;
  }
  .order-11 {
    order: 11;
  }
  .order-12 {
    order: 12;
  }
  .order-2 {
    order: 2;
  }
  .order-3 {
    order: 3;
  }
  .order-4 {
    order: 4;
  }
  .order-5 {
    order: 5;
  }
  .order-6 {
    order: 6;
  }
  .order-7 {
    order: 7;
  }
  .order-8 {
    order: 8;
  }
  .order-9 {
    order: 9;
  }
  .order-\[13\] {
    order: 13;
  }
  .order-\[var\(--my-value\)\] {
    order: var(--my-value);
  }
  .order-first {
    order: -9999;
  }
  .order-last {
    order: 9999;
  }
  .order-none {
    order: 0;
  }
`)
