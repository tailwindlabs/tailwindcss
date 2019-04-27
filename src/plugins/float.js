export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.float-right': { float: 'right' },
        '.float-left': { float: 'left' },
        '.float-none': { float: 'none' },
        '.clearfix:after': {
          content: '""',
          display: 'table',
          clear: 'both',
        },
      },
      variants('float')
    )
  }
}
