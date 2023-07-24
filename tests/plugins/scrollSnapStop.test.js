import { css, quickPluginTest } from '../util/run'

quickPluginTest('scrollSnapStop').toMatchFormattedCss(css`
  .snap-normal {
    scroll-snap-stop: normal;
  }
  .snap-always {
    scroll-snap-stop: always;
  }
`)
