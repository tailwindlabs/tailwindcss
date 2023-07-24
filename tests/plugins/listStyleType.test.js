import { css, quickPluginTest } from '../util/run'

quickPluginTest('listStyleType', {
  safelist: [
    // Arbitrary values
    'list-[cube]',
    'list-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .list-\[cube\] {
    list-style-type: cube;
  }
  .list-\[var\(--my-value\)\] {
    list-style-type: var(--my-value);
  }
  .list-decimal {
    list-style-type: decimal;
  }

  .list-disc {
    list-style-type: disc;
  }

  .list-none {
    list-style-type: none;
  }
`)
