import { css, quickPluginTest } from '../util/run'

quickPluginTest('outlineStyle').toMatchFormattedCss(css`
  .outline-none {
    outline-offset: 2px;
    outline: 2px solid #0000;
  }
  .outline {
    outline-style: solid;
  }
  .outline-dashed {
    outline-style: dashed;
  }
  .outline-dotted {
    outline-style: dotted;
  }
  .outline-double {
    outline-style: double;
  }
`)
