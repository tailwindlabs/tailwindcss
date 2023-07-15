import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('prefersContrastVariants').toMatchFormattedCss(css`
  @media (prefers-contrast: more) {
    .contrast-more\:flex {
      display: flex;
    }
  }
  @media (prefers-contrast: less) {
    .contrast-less\:flex {
      display: flex;
    }
  }
`)
