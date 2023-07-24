import { css, quickPluginTest } from '../util/run'

quickPluginTest('resize').toMatchFormattedCss(css`
  .resize-none {
    resize: none;
  }
  .resize-y {
    resize: vertical;
  }
  .resize-x {
    resize: horizontal;
  }
  .resize {
    resize: both;
  }
`)
