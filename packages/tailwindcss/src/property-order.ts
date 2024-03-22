export default [
  'container-type',

  'pointer-events',
  'visibility',
  'position',

  // How do we make `inset-x-0` come before `top-0`?
  'inset',
  'inset-inline',
  'inset-block',
  'inset-inline-start',
  'inset-inline-end',
  'top',
  'right',
  'bottom',
  'left',

  'isolation',
  'z-index',
  'order',
  'grid-column',
  'grid-column-start',
  'grid-column-end',
  'grid-row',
  'grid-row-start',
  'grid-row-end',
  'float',
  'clear',

  // How do we make `mx-0` come before `mt-0`?
  // Idea: `margin-x` property that we compile away with a Visitor plugin?
  'margin',
  'margin-inline',
  'margin-block',
  'margin-inline-start',
  'margin-inline-end',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',

  'box-sizing',
  'display',
  'aspect-ratio',

  'height',
  'max-height',
  'min-height',
  'width',
  'max-width',
  'min-width',

  'flex',
  'flex-shrink',
  'flex-grow',
  'flex-basis',

  'table-layout',
  'caption-side',
  'border-collapse',

  // There's no `border-spacing-x` property, we use variables, how to sort?
  'border-spacing',
  // '--tw-border-spacing-x',
  // '--tw-border-spacing-y',

  'transform-origin',

  'translate',
  '--tw-translate-x',
  '--tw-translate-y',
  'scale',
  '--tw-scale-x',
  '--tw-scale-y',
  '--tw-scale-z',
  'rotate',
  '--tw-rotate-x',
  '--tw-rotate-y',
  '--tw-rotate-z',
  '--tw-skew-x',
  '--tw-skew-y',
  'transform',

  'animation',

  'cursor',

  'touch-action',
  '--tw-pan-x',
  '--tw-pan-y',
  '--tw-pinch-zoom',

  'resize',

  'scroll-snap-type',
  '--tw-scroll-snap-strictness',
  'scroll-snap-align',
  'scroll-snap-stop',
  'scroll-margin',
  'scroll-margin-inline-start',
  'scroll-margin-inline-end',
  'scroll-margin-top',
  'scroll-margin-right',
  'scroll-margin-bottom',
  'scroll-margin-left',

  'scroll-padding',
  'scroll-padding-inline-start',
  'scroll-padding-inline-end',
  'scroll-padding-top',
  'scroll-padding-right',
  'scroll-padding-bottom',
  'scroll-padding-left',

  'list-style-position',
  'list-style-type',
  'list-style-image',

  'appearance',

  'columns',
  'break-before',
  'break-inside',
  'break-after',

  'grid-auto-columns',
  'grid-auto-flow',
  'grid-auto-rows',
  'grid-template-columns',
  'grid-template-rows',

  'flex-direction',
  'flex-wrap',
  'place-content',
  'place-items',
  'align-content',
  'align-items',
  'justify-content',
  'justify-items',
  'gap',
  'column-gap',
  'row-gap',
  '--tw-space-x-reverse',
  '--tw-space-y-reverse',

  // Is there a more "real" property we could use for this?
  'divide-x-width',
  'divide-y-width',
  '--tw-divide-y-reverse',
  'divide-style',
  'divide-color',
  '--tw-divide-opacity',

  'place-self',
  'align-self',
  'justify-self',

  'overflow',
  'overflow-x',
  'overflow-y',

  'overscroll-behavior',
  'overscroll-behavior-x',
  'overscroll-behavior-y',

  'scroll-behavior',

  'text-overflow',
  'hyphens',
  'white-space',

  'text-wrap',
  'overflow-wrap',
  'work-break',

  'border-radius',
  'border-start-radius', // Not real
  'border-end-radius', // Not real
  'border-top-radius', // Not real
  'border-right-radius', // Not real
  'border-bottom-radius', // Not real
  'border-left-radius', // Not real
  'border-start-start-radius',
  'border-start-end-radius',
  'border-end-end-radius',
  'border-end-start-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',

  'border-width',
  'border-inline-width', // Not real
  'border-inline-start-width',
  'border-inline-end-width',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',

  'border-style',
  'border-color',
  'border-x-color', // Not real
  'border-y-color', // Not real
  'border-inline-start-color',
  'border-inline-end-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',

  '--tw-border-opacity',

  'background-color',
  '--tw-bg-opacity',

  'background-image',
  '--tw-gradient-stops',
  '--tw-gradient-via-stops',
  '--tw-gradient-from',
  '--tw-gradient-from-position',
  '--tw-gradient-via',
  '--tw-gradient-via-position',
  '--tw-gradient-to',
  '--tw-gradient-to-position',

  'box-decoration-break',

  'background-size',
  'background-attachment',
  'background-clip',
  'background-position',
  'background-repeat',
  'background-origin',

  'fill',
  'stroke',
  'stroke-width',

  'object-fit',
  'object-position',

  'padding',
  'padding-inline',
  'padding-block',
  'padding-inline-start',
  'padding-inline-end',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',

  'text-align',
  'text-indent',
  'vertical-align',

  'font-family',
  'font-size',
  'font-weight',
  'text-transform',
  'font-style',
  'font-stretch',
  'font-variant-numeric',
  'line-height',
  'letter-spacing',
  'color',
  '--tw-text-opacity',
  'text-decoration-line',
  'text-decoration-color',
  'text-decoration-style',
  'text-decoration-thickness',
  'text-underline-offset',
  '-webkit-font-smoothing',

  'placeholder-color', // Not real
  '--tw-placeholder-opacity',

  'caret-color',
  'accent-color',

  'opacity',

  'background-blend-mode',
  'mix-blend-mode',

  'box-shadow',
  '--tw-shadow',
  '--tw-shadow-color',
  '--tw-ring-shadow',
  '--tw-ring-color',
  '--tw-inset-shadow',
  '--tw-inset-shadow-color',
  '--tw-inset-ring-shadow',
  '--tw-inset-ring-color',
  '--tw-ring-opacity',
  '--tw-ring-offset-width',
  '--tw-ring-offset-color',

  'outline',
  'outline-width',
  'outline-offset',
  'outline-color',

  '--tw-blur',
  '--tw-brightness',
  '--tw-contrast',
  '--tw-drop-shadow',
  '--tw-grayscale',
  '--tw-hue-rotate',
  '--tw-invert',
  '--tw-saturate',
  '--tw-sepia',
  'filter',

  '--tw-backdrop-blur',
  '--tw-backdrop-brightness',
  '--tw-backdrop-contrast',
  '--tw-backdrop-grayscale',
  '--tw-backdrop-hue-rotate',
  '--tw-backdrop-invert',
  '--tw-backdrop-opacity',
  '--tw-backdrop-saturate',
  '--tw-backdrop-sepia',
  'backdrop-filter',

  'transition-property',
  'transition-delay',
  'transition-duration',
  'transition-timing-function',

  'will-change',
  'contain',

  'content',

  'forced-color-adjust',
]
