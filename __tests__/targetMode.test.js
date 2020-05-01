import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import tailwind from '../src/index'
import config from '../stubs/defaultConfig.stub.js'
import processPlugins from '../src/util/processPlugins'
import runInTempDirectory from '../jest/runInTempDirectory'

function css(nodes) {
  return postcss.root({ nodes }).toString()
}

it('generates the right CSS in IE11 mode', () => {
  const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
  const input = fs.readFileSync(inputPath, 'utf8')

  return postcss([tailwind({ ...config, target: 'ie11' })])
    .process(input, { from: inputPath })
    .then(result => {
      const expected = fs.readFileSync(
        path.resolve(`${__dirname}/fixtures/tailwind-output-ie11.css`),
        'utf8'
      )

      expect(result.css).toBe(expected)
    })
})

test('plugins can request the target for a specific plugin key', () => {
  const { utilities } = processPlugins(
    [
      function({ addUtilities, target }) {
        addUtilities({
          '.testA': {
            target: target('testPluginA'),
          },
        })
      },
      function({ addUtilities, target }) {
        addUtilities({
          '.testB': {
            target: target('testPluginB'),
          },
        })
      },
      function({ addUtilities, target }) {
        addUtilities({
          '.testC': {
            target: target('testPluginC'),
          },
        })
      },
    ],
    {
      ...config,
      target: [
        'ie11',
        {
          testPluginA: 'modern',
          testPluginB: 'relaxed',
        },
      ],
    }
  )

  expect(css(utilities)).toMatchCss(`
    @variants {
      .testA {
        target: modern
      }
    }
    @variants {
      .testB {
        target: relaxed
      }
    }
    @variants {
      .testC {
        target: ie11
      }
    }
    `)
})

test('browserslist target is translated to a target preset', () => {
  return runInTempDirectory(() => {
    fs.writeFileSync(
      path.resolve('./.browserslistrc'),
      `
      last 2 versions
      IE 11
      `
    )
    const { utilities } = processPlugins(
      [
        function({ addUtilities, target }) {
          addUtilities({
            '.test': {
              target: target('testPlugin'),
            },
          })
        },
      ],
      {
        ...config,
        target: 'browserslist',
      }
    )

    expect(css(utilities)).toMatchCss(`
      @variants {
        .test {
          target: ie11
        }
      }
    `)

    return Promise.resolve()
  })
})

test('browserslist target is translated to a target preset with overrides', () => {
  return runInTempDirectory(() => {
    fs.writeFileSync(
      path.resolve('./.browserslistrc'),
      `
      last 2 versions
      IE 11
      `
    )
    const { utilities } = processPlugins(
      [
        function({ addUtilities, target }) {
          addUtilities({
            '.testA': {
              target: target('testPluginA'),
            },
          })
        },
        function({ addUtilities, target }) {
          addUtilities({
            '.testB': {
              target: target('testPluginB'),
            },
          })
        },
        function({ addUtilities, target }) {
          addUtilities({
            '.testC': {
              target: target('testPluginC'),
            },
          })
        },
      ],
      {
        ...config,
        target: [
          'browserslist',
          {
            testPluginA: 'modern',
            testPluginB: 'relaxed',
          },
        ],
      }
    )

    expect(css(utilities)).toMatchCss(`
          @variants {
            .testA {
              target: modern
            }
          }
          @variants {
            .testB {
              target: relaxed
            }
          }
          @variants {
            .testC {
              target: ie11
            }
          }
    `)

    return Promise.resolve()
  })
})
