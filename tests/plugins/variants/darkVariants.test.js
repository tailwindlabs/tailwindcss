import { css, quickVariantPluginTest } from '../../util/run'

// Default media dark mode
quickVariantPluginTest('darkVariants').toMatchFormattedCss(css`
  @media (prefers-color-scheme: dark) {
    .dark\:flex {
      display: flex;
    }
  }
`)

// Class dark mode
quickVariantPluginTest('darkVariants', {
  darkMode: 'class',
}).toMatchFormattedCss(css`
  :is(.dark .dark\:flex) {
    display: flex;
  }
`)

// Class dark mode with custom class name
quickVariantPluginTest('darkVariants', {
  darkMode: ['class', '.my-dark-mode'],
}).toMatchFormattedCss(css`
  :is(.my-dark-mode .dark\:flex) {
    display: flex;
  }
`)
