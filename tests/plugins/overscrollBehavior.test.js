import { css, quickPluginTest } from '../util/run'

quickPluginTest('overscrollBehavior').toMatchFormattedCss(css`
  .overscroll-auto {
    overscroll-behavior: auto;
  }
  .overscroll-contain {
    overscroll-behavior: contain;
  }
  .overscroll-none {
    overscroll-behavior: none;
  }
  .overscroll-y-auto {
    overscroll-behavior-y: auto;
  }
  .overscroll-y-contain {
    overscroll-behavior-y: contain;
  }
  .overscroll-y-none {
    overscroll-behavior-y: none;
  }
  .overscroll-x-auto {
    overscroll-behavior-x: auto;
  }
  .overscroll-x-contain {
    overscroll-behavior-x: contain;
  }
  .overscroll-x-none {
    overscroll-behavior-x: none;
  }
`)
