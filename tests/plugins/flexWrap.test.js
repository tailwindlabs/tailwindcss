import { css, quickPluginTest } from '../util/run'

quickPluginTest('flexWrap').toMatchFormattedCss(css`
  .flex-wrap {
    flex-wrap: wrap;
  }
  .flex-wrap-reverse {
    flex-wrap: wrap-reverse;
  }
  .flex-nowrap {
    flex-wrap: nowrap;
  }
`)
