export default function() {
  return function({ addUtilities, config }) {
    const float = config('classesNames').float

    addUtilities(
      {
        [`.${float}-right`]: { float: 'right' },
        [`.${float}-left`]: { float: 'left' },
        [`.${float}-none`]: { float: 'none' },
        '.clearfix:after': {
          content: '""',
          display: 'table',
          clear: 'both',
        },
      },
      config('variants.float')
    )
  }
}
