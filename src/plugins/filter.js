export let filterVars = [
  'var(--tw-blur)',
  'var(--tw-brightness)',
  'var(--tw-contrast)',
  'var(--tw-grayscale)',
  'var(--tw-hue-rotate)',
  'var(--tw-invert)',
  'var(--tw-saturate)',
  'var(--tw-sepia)',
  'var(--tw-drop-shadow)',
].join(' ')

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
        },
      })
      addUtilities(
        {
          '.filter': { filter: filterVars },
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
            filter: filterVars,
          },
          '.filter-none': { filter: 'none' },
        },
        variants('filter')
      )
    }
  }
}
