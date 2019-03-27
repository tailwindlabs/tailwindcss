export default function() {
  return function({ addUtilities, config }) {
    const alignItems = config('classesNames').alignItems

    addUtilities(
      {
        [`.${alignItems}-start`]: {
          'align-items': 'flex-start',
        },
        [`.${alignItems}-end`]: {
          'align-items': 'flex-end',
        },
        [`.${alignItems}-center`]: {
          'align-items': 'center',
        },
        [`.${alignItems}-baseline`]: {
          'align-items': 'baseline',
        },
        [`.${alignItems}-stretch`]: {
          'align-items': 'stretch',
        },
      },
      config('variants.alignItems')
    )
  }
}
