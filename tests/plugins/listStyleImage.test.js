import { css, quickPluginTest } from '../util/run'

quickPluginTest('listStyleImage', {
  safelist: [
    // Arbitrary values
    'list-image-[url(https://example.com/image.png)]',
    'list-image-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .list-image-\[url\(https\:\/\/example\.com\/image\.png\)\] {
    list-style-image: url('https://example.com/image.png');
  }
  .list-image-\[var\(--my-value\)\] {
    list-style-image: var(--my-value);
  }
  .list-image-none {
    list-style-image: none;
  }
`)
