import { css, quickPluginTest } from '../util/run'

quickPluginTest('textTransform').toMatchFormattedCss(css`
  .uppercase {
    text-transform: uppercase;
  }
  .lowercase {
    text-transform: lowercase;
  }
  .capitalize {
    text-transform: capitalize;
  }
  .normal-case {
    text-transform: none;
  }
`)
