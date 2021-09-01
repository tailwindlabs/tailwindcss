export default function () {
  return function ({ addBase, addUtilities, variants }) {
    addBase({
      '@defaults backdrop-filter': {
        '--tw-backdrop-blur': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-invert': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-opacity': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-backdrop-filter': [
          'var(--tw-backdrop-blur)',
          'var(--tw-backdrop-brightness)',
          'var(--tw-backdrop-contrast)',
          'var(--tw-backdrop-grayscale)',
          'var(--tw-backdrop-hue-rotate)',
          'var(--tw-backdrop-invert)',
          'var(--tw-backdrop-opacity)',
          'var(--tw-backdrop-saturate)',
          'var(--tw-backdrop-sepia)',
        ].join(' '),
      },
    })
    addUtilities(
      {
        '.backdrop-filter': {
          '@defaults backdrop-filter': {},
          'backdrop-filter': 'var(--tw-backdrop-filter)',
        },
        '.backdrop-filter-none': { 'backdrop-filter': 'none' },
      },
      variants('backdropFilter')
    )
  }
}
