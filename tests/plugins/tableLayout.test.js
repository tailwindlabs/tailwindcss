import { css, quickPluginTest } from '../util/run'

quickPluginTest('tableLayout').toMatchFormattedCss(css`
  .table-auto {
    table-layout: auto;
  }
  .table-fixed {
    table-layout: fixed;
  }
`)
