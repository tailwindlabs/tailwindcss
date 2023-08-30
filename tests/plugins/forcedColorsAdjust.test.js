import { css, quickPluginTest } from '../util/run'

quickPluginTest('forcedColorsAdjust').toMatchFormattedCss(css`
  .forced-colors-auto {
    forced-color-adjust: auto;
  }
  .forced-colors-none {
    forced-color-adjust: none;
  }
`)
