export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.transform': {
          '--transform-scale': '1',
          '--transform-rotate': '0',
          '--transform-translate-x': '0',
          '--transform-translate-y': '0',
          transform: [
            'scale(var(--transform-scale))',
            'rotate(var(--transform-rotate))',
            'translateX(var(--transform-translate-x))',
            'translateY(var(--transform-translate-y))',
          ].join(' '),
        },
        '.transform-none': { transform: 'none' },
      },
      variants('transform')
    )
  }
}
