import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('dataVariants', {
  safelist: [
    'data-[describedby]:flex',

    'group-data-[describedby]:flex',
    'peer-data-[describedby]:flex',

    'group-data-[describedby]/foo:flex',
    'peer-data-[describedby]/foo:flex',
  ],
}).toMatchFormattedCss(css`
  .data-\[describedby\]\:flex[data-describedby],
  .group\/foo[data-describedby] .group-data-\[describedby\]\/foo\:flex,
  .group[data-describedby] .group-data-\[describedby\]\:flex,
  .peer\/foo[data-describedby] ~ .peer-data-\[describedby\]\/foo\:flex,
  .peer[data-describedby] ~ .peer-data-\[describedby\]\:flex {
    display: flex;
  }
`)
