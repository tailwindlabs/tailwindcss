import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('supportsVariants', {
  safelist: [
    'supports-[display]:flex',
    'supports-[display:grid]:flex',
    'supports-[foo_or_bar]:flex',
    'supports-[foo_or_bar_and_not_baz]:flex',
  ],
}).toMatchFormattedCss(css`
  @supports (display: grid) {
    .supports-\[display\:grid\]\:flex {
      display: flex;
    }
  }
  @supports (display: var(--tw)) {
    .supports-\[display\]\:flex {
      display: flex;
    }
  }
  @supports (foo or bar: var(--tw)) {
    .supports-\[foo_or_bar\]\:flex {
      display: flex;
    }
  }
  @supports (foo or bar and not baz: var(--tw)) {
    .supports-\[foo_or_bar_and_not_baz\]\:flex {
      display: flex;
    }
  }
`)
