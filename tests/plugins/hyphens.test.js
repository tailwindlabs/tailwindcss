import { css, quickPluginTest } from '../util/run'

quickPluginTest('hyphens').toMatchFormattedCss(css`
  .hyphens-none {
    -webkit-hyphens: none;
    hyphens: none;
  }
  .hyphens-manual {
    -webkit-hyphens: manual;
    hyphens: manual;
  }
  .hyphens-auto {
    -webkit-hyphens: auto;
    hyphens: auto;
  }
`)
