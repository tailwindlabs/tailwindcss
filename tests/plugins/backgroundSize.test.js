import { css, quickPluginTest } from '../util/run'

quickPluginTest('backgroundSize', {
  safelist: [
    // Arbitrary values
    'bg-[50%]',
  ],
}).toMatchFormattedCss(css`
  .bg-\[50\%\] {
    background-size: 50%;
  }
  .bg-auto {
    background-size: auto;
  }
  .bg-contain {
    background-size: contain;
  }
  .bg-cover {
    background-size: cover;
  }
`)
