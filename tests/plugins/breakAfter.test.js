import { css, quickPluginTest } from '../util/run'

quickPluginTest('breakAfter').toMatchFormattedCss(css`
  .break-after-auto {
    break-after: auto;
  }
  .break-after-avoid {
    break-after: avoid;
  }
  .break-after-all {
    break-after: all;
  }
  .break-after-avoid-page {
    break-after: avoid-page;
  }
  .break-after-page {
    break-after: page;
  }
  .break-after-left {
    break-after: left;
  }
  .break-after-right {
    break-after: right;
  }
  .break-after-column {
    break-after: column;
  }
`)
