export default function() {
  return function({ addUtilities, variants, target }) {
    if (target('filter') === 'ie11') {
      return
    }

    addUtilities(
      {
        '.filter': {
          '--filter-blur': '0',
          '--filter-brightness': '100%',
          '--filter-contrast': '100%',
          '--filter-grayscale': '0',
          '--filter-hue-rotate': '0deg',
          '--filter-invert': '0',
          '--filter-opacity': '100%',
          '--filter-saturate': '100%',
          '--filter-sepia': '0',
          filter: [
            'blur(var(--filter-blur))',
            'brightness(var(--filter-brightness))',
            'contrast(var(--filter-contrast))',
            'grayscale(var(--filter-grayscale))',
            'hue-rotate(var(--filter-hue-rotate))',
            'invert(var(--filter-invert))',
            'opacity(var(--filter-opacity))',
            'saturate(var(--filter-saturate))',
            'sepia(var(--filter-sepia))',
          ].join(' '),
        },
        '.filter-none': { filter: 'none' },
      },
      variants('filter')
    )
  }
}
