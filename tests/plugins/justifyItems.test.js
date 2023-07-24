import { css, quickPluginTest } from '../util/run'

quickPluginTest('justifyItems').toMatchFormattedCss(css`
  .justify-items-start {
    justify-items: start;
  }
  .justify-items-end {
    justify-items: end;
  }
  .justify-items-center {
    justify-items: center;
  }
  .justify-items-stretch {
    justify-items: stretch;
  }
`)
