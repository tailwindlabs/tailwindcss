import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('startingStyleVariant').toMatchFormattedCss(css`
  @starting-style {
    .starting\:flex {
      display: flex;
    }
  }
`)
