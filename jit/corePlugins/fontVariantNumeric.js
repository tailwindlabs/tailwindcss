let fontVariantBaseStyles = {
  '.ordinal, .slashed-zero, .lining-nums, .oldstyle-nums, .proportional-nums, .tabular-nums, .diagonal-fractions, .stacked-fractions': {
    '--tw-ordinal': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-slashed-zero': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-numeric-figure': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-numeric-spacing': 'var(--tw-empty,/*!*/ /*!*/)',
    '--tw-numeric-fraction': 'var(--tw-empty,/*!*/ /*!*/)',
    'font-variant-numeric':
      'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)',
  },
}

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'normal-nums': fontVariantBaseStyles,
    ordinal: fontVariantBaseStyles,
    'slashed-zero': fontVariantBaseStyles,
    'lining-nums': fontVariantBaseStyles,
    'oldstyle-nums': fontVariantBaseStyles,
    'proportional-nums': fontVariantBaseStyles,
    'tabular-nums': fontVariantBaseStyles,
    'diagonal-fractions': fontVariantBaseStyles,
    'stacked-fractions': fontVariantBaseStyles,
  })

  matchUtilities({
    'normal-nums': { '.normal-nums': { 'font-variant-numeric': 'normal' } },
    ordinal: { '.ordinal': { '--tw-ordinal': 'ordinal' } },
    'slashed-zero': { '.slashed-zero': { '--tw-slashed-zero': 'slashed-zero' } },
    'lining-nums': { '.lining-nums': { '--tw-numeric-figure': 'lining-nums' } },
    'oldstyle-nums': { '.oldstyle-nums': { '--tw-numeric-figure': 'oldstyle-nums' } },
    'proportional-nums': { '.proportional-nums': { '--tw-numeric-spacing': 'proportional-nums' } },
    'tabular-nums': { '.tabular-nums': { '--tw-numeric-spacing': 'tabular-nums' } },
    'diagonal-fractions': {
      '.diagonal-fractions': { '--tw-numeric-fraction': 'diagonal-fractions' },
    },
    'stacked-fractions': { '.stacked-fractions': { '--tw-numeric-fraction': 'stacked-fractions' } },
  })
}
