import { css, quickPluginTest } from '../util/run'

quickPluginTest('fontSmoothing').toMatchFormattedCss(css`
  .antialiased {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .subpixel-antialiased {
    -webkit-font-smoothing: auto;
    -moz-osx-font-smoothing: auto;
  }
`)
