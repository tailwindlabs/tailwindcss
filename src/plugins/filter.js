export default function () {
  return function ({ config, addBase, addUtilities, variants }) {
    if (config('mode') === 'jit') {
      addBase({
        '@defaults filter': {
          '--tw-blur': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-invert': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-drop-shadow': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-filter': [
            'var(--tw-blur)',
            'var(--tw-brightness)',
            'var(--tw-contrast)',
            'var(--tw-grayscale)',
            'var(--tw-hue-rotate)',
            'var(--tw-invert)',
            'var(--tw-saturate)',
            'var(--tw-sepia)',
            'var(--tw-drop-shadow)',
          ].join(' '),
        },
      })
      addUtilities(
        {
          '.filter': { '@defaults filter': {}, filter: 'var(--tw-filter)' },
          '.filter-none': { filter: 'none' },
        },
        variants('filter')
      )
    } else {
      addUtilities(
        {
          '.filter': {
            '--tw-blur': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-invert': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-drop-shadow': 'var(--tw-empty,/*!*/ /*!*/)',
            filter: [
              'var(--tw-blur)',
              'var(--tw-brightness)',
              'var(--tw-contrast)',
              'var(--tw-grayscale)',
              'var(--tw-hue-rotate)',
              'var(--tw-invert)',
              'var(--tw-saturate)',
              'var(--tw-sepia)',
              'var(--tw-drop-shadow)',
            ].join(' '),
          },
          '.filter-none': { filter: 'none' },
        },
        variants('filter')
      )
    }
  }
}
