import { css, quickPluginTest } from '../util/run'

quickPluginTest('textAlign').toMatchFormattedCss(css`
  .text-left {
    text-align: left;
  }
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
  .text-justify {
    text-align: justify;
  }
  .text-start {
    text-align: start;
  }
  .text-end {
    text-align: end;
  }
`)
