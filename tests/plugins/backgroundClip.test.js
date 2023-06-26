import { css, quickPluginTest } from '../util/run'

quickPluginTest('backgroundClip').toMatchFormattedCss(css`
  .bg-clip-border {
    background-clip: border-box;
  }
  .bg-clip-padding {
    background-clip: padding-box;
  }
  .bg-clip-content {
    background-clip: content-box;
  }
  .bg-clip-text {
    -webkit-background-clip: text;
    background-clip: text;
  }
`)
