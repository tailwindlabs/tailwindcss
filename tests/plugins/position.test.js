import { css, quickPluginTest } from '../util/run'

quickPluginTest('position').toMatchFormattedCss(css`
  .static {
    position: static;
  }
  .fixed {
    position: fixed;
  }
  .absolute {
    position: absolute;
  }
  .relative {
    position: relative;
  }
  .sticky {
    position: sticky;
  }
`)
