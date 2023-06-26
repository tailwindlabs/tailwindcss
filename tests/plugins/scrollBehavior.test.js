import { css, quickPluginTest } from '../util/run'

quickPluginTest('scrollBehavior').toMatchFormattedCss(css`
  .scroll-auto {
    scroll-behavior: auto;
  }
  .scroll-smooth {
    scroll-behavior: smooth;
  }
`)
