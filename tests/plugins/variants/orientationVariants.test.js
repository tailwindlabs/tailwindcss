import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('orientationVariants').toMatchFormattedCss(css`
  @media (orientation: portrait) {
    .portrait\:flex {
      display: flex;
    }
  }
  @media (orientation: landscape) {
    .landscape\:flex {
      display: flex;
    }
  }
`)
