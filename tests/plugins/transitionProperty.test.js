import { css, quickPluginTest } from '../util/run'

quickPluginTest('transitionProperty', {
  safelist: [
    // Arbitrary values
    'transition-[accentColor]',
    'transition-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .transition {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke,
      opacity, box-shadow, transform, filter, -webkit-backdrop-filter, backdrop-filter;
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-\[accentColor\] {
    transition-property: accentColor;
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-\[var\(--my-value\)\] {
    transition-property: var(--my-value);
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-all {
    transition-property: all;
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-colors {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-none {
    transition-property: none;
  }
  .transition-opacity {
    transition-property: opacity;
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-shadow {
    transition-property: box-shadow;
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-transform {
    transition-property: transform;
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
`)
