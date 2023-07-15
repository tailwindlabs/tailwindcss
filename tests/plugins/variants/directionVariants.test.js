import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('directionVariants').toMatchFormattedCss(css`
  :is([dir='ltr'] .ltr\:flex),
  :is([dir='rtl'] .rtl\:flex) {
    display: flex;
  }
`)
