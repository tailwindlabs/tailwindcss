export default function() {
  return function({ addUtilities, config }) {
    const alignSelf = config('classesNames').alignSelf

    addUtilities(
      {
        [`.${alignSelf}-auto`]: {
          'align-self': 'auto',
        },
        [`.${alignSelf}-start`]: {
          'align-self': 'flex-start',
        },
        [`.${alignSelf}-end`]: {
          'align-self': 'flex-end',
        },
        [`.${alignSelf}-center`]: {
          'align-self': 'center',
        },
        [`.${alignSelf}-stretch`]: {
          'align-self': 'stretch',
        },
      },
      config('variants.alignSelf')
    )
  }
}
