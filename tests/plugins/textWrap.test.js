import { css, quickPluginTest } from '../util/run'

quickPluginTest('textWrap').toMatchFormattedCss(css`
  .text-wrap {
    text-wrap: wrap;
  }
  .text-nowrap {
    text-wrap: nowrap;
  }
  .text-balance {
    text-wrap: balance;
  }
  .text-pretty {
    text-wrap: pretty;
  }
`)
