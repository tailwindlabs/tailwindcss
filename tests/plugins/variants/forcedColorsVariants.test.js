import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('forcedColorsVariants').toMatchFormattedCss(css`
  @media (forced-colors: active) {
    .forced-colors\:flex {
      display: flex;
    }
  }
`)
