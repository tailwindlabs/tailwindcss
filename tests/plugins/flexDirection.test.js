import { css, quickPluginTest } from '../util/run'

quickPluginTest('flexDirection').toMatchFormattedCss(css`
  .flex-row {
    flex-direction: row;
  }
  .flex-row-reverse {
    flex-direction: row-reverse;
  }
  .flex-col {
    flex-direction: column;
  }
  .flex-col-reverse {
    flex-direction: column-reverse;
  }
`)
