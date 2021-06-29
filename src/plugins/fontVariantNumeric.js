export default function () {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        '.ordinal, .slashed-zero, .lining-nums, .oldstyle-nums, .proportional-nums, .tabular-nums, .diagonal-fractions, .stacked-fractions':
          {
            '--tw-ordinal': ' ',
            '--tw-slashed-zero': ' ',
            '--tw-numeric-figure': ' ',
            '--tw-numeric-spacing': ' ',
            '--tw-numeric-fraction': ' ',
            'font-variant-numeric':
              'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)',
          },
        '.normal-nums': {
          'font-variant-numeric': 'normal',
        },
        '.ordinal': {
          '--tw-ordinal': 'ordinal',
        },
        '.slashed-zero': {
          '--tw-slashed-zero': 'slashed-zero',
        },
        '.lining-nums': {
          '--tw-numeric-figure': 'lining-nums',
        },
        '.oldstyle-nums': {
          '--tw-numeric-figure': 'oldstyle-nums',
        },
        '.proportional-nums': {
          '--tw-numeric-spacing': 'proportional-nums',
        },
        '.tabular-nums': {
          '--tw-numeric-spacing': 'tabular-nums',
        },
        '.diagonal-fractions': {
          '--tw-numeric-fraction': 'diagonal-fractions',
        },
        '.stacked-fractions': {
          '--tw-numeric-fraction': 'stacked-fractions',
        },
      },
      variants('fontVariantNumeric')
    )
  }
}
