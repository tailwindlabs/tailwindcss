export default function() {
  return function({ addUtilities, config }) {
    const flexWrap = config('classesNames').flexWrap

    addUtilities(
      {
        [`.${flexWrap}`]: {
          'flex-wrap': 'wrap',
        },
        [`.${flexWrap}-reverse`]: {
          'flex-wrap': 'wrap-reverse',
        },
        '.flex-no-wrap': {
          'flex-wrap': 'nowrap',
        },
      },
      config('variants.flexWrap')
    )
  }
}
