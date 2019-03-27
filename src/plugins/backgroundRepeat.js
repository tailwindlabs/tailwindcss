export default function() {
  return function({ addUtilities, config }) {
    const backgroundRepeat = config('classesNames').backgroundRepeat

    addUtilities(
      {
        [`.${backgroundRepeat}-repeat`]: { 'background-repeat': 'repeat' },
        [`.${backgroundRepeat}-no-repeat`]: {
          'background-repeat': 'no-repeat',
        },
        [`.${backgroundRepeat}-repeat-x`]: {
          'background-repeat': 'repeat-x',
        },
        [`.${backgroundRepeat}-repeat-y`]: {
          'background-repeat': 'repeat-y',
        },
      },
      config('variants.backgroundRepeat')
    )
  }
}
