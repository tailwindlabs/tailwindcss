export default function() {
  return function({ addUtilities }) {
    addUtilities({
      '.marker > :not(template)': {
        display: 'flex',
        alignItems: 'center',
        listStylePosition: 'inside',
      },
      '.marker > :not(template):before': {
        content: '""',
        display: 'list-item',
      },
    })
  }
}
