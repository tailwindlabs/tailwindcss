import { css, quickPluginTest } from '../util/run'

quickPluginTest('visibility').toMatchFormattedCss(css`
  .visible {
    visibility: visible;
  }
  .invisible {
    visibility: hidden;
  }
  .collapse {
    visibility: collapse;
  }
`)
