import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('invertedColorsVariants').toMatchFormattedCss(css`
  @media (inverted-colors: inverted) {
    .inverted-colors\:flex {
      display: flex;
    }
  }
`)
