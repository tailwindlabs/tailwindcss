import { css, quickPluginTest } from '../util/run'

quickPluginTest('pointerEvents').toMatchFormattedCss(css`
  .pointer-events-none {
    pointer-events: none;
  }
  .pointer-events-auto {
    pointer-events: auto;
  }
`)
