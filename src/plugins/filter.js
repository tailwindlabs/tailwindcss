export default function () {
  return function ({ config, addBase, addUtilities, variants }) {
    if (config('mode') === 'jit') {
      addBase({
        '*, ::before, ::after': {
          '--tw-blur': ' ',
          '--tw-brightness': ' ',
          '--tw-contrast': ' ',
          '--tw-grayscale': ' ',
          '--tw-hue-rotate': ' ',
          '--tw-invert': ' ',
          '--tw-saturate': ' ',
          '--tw-sepia': ' ',
          '--tw-drop-shadow': ' ',
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
          '.filter': { filter: 'var(--tw-filter)' },
          '.filter-none': { filter: 'none' },
        },
        variants('filter')
      )
    } else {
      addUtilities(
        {
          '.filter': {
            '--tw-blur': ' ',
            '--tw-brightness': ' ',
            '--tw-contrast': ' ',
            '--tw-grayscale': ' ',
            '--tw-hue-rotate': ' ',
            '--tw-invert': ' ',
            '--tw-saturate': ' ',
            '--tw-sepia': ' ',
            '--tw-drop-shadow': ' ',
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
