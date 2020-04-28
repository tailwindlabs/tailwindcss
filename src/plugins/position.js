export default function() {
  return function({ addUtilities, variants, target }) {
    addUtilities(
      {
        '.static': { position: 'static' },
        '.fixed': { position: 'fixed' },
        '.absolute': { position: 'absolute' },
        '.relative': { position: 'relative' },
        ...(target('position') === 'ie11'
          ? {}
          : {
              '.sticky': {
                position: 'sticky',
              },
            }),
      },
      variants('position')
    )
  }
}
