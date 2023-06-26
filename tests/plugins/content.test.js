import { css, quickPluginTest } from '../util/run'

quickPluginTest('content', {
  safelist: [
    // Arbitrary values
    'content-["hello_world"]',
    'content-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .content-\[\"hello_world\"\] {
    --tw-content: 'hello world';
    content: var(--tw-content);
  }
  .content-\[var\(--my-value\)\] {
    --tw-content: var(--my-value);
    content: var(--tw-content);
  }
  .content-none {
    --tw-content: none;
    content: var(--tw-content);
  }
`)
