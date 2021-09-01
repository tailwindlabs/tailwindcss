module.exports = {
  content: ['./tests/fixtures/*.html'],
  theme: {
    extend: {
      colors: {
        'black!': '#000',
      },
      spacing: {
        1.5: '0.375rem',
        '(1/2+8)': 'calc(50% + 2rem)',
      },
      minHeight: {
        '(screen-4)': 'calc(100vh - 1rem)',
      },
      fontFamily: {
        '%#$@': 'Comic Sans',
      },
    },
  },
}
