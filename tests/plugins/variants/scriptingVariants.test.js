import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('scriptingVariants').toMatchFormattedCss(css`
  @media (scripting: none) {
    .noscript\:flex {
      display: flex;
    }
  }
  @media (scripting: enabled) {
    .scripting\:flex {
      display: flex;
    }
  }
`)
