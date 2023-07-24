import { css, quickPluginTest } from '../util/run'

quickPluginTest('sepia', {
  safelist: [
    // Arbitrary values
    'sepia-[50%]',
    'sepia-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .sepia {
    --tw-sepia: sepia(100%);
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
      var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
  .sepia-0 {
    --tw-sepia: sepia(0);
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
      var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
  .sepia-\[50\%\] {
    --tw-sepia: sepia(50%);
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
      var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
  .sepia-\[var\(--my-value\)\] {
    --tw-sepia: sepia(var(--my-value));
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
      var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
`)
