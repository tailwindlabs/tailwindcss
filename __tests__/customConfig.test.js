import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import tailwind from '../src/index'
import { defaultConfigFile } from '../src/constants'
import inTempDirectory from '../jest/runInTempDirectory'

test('it uses the values from the custom config file', () => {
  return postcss([tailwind(path.resolve(`${__dirname}/fixtures/custom-config.js`))])
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

test('custom config can be passed as an object', () => {
  return postcss([
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
    })
})

test('custom config path can be passed using `config` property in an object', () => {
  return postcss([tailwind({ config: path.resolve(`${__dirname}/fixtures/custom-config.js`) })])
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

test('custom config can be passed under the `config` property', () => {
  return postcss([
    tailwind({
      config: {
        theme: {
          screens: {
            mobile: '400px',
          },
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
    })
})

test('tailwind.config.js is picked up by default', () => {
  return inTempDirectory(() => {
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
  })
})

test('tailwind.config.js is picked up by default when passing an empty object', () => {
  return inTempDirectory(() => {
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

    return postcss([tailwind({})])
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
  })
})

test('when custom config is an array the default config is not included', () => {
  return postcss([
    tailwind([
      {
        theme: {
          extend: {
            colors: {
              black: 'black',
            },
            backgroundColor: theme => theme('colors'),
          },
        },
        corePlugins: ['backgroundColor'],
      },
      {
        theme: {
          extend: { colors: { white: 'white' } },
        },
      },
    ]),
  ])
    .process(
      `
        @tailwind utilities
      `,
      { from: undefined }
    )
    .then(result => {
      const expected = `
        .bg-black {
          background-color: black;
        }
        .bg-white {
          background-color: white;
        }
      `

      expect(result.css).toMatchCss(expected)
    })
})

test('when custom config is an array in a file the default config is not included', () => {
  return inTempDirectory(() => {
    fs.writeFileSync(
      path.resolve(defaultConfigFile),
      `module.exports = [
        {
          theme: {
            extend: {
              colors: {
                black: 'black',
              },
              backgroundColor: theme => theme('colors'),
            },
          },
          corePlugins: ['backgroundColor'],
        },
        {
          theme: {
            extend: { colors: { white: 'white' } },
          },
        }
      ]`
    )

    return postcss([tailwind()])
      .process(
        `
          @tailwind utilities
        `,
        { from: undefined }
      )
      .then(result => {
        const expected = `
          .bg-black {
            background-color: black;
          }
          .bg-white {
            background-color: white;
          }
        `

        expect(result.css).toMatchCss(expected)
      })
  })
})
