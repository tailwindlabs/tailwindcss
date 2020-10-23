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

test('the default config can be overridden using the presets key', () => {
  return postcss([
    tailwind({
      presets: [
        {
          theme: {
            extend: {
              minHeight: {
                24: '24px',
              },
            },
          },
          corePlugins: ['minHeight'],
          variants: { minHeight: [] },
        },
      ],
      theme: {
        extend: { minHeight: { 48: '48px' } },
      },
    }),
  ])
    .process(
      `
        @tailwind utilities
      `,
      { from: undefined }
    )
    .then(result => {
      const expected = `
        .min-h-0 {
          min-height: 0;
        }
        .min-h-24 {
          min-height: 24px;
        }
        .min-h-48 {
          min-height: 48px;
        }
        .min-h-full {
          min-height: 100%;
        }
        .min-h-screen {
          min-height: 100vh;
        }
      `

      expect(result.css).toMatchCss(expected)
    })
})

test('the default config can be removed by using an empty presets key in a preset', () => {
  return postcss([
    tailwind({
      presets: [
        {
          presets: [],
          theme: {
            extend: {
              minHeight: {
                24: '24px',
              },
            },
          },
          corePlugins: ['minHeight'],
          variants: { minHeight: [] },
        },
      ],
      theme: {
        extend: { minHeight: { 48: '48px' } },
      },
    }),
  ])
    .process(
      `
        @tailwind utilities
      `,
      { from: undefined }
    )
    .then(result => {
      const expected = `
        .min-h-24 {
          min-height: 24px;
        }
        .min-h-48 {
          min-height: 48px;
        }
      `

      expect(result.css).toMatchCss(expected)
    })
})

test('presets can have their own presets', () => {
  return postcss([
    tailwind({
      presets: [
        {
          presets: [],
          theme: {
            colors: { red: '#dd0000' },
          },
        },
        {
          presets: [
            {
              presets: [],
              theme: {
                colors: {
                  transparent: 'transparent',
                  red: '#ff0000',
                },
              },
            },
          ],
          theme: {
            extend: {
              colors: {
                black: 'black',
                red: '#ee0000',
              },
              backgroundColor: theme => theme('colors'),
            },
          },
          corePlugins: ['backgroundColor'],
        },
      ],
      theme: {
        extend: { colors: { white: 'white' } },
      },
    }),
  ])
    .process(
      `
        @tailwind utilities
      `,
      { from: undefined }
    )
    .then(result => {
      const expected = `
        .bg-transparent {
          background-color: transparent;
        }
        .bg-red {
          background-color: #ee0000;
        }
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
