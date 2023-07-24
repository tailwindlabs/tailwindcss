import { css, quickPluginTest } from '../util/run'

quickPluginTest('fontStyle').toMatchFormattedCss(css`
  .italic {
    font-style: italic;
  }
  .not-italic {
    font-style: normal;
  }
`)
