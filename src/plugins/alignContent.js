export default function() {
  return function({ addUtilities, config }) {
    const alignContent = config('classesNames').alignContent

    addUtilities(
      {
        [`.${alignContent}-center`]: {
          'align-content': 'center',
        },
        [`.${alignContent}-start`]: {
          'align-content': 'flex-start',
        },
        [`.${alignContent}-end`]: {
          'align-content': 'flex-end',
        },
        [`.${alignContent}-between`]: {
          'align-content': 'space-between',
        },
        [`.${alignContent}-around`]: {
          'align-content': 'space-around',
        },
      },
      config('variants.alignContent')
    )
  }
}
