import { css, quickPluginTest } from '../util/run'

quickPluginTest('justifyContent').toMatchFormattedCss(css`
  .justify-normal {
    justify-content: normal;
  }
  .justify-start {
    justify-content: flex-start;
  }
  .justify-end {
    justify-content: flex-end;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-between {
    justify-content: space-between;
  }
  .justify-around {
    justify-content: space-around;
  }
  .justify-evenly {
    justify-content: space-evenly;
  }
  .justify-stretch {
    justify-content: stretch;
  }
`)
