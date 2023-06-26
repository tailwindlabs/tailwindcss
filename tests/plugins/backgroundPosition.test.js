import { css, quickPluginTest } from '../util/run'

quickPluginTest('backgroundPosition', {
  safelist: [
    // Arbitrary values
    'bg-[50%_25%]',
  ],
}).toMatchFormattedCss(css`
  .bg-\[50\%_25\%\] {
    background-position: 50% 25%;
  }
  .bg-bottom {
    background-position: bottom;
  }
  .bg-center {
    background-position: center;
  }
  .bg-left {
    background-position: 0;
  }
  .bg-left-bottom {
    background-position: 0 100%;
  }
  .bg-left-top {
    background-position: 0 0;
  }
  .bg-right {
    background-position: 100%;
  }
  .bg-right-bottom {
    background-position: 100% 100%;
  }
  .bg-right-top {
    background-position: 100% 0;
  }
  .bg-top {
    background-position: top;
  }
`)
