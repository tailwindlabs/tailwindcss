export default function () {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        '.ordinal, .slashed-zero, .lining-nums, .oldstyle-nums, .proportional-nums, .tabular-nums, .diagonal-fractions, .stacked-fractions': {
          '--tw-font-variant-numeric-ordinal': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-font-variant-numeric-slashed-zero': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-font-variant-numeric-figure': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-font-variant-numeric-spacing': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-font-variant-numeric-fraction': 'var(--tw-empty,/*!*/ /*!*/)',
          'font-variant-numeric':
            'var(--tw-font-variant-numeric-ordinal) var(--tw-font-variant-numeric-slashed-zero) var(--tw-font-variant-numeric-figure) var(--tw-font-variant-numeric-spacing) var(--tw-font-variant-numeric-fraction)',
        },
        '.normal-nums': {
          'font-variant-numeric': 'normal',
        },
        '.ordinal': {
          '--tw-font-variant-numeric-ordinal': 'ordinal',
        },
        '.slashed-zero': {
          '--tw-font-variant-numeric-slashed-zero': 'slashed-zero',
        },
        '.lining-nums': {
          '--tw-font-variant-numeric-figure': 'lining-nums',
        },
        '.oldstyle-nums': {
          '--tw-font-variant-numeric-figure': 'oldstyle-nums',
        },
        '.proportional-nums': {
          '--tw-font-variant-numeric-spacing': 'proportional-nums',
        },
        '.tabular-nums': {
          '--tw-font-variant-numeric-spacing': 'tabular-nums',
        },
        '.diagonal-fractions': {
          '--tw-font-variant-numeric-fraction': 'diagonal-fractions',
        },
        '.stacked-fractions': {
          '--tw-font-variant-numeric-fraction': 'stacked-fractions',
        },
      },
      variants('fontVariantNumeric')
    )
  }
}
