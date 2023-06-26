import { css, quickPluginTest } from '../util/run'

quickPluginTest('boxSizing').toMatchFormattedCss(css`
  .box-border {
    box-sizing: border-box;
  }
  .box-content {
    box-sizing: content-box;
  }
`)
