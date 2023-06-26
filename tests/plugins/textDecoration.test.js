import { css, quickPluginTest } from '../util/run'

quickPluginTest('textDecoration').toMatchFormattedCss(css`
  .underline {
    text-decoration-line: underline;
  }
  .overline {
    text-decoration-line: overline;
  }
  .line-through {
    text-decoration-line: line-through;
  }
  .no-underline {
    text-decoration-line: none;
  }
`)
