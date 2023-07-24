import { css, quickPluginTest } from '../util/run'

quickPluginTest('borderCollapse').toMatchFormattedCss(css`
  .border-collapse {
    border-collapse: collapse;
  }
  .border-separate {
    border-collapse: separate;
  }
`)
