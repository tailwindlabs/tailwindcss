import { css, quickPluginTest } from '../util/run'

quickPluginTest('userSelect').toMatchFormattedCss(css`
  .select-none {
    -webkit-user-select: none;
    user-select: none;
  }
  .select-text {
    -webkit-user-select: text;
    user-select: text;
  }
  .select-all {
    -webkit-user-select: all;
    user-select: all;
  }
  .select-auto {
    -webkit-user-select: auto;
    user-select: auto;
  }
`)
