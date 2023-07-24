import { css, quickPluginTest } from '../util/run'

quickPluginTest('gridAutoFlow').toMatchFormattedCss(css`
  .grid-flow-row {
    grid-auto-flow: row;
  }
  .grid-flow-col {
    grid-auto-flow: column;
  }
  .grid-flow-dense {
    grid-auto-flow: dense;
  }
  .grid-flow-row-dense {
    grid-auto-flow: row dense;
  }
  .grid-flow-col-dense {
    grid-auto-flow: column dense;
  }
`)
