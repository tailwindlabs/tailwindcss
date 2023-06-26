import { css, quickPluginTest } from '../util/run'

quickPluginTest('backdropContrast', {
  safelist: [
    // Arbitrary values
    'backdrop-contrast-[.12]',
    'backdrop-contrast-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .backdrop-contrast-0 {
    --tw-backdrop-contrast: contrast(0);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-contrast-100 {
    --tw-backdrop-contrast: contrast(1);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-contrast-125 {
    --tw-backdrop-contrast: contrast(1.25);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-contrast-150 {
    --tw-backdrop-contrast: contrast(1.5);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-contrast-200 {
    --tw-backdrop-contrast: contrast(2);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-contrast-50 {
    --tw-backdrop-contrast: contrast(0.5);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-contrast-75 {
    --tw-backdrop-contrast: contrast(0.75);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-contrast-\[\.12\] {
    --tw-backdrop-contrast: contrast(0.12);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-contrast-\[var\(--my-value\)\] {
    --tw-backdrop-contrast: contrast(var(--my-value));
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
`)
