import { css, quickPluginTest } from '../util/run'

quickPluginTest('isolation').toMatchFormattedCss(css`
  .isolate {
    isolation: isolate;
  }
  .isolation-auto {
    isolation: auto;
  }
`)
