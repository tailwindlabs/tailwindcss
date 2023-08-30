import { css, quickPluginTest } from '../util/run'

quickPluginTest('forcedColorsAdjust').toMatchFormattedCss(css`
  .forced-colors-auto {
    forced-colors-adjust: auto;
  }
  .forced-colors-none {
    forced-colors-adjust: none;
  }
`)
