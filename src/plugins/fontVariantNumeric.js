export default function() {
  return function({ addUtilities, variants, target }) {
    if (target('fontVariantNumeric') === 'ie11') {
      return
    }

    addUtilities(
      {
        '.ordinal, .slashed-zero, .lining-nums, .oldstyle-nums, .proportional-nums, .tabular-nums, .diagonal-fractions, .stacked-fractions': {
          '--font-variant-numeric-ordinal': 'var(--tailwind-empty,/*!*/ /*!*/)',
          '--font-variant-numeric-slashed-zero': 'var(--tailwind-empty,/*!*/ /*!*/)',
          '--font-variant-numeric-figure': 'var(--tailwind-empty,/*!*/ /*!*/)',
          '--font-variant-numeric-spacing': 'var(--tailwind-empty,/*!*/ /*!*/)',
          '--font-variant-numeric-fraction': 'var(--tailwind-empty,/*!*/ /*!*/)',
          'font-variant-numeric':
            'var(--font-variant-numeric-ordinal) var(--font-variant-numeric-slashed-zero) var(--font-variant-numeric-figure) var(--font-variant-numeric-spacing) var(--font-variant-numeric-fraction)',
        },
        '.normal-nums': {
          'font-variant-numeric': 'normal',
        },
        '.ordinal': {
          '--font-variant-numeric-ordinal': 'ordinal',
        },
        '.slashed-zero': {
          '--font-variant-numeric-slashed-zero': 'slashed-zero',
        },
        '.lining-nums': {
          '--font-variant-numeric-figure': 'lining-nums',
        },
        '.oldstyle-nums': {
          '--font-variant-numeric-figure': 'oldstyle-nums',
        },
        '.proportional-nums': {
          '--font-variant-numeric-spacing': 'proportional-nums',
        },
        '.tabular-nums': {
          '--font-variant-numeric-spacing': 'tabular-nums',
        },
        '.diagonal-fractions': {
          '--font-variant-numeric-fraction': 'diagonal-fractions',
        },
        '.stacked-fractions': {
          '--font-variant-numeric-fraction': 'stacked-fractions',
        },
      },
      variants('fontVariantNumeric')
    )
  }
}
