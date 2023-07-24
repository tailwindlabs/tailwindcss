import { css, quickPluginTest } from '../util/run'

quickPluginTest('placeItems').toMatchFormattedCss(css`
  .place-items-start {
    place-items: start;
  }
  .place-items-end {
    place-items: end;
  }
  .place-items-center {
    place-items: center;
  }
  .place-items-baseline {
    place-items: baseline;
  }
  .place-items-stretch {
    place-items: stretch stretch;
  }
`)
