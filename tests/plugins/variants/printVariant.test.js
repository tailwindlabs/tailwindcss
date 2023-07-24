import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('printVariant').toMatchFormattedCss(css`
  @media print {
    .print\:flex {
      display: flex;
    }
  }
`)
