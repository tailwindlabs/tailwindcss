import { css, quickPluginTest } from '../util/run'

quickPluginTest('divideStyle').toMatchFormattedCss(css`
  .divide-solid > :not([hidden]) ~ :not([hidden]) {
    border-style: solid;
  }
  .divide-dashed > :not([hidden]) ~ :not([hidden]) {
    border-style: dashed;
  }
  .divide-dotted > :not([hidden]) ~ :not([hidden]) {
    border-style: dotted;
  }
  .divide-double > :not([hidden]) ~ :not([hidden]) {
    border-style: double;
  }
  .divide-none > :not([hidden]) ~ :not([hidden]) {
    border-style: none;
  }
`)
