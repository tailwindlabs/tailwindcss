export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.transform': {
          '--transform-scale-x': '1',
          '--transform-scale-y': '1',
          '--transform-rotate': '0',
          '--transform-translate-x': '0',
          '--transform-translate-y': '0',
          transform: [
            'scaleX(var(--transform-scale-x))',
            'scaleY(var(--transform-scale-y))',
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
