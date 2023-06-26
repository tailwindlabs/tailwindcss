import { css, quickPluginTest } from '../util/run'

quickPluginTest('float').toMatchFormattedCss(css`
  .float-right {
    float: right;
  }
  .float-left {
    float: left;
  }
  .float-none {
    float: none;
  }
`)
