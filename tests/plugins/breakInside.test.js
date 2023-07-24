import { css, quickPluginTest } from '../util/run'

quickPluginTest('breakInside').toMatchFormattedCss(css`
  .break-inside-auto {
    break-inside: auto;
  }
  .break-inside-avoid {
    break-inside: avoid;
  }
  .break-inside-avoid-page {
    break-inside: avoid-page;
  }
  .break-inside-avoid-column {
    break-inside: avoid-column;
  }
`)
