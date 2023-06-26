import { css, quickPluginTest } from '../util/run'

quickPluginTest('alignContent').toMatchFormattedCss(css`
  .content-normal {
    align-content: normal;
  }
  .content-center {
    align-content: center;
  }
  .content-start {
    align-content: flex-start;
  }
  .content-end {
    align-content: flex-end;
  }
  .content-between {
    align-content: space-between;
  }
  .content-around {
    align-content: space-around;
  }
  .content-evenly {
    align-content: space-evenly;
  }
  .content-baseline {
    align-content: baseline;
  }
  .content-stretch {
    align-content: stretch;
  }
`)
