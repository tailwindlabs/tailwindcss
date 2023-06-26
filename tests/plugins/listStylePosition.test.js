import { css, quickPluginTest } from '../util/run'

quickPluginTest('listStylePosition').toMatchFormattedCss(css`
  .list-inside {
    list-style-position: inside;
  }
  .list-outside {
    list-style-position: outside;
  }
`)
