import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('hasVariants', {
  safelist: [
    'has-[.foo]:flex',

    'group-has-[.foo]:flex',
    'peer-has-[.foo]:flex',

    'group-has-[.bar]/foo:flex',
    'peer-has-[.bar]/foo:flex',
  ],
}).toMatchFormattedCss(
  css`
    .has-\[\.foo\]\:flex:has(.foo) {
      display: flex;
    }
    .group\/foo:has(.bar) .group-has-\[\.bar\]\/foo\:flex {
      display: flex;
    }
    .group:has(.foo) .group-has-\[\.foo\]\:flex {
      display: flex;
    }
    .peer\/foo:has(.bar) ~ .peer-has-\[\.bar\]\/foo\:flex {
      display: flex;
    }
    .peer:has(.foo) ~ .peer-has-\[\.foo\]\:flex {
      display: flex;
    }
  `
)
