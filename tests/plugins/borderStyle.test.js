import { css, quickPluginTest } from '../util/run'

quickPluginTest('borderStyle').toMatchFormattedCss(css`
  .border-solid {
    border-style: solid;
  }
  .border-dashed {
    border-style: dashed;
  }
  .border-dotted {
    border-style: dotted;
  }
  .border-double {
    border-style: double;
  }
  .border-hidden {
    border-style: hidden;
  }
  .border-none {
    border-style: none;
  }
`)
