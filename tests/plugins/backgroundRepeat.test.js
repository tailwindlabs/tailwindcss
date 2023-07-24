import { css, quickPluginTest } from '../util/run'

quickPluginTest('backgroundRepeat').toMatchFormattedCss(css`
  .bg-repeat {
    background-repeat: repeat;
  }
  .bg-no-repeat {
    background-repeat: no-repeat;
  }
  .bg-repeat-x {
    background-repeat: repeat-x;
  }
  .bg-repeat-y {
    background-repeat: repeat-y;
  }
  .bg-repeat-round {
    background-repeat: round;
  }
  .bg-repeat-space {
    background-repeat: space;
  }
`)
