import { css, quickPluginTest } from '../util/run'

quickPluginTest('backgroundOrigin').toMatchFormattedCss(css`
  .bg-origin-border {
    background-origin: border-box;
  }
  .bg-origin-padding {
    background-origin: padding-box;
  }
  .bg-origin-content {
    background-origin: content-box;
  }
`)
