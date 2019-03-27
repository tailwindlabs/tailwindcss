export default function() {
  return function({ addUtilities, config }) {
    const justifyContent = config('classesNames').justifyContent

    addUtilities(
      {
        [`.${justifyContent}-start`]: {
          'justify-content': 'flex-start',
        },
        [`.${justifyContent}-end`]: {
          'justify-content': 'flex-end',
        },
        [`.${justifyContent}-center`]: {
          'justify-content': 'center',
        },
        [`.${justifyContent}-between`]: {
          'justify-content': 'space-between',
        },
        [`.${justifyContent}-around`]: {
          'justify-content': 'space-around',
        },
      },
      config('variants.justifyContent')
    )
  }
}
