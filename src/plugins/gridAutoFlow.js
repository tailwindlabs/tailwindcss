export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.grid-flow-row': { gridAutoFlow: 'row' },
        '.grid-flow-col': { gridAutoFlow: 'column' },
        '.grid-flow-row-dense': { gridAutoFlow: 'row dense' },
        '.grid-flow-col-dense': { gridAutoFlow: 'column dense' },
      },
      variants('gridAutoFlow')
    )
  }
}
