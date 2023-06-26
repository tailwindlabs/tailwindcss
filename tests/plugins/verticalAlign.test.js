import { css, quickPluginTest } from '../util/run'

quickPluginTest('verticalAlign', {
  safelist: [
    // Arbitrary values
    'align-[12px]',
    'align-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .align-baseline {
    vertical-align: baseline;
  }
  .align-top {
    vertical-align: top;
  }
  .align-middle {
    vertical-align: middle;
  }
  .align-bottom {
    vertical-align: bottom;
  }
  .align-text-top {
    vertical-align: text-top;
  }
  .align-text-bottom {
    vertical-align: text-bottom;
  }
  .align-sub {
    vertical-align: sub;
  }
  .align-super {
    vertical-align: super;
  }
  .align-\[12px\] {
    vertical-align: 12px;
  }
  .align-\[var\(--my-value\)\] {
    vertical-align: var(--my-value);
  }
`)
