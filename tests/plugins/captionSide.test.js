import { css, quickPluginTest } from '../util/run'

quickPluginTest('captionSide').toMatchFormattedCss(css`
  .caption-top {
    caption-side: top;
  }
  .caption-bottom {
    caption-side: bottom;
  }
`)
