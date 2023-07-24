import { css, quickPluginTest } from '../util/run'

quickPluginTest('boxDecorationBreak').toMatchFormattedCss(css`
  .decoration-slice {
    -webkit-box-decoration-break: slice;
    box-decoration-break: slice;
  }
  .decoration-clone {
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
  .box-decoration-slice {
    -webkit-box-decoration-break: slice;
    box-decoration-break: slice;
  }
  .box-decoration-clone {
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
`)
