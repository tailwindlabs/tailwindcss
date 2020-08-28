import postcss from 'postcss'
import tailwind from '../src/index'

test('experimental extended font sizes can be accessed via the `theme()` function', () => {
  return postcss([
    tailwind({
      experimental: {
        extendedFontSizeScale: true,
      },
    }),
  ])
    .process(
      `
        .heading-1 { font-size: theme('fontSize.8xl'); }
        .heading-2 { font-size: theme('fontSize.7xl'); }
        .heading-3 { font-size: theme('fontSize.5xl'); }
      `,
      { from: undefined }
    )
    .then(result => {
      const expected = `
        .heading-1 { font-size: 6rem; }
        .heading-2 { font-size: 5rem; }
        .heading-3 { font-size: 3rem; }
      `

      expect(result.css).toMatchCss(expected)
    })
})
