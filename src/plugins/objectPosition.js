export default function() {
  return function({ addUtilities, config }) {
    const objectPosition = config('classesNames').objectPosition

    addUtilities(
      {
        [`.${objectPosition}-bottom`]: { 'object-position': 'bottom' },
        [`.${objectPosition}-center`]: { 'object-position': 'center' },
        [`.${objectPosition}-left`]: { 'object-position': 'left' },
        [`.${objectPosition}-left-bottom`]: {
          'object-position': 'left bottom',
        },
        [`.${objectPosition}-left-top`]: { 'object-position': 'left top' },
        [`.${objectPosition}-right`]: { 'object-position': 'right' },
        [`.${objectPosition}-right-bottom`]: {
          'object-position': 'right bottom',
        },
        [`.${objectPosition}-right-top`]: { 'object-position': 'right top' },
        [`.${objectPosition}-top`]: { 'object-position': 'top' },
      },
      config('variants.objectPosition')
    )
  }
}
