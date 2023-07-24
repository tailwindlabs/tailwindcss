import { css, quickPluginTest } from '../util/run'

quickPluginTest('scrollSnapType').toMatchFormattedCss(css`
  *,
  :before,
  :after {
    --tw-scroll-snap-strictness: proximity;
  }
  ::-webkit-backdrop {
    --tw-scroll-snap-strictness: proximity;
  }
  ::backdrop {
    --tw-scroll-snap-strictness: proximity;
  }
  .snap-none {
    scroll-snap-type: none;
  }
  .snap-x {
    scroll-snap-type: x var(--tw-scroll-snap-strictness);
  }
  .snap-y {
    scroll-snap-type: y var(--tw-scroll-snap-strictness);
  }
  .snap-both {
    scroll-snap-type: both var(--tw-scroll-snap-strictness);
  }
  .snap-mandatory {
    --tw-scroll-snap-strictness: mandatory;
  }
  .snap-proximity {
    --tw-scroll-snap-strictness: proximity;
  }
`)
