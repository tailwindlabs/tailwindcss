import { css, quickPluginTest } from '../util/run'

quickPluginTest('clear').toMatchFormattedCss(css`
  .clear-left {
    clear: left;
  }
  .clear-right {
    clear: right;
  }
  .clear-both {
    clear: both;
  }
  .clear-none {
    clear: none;
  }
`)
