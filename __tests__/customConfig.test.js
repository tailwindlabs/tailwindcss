import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import tailwind from '../src/index'
import { defaultConfigFile } from '../src/constants'
import inTempDirectory from '../jest/runInTempDirectory'

test('it uses the values from the custom config file', () =>
  postcss([tailwind(path.resolve(`${__dirname}/fixtures/custom-config.js`))])
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
    }))

test('custom config can be passed as an object', () =>
  postcss([
    tailwind({
      theme: {
        screens: {
          mobile: '400px',
        },
      },
    }),
  ])
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
    }))

test('tailwind.config.js is picked up by default', () =>
  inTempDirectory(() => {
    fs.writeFileSync(
      path.resolve(defaultConfigFile),
      `module.exports = {
        theme: {
          screens: {
            mobile: '400px',
          },
        },
      }`
    )

    return postcss([tailwind])
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
        expect(result.css).toMatchCss(`
          .foo {
            color: blue;
          }
          @media (min-width: 400px) {
            .mobile\\:foo {
              color: blue;
            }
          }
        `)
      })
  }))
