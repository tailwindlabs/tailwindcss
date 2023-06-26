import { css, quickPluginTest } from '../util/run'

quickPluginTest('backdropHueRotate', {
  safelist: [
    // Arbitrary values
    'backdrop-hue-rotate-[12deg]',
    'backdrop-hue-rotate-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .-backdrop-hue-rotate-0 {
    --tw-backdrop-hue-rotate: hue-rotate(-0deg);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .-backdrop-hue-rotate-15 {
    --tw-backdrop-hue-rotate: hue-rotate(-15deg);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .-backdrop-hue-rotate-180 {
    --tw-backdrop-hue-rotate: hue-rotate(-180deg);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .-backdrop-hue-rotate-30 {
    --tw-backdrop-hue-rotate: hue-rotate(-30deg);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .-backdrop-hue-rotate-60 {
    --tw-backdrop-hue-rotate: hue-rotate(-60deg);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .-backdrop-hue-rotate-90 {
    --tw-backdrop-hue-rotate: hue-rotate(-90deg);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-hue-rotate-0 {
    --tw-backdrop-hue-rotate: hue-rotate(0deg);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-hue-rotate-15 {
    --tw-backdrop-hue-rotate: hue-rotate(15deg);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-hue-rotate-180 {
    --tw-backdrop-hue-rotate: hue-rotate(180deg);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-hue-rotate-30 {
    --tw-backdrop-hue-rotate: hue-rotate(30deg);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-hue-rotate-60 {
    --tw-backdrop-hue-rotate: hue-rotate(60deg);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-hue-rotate-90 {
    --tw-backdrop-hue-rotate: hue-rotate(90deg);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-hue-rotate-\[12deg\] {
    --tw-backdrop-hue-rotate: hue-rotate(12deg);
    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .backdrop-hue-rotate-\[var\(--my-value\)\] {
    --tw-backdrop-hue-rotate: hue-rotate(var(--my-value));
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
