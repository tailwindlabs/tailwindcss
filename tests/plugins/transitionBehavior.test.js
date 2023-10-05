import { css, quickPluginTest } from '../util/run'

quickPluginTest('transitionBehavior').toMatchFormattedCss(css`
  .transition-allow-discrete {
    transition-behavior: allow-discrete;
  }
  .transition-behavior-normal {
    transition-behavior: normal;
  }
`)
