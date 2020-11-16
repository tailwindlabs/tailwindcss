export default function () {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        '.transform': {
          '--tw-transform-translate-x': '0',
          '--tw-transform-translate-y': '0',
          '--tw-transform-rotate': '0',
          '--tw-transform-skew-x': '0',
          '--tw-transform-skew-y': '0',
          '--tw-transform-scale-x': '1',
          '--tw-transform-scale-y': '1',
          transform: [
            'translateX(var(--tw-transform-translate-x))',
            'translateY(var(--tw-transform-translate-y))',
            'rotate(var(--tw-transform-rotate))',
            'skewX(var(--tw-transform-skew-x))',
            'skewY(var(--tw-transform-skew-y))',
            'scaleX(var(--tw-transform-scale-x))',
            'scaleY(var(--tw-transform-scale-y))',
          ].join(' '),
        },
        '.transform-gpu': {
          '--tw-transform-translate-x': '0',
          '--tw-transform-translate-y': '0',
          '--tw-transform-rotate': '0',
          '--tw-transform-skew-x': '0',
          '--tw-transform-skew-y': '0',
          '--tw-transform-scale-x': '1',
          '--tw-transform-scale-y': '1',
          transform: [
            'translate3d(var(--tw-transform-translate-x), var(--tw-transform-translate-y), 0)',
            'rotate(var(--tw-transform-rotate))',
            'skewX(var(--tw-transform-skew-x))',
            'skewY(var(--tw-transform-skew-y))',
            'scaleX(var(--tw-transform-scale-x))',
            'scaleY(var(--tw-transform-scale-y))',
          ].join(' '),
        },
        '.transform-none': { transform: 'none' },
      },
      variants('transform')
    )
  }
}
