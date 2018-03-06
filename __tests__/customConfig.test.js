import path from 'path'
import postcss from 'postcss'
import tailwind from '../src/index'

test('it uses the values from the custom config file', () => {
  return postcss([tailwind(path.resolve(`${__dirname}/fixtures/customConfig.js`))])
    .process(
      `
        @responsive {
          .foo {
            color: blue;
          }
        }
      `,
      { from: undefined }
    )
    .then(result => {
      const expected = `
        .foo {
          color: blue;
        }
        @media (min-width: 400px) {
          .mobile\\:foo {
            color: blue;
          }
        }
      `

      expect(result.css).toMatchCss(expected)
    })
})
