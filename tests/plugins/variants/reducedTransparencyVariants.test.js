import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('reducedTransparencyVariants').toMatchFormattedCss(css`
  @media (prefers-reduced-transparency: no-preference) {
    .transparency-safe\:flex {
      display: flex;
    }
  }
  @media (prefers-reduced-transparency: reduce) {
    .transparency-reduce\:flex {
      display: flex;
    }
  }
`)
