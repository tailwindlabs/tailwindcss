import { css, quickPluginTest } from '../util/run'

quickPluginTest('colorScheme').toMatchFormattedCss(css`
  .color-scheme-dark {
    color-scheme: dark;
  }
  .color-scheme-light {
    color-scheme: light;
  }
  .color-scheme-light-dark {
    color-scheme: light dark;
  }
  .color-scheme-dark-only {
    color-scheme: dark only;
  }
  .color-scheme-light-only {
    color-scheme: light only;
  }
`)
