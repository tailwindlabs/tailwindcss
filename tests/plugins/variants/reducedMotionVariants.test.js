import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('reducedMotionVariants').toMatchFormattedCss(css`
  @media (prefers-reduced-motion: no-preference) {
    .motion-safe\:flex {
      display: flex;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .motion-reduce\:flex {
      display: flex;
    }
  }
`)
