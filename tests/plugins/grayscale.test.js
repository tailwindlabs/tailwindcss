import { css, quickPluginTest } from '../util/run'

quickPluginTest('grayscale', {
  safelist: [
    // Arbitrary values
    'grayscale-[50%]',
    'grayscale-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .grayscale {
    --tw-grayscale: grayscale(100%);
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
      var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
  .grayscale-0 {
    --tw-grayscale: grayscale(0);
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
      var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
  .grayscale-\[50\%\] {
    --tw-grayscale: grayscale(50%);
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
      var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
  .grayscale-\[var\(--my-value\)\] {
    --tw-grayscale: grayscale(var(--my-value));
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
      var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
  }
`)
