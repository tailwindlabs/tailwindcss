import { css, quickPluginTest } from '../util/run'

quickPluginTest('whitespace').toMatchFormattedCss(css`
  .whitespace-normal {
    white-space: normal;
  }
  .whitespace-nowrap {
    white-space: nowrap;
  }
  .whitespace-pre {
    white-space: pre;
  }
  .whitespace-pre-line {
    white-space: pre-line;
  }
  .whitespace-pre-wrap {
    white-space: pre-wrap;
  }
  .whitespace-break-spaces {
    white-space: break-spaces;
  }
`)
