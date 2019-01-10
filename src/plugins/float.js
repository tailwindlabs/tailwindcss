export default function () {
  return function ({ addUtilities, config }) {
    addUtilities({
      '.float-right': { float: 'right' },
      '.float-left': { float: 'left' },
      '.float-none': { float: 'none' },
      '.clearfix:after': {
        content: '""',
        display: 'table',
        clear: 'both',
      }
    }, config('modules.float'))
  }
}
