import { css, quickPluginTest } from '../util/run'

quickPluginTest('textDecorationStyle').toMatchFormattedCss(css`
  .decoration-solid {
    text-decoration-style: solid;
  }
  .decoration-double {
    text-decoration-style: double;
  }
  .decoration-dotted {
    text-decoration-style: dotted;
  }
  .decoration-dashed {
    text-decoration-style: dashed;
  }
  .decoration-wavy {
    text-decoration-style: wavy;
  }
`)
