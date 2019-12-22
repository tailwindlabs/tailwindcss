export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.transform': {
          transform: [
            'scale(var(--transform-scale, 1))',
            'rotate(var(--transform-rotate, 0))',
            'translateX(var(--transform-translate-x, 0))',
            'translateY(var(--transform-translate-y, 0))',
          ].join(' '),
        },
        '.transform-none': { transform: 'none' },
      },
      variants('transform')
    )
  }
}
