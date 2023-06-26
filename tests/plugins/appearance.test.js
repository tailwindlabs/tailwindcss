import { css, quickPluginTest } from '../util/run'

quickPluginTest('appearance').toMatchFormattedCss(css`
  .appearance-none {
    -webkit-appearance: none;
    appearance: none;
  }
`)
