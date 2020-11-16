export default function () {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        '.ordinal, .slashed-zero, .lining-nums, .oldstyle-nums, .proportional-nums, .tabular-nums, .diagonal-fractions, .stacked-fractions': {
          '--tw-fvn-ordinal': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-fvn-slashed-zero': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-fvn-figure': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-fvn-spacing': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-fvn-fraction': 'var(--tw-empty,/*!*/ /*!*/)',
          'font-variant-numeric':
            'var(--tw-fvn-ordinal) var(--tw-fvn-slashed-zero) var(--tw-fvn-figure) var(--tw-fvn-spacing) var(--tw-fvn-fraction)',
        },
        '.normal-nums': {
          'font-variant-numeric': 'normal',
        },
        '.ordinal': {
          '--tw-fvn-ordinal': 'ordinal',
        },
        '.slashed-zero': {
          '--tw-fvn-slashed-zero': 'slashed-zero',
        },
        '.lining-nums': {
          '--tw-fvn-figure': 'lining-nums',
        },
        '.oldstyle-nums': {
          '--tw-fvn-figure': 'oldstyle-nums',
        },
        '.proportional-nums': {
          '--tw-fvn-spacing': 'proportional-nums',
        },
        '.tabular-nums': {
          '--tw-fvn-spacing': 'tabular-nums',
        },
        '.diagonal-fractions': {
          '--tw-fvn-fraction': 'diagonal-fractions',
        },
        '.stacked-fractions': {
          '--tw-fvn-fraction': 'stacked-fractions',
        },
      },
      variants('fontVariantNumeric')
    )
  }
}
