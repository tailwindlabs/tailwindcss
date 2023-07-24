import { css, quickPluginTest } from '../util/run'

quickPluginTest('scrollSnapAlign').toMatchFormattedCss(css`
  .snap-start {
    scroll-snap-align: start;
  }
  .snap-end {
    scroll-snap-align: end;
  }
  .snap-center {
    scroll-snap-align: center;
  }
  .snap-align-none {
    scroll-snap-align: none;
  }
`)
