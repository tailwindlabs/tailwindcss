import { css, quickPluginTest } from '../util/run'

quickPluginTest('invert', {
  safelist: [
    // Arbitrary values
    'invert-[50%]',
    'invert-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .invert {
    --tw-invert: invert(100%);
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
      var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
  .invert-0 {
    --tw-invert: invert(0);
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
      var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
  .invert-\[50\%\] {
    --tw-invert: invert(50%);
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
      var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
  .invert-\[var\(--my-value\)\] {
    --tw-invert: invert(var(--my-value));
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
      var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
`)
