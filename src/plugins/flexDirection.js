export default function() {
  return function({ addUtilities, config }) {
    const flexDirection = config('classesNames').flexDirection

    addUtilities(
      {
        [`.${flexDirection}-row`]: {
          'flex-direction': 'row',
        },
        [`.${flexDirection}-row-reverse`]: {
          'flex-direction': 'row-reverse',
        },
        [`.${flexDirection}-col`]: {
          'flex-direction': 'column',
        },
        [`.${flexDirection}-col-reverse`]: {
          'flex-direction': 'column-reverse',
        },
      },
      config('variants.flexDirection')
    )
  }
}
