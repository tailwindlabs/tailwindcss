import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import tailwind from '../src/index'
import defaultConfig from '../stubs/defaultConfig.stub.js'

function suppressConsoleLogs(cb, type = 'warn') {
  return () => {
    const spy = jest.spyOn(global.console, type).mockImplementation(jest.fn())

    const promise = new Promise((resolve, reject) => {
      Promise.resolve(cb()).then(resolve, reject)
    })

    promise.then(spy.mockRestore, spy.mockRestore)

    return promise
  }
}

function extractRules(root) {
  let rules = []

  root.walkRules(r => {
    rules = rules.concat(r.selectors)
  })

  return rules
}

async function inProduction(callback) {
  const OLD_NODE_ENV = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'

  const result = await callback()
  process.env.NODE_ENV = OLD_NODE_ENV
  return result
}

const config = {
  ...defaultConfig,
  theme: {
    extend: {
      colors: {
        'black!': '#000',
      },
      spacing: {
        '1.5': '0.375rem',
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

delete config.presets

function assertPurged(result) {
  expect(result.css).not.toContain('.bg-red-600')
  expect(result.css).not.toContain('.w-1\\/3')
  expect(result.css).not.toContain('.flex')
  expect(result.css).not.toContain('.font-sans')
  expect(result.css).not.toContain('.text-right')
  expect(result.css).not.toContain('.px-4')
  expect(result.css).not.toContain('.h-full')

  expect(result.css).toContain('.bg-red-500')
  expect(result.css).toContain('.md\\:bg-blue-300')
  expect(result.css).toContain('.w-1\\/2')
  expect(result.css).toContain('.block')
  expect(result.css).toContain('.md\\:flow-root')
  expect(result.css).toContain('.h-screen')
  expect(result.css).toContain('.min-h-\\(screen-4\\)')
  expect(result.css).toContain('.bg-black\\!')
  expect(result.css).toContain('.font-\\%\\#\\$\\@')
  expect(result.css).toContain('.w-\\(1\\/2\\+8\\)')
  expect(result.css).toContain('.inline-grid')
  expect(result.css).toContain('.grid-cols-3')
  expect(result.css).toContain('.px-1\\.5')
  expect(result.css).toContain('.col-span-2')
  expect(result.css).toContain('.col-span-1')
  expect(result.css).toContain('.text-center')
  expect(result.css).toContain('.flow-root')
  expect(result.css).toContain('.text-green-700')
  expect(result.css).toContain('.bg-green-100')
  expect(result.css).toContain('.text-left')
  expect(result.css).toContain('.font-mono')
  expect(result.css).toContain('.col-span-4')
  expect(result.css).toContain('.tracking-tight')
  expect(result.css).toContain('.whitespace-no-wrap')
}

test('purges unused classes', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return postcss([
        tailwind({
          ...config,
          purge: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
        }),
      ])
        .process(input, { from: inputPath })
        .then(result => {
          assertPurged(result)
        })
    })
  )
})

test('custom css is not purged by default', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      return postcss([
        tailwind({
          ...config,
          purge: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
        }),
      ])
        .process(
          `
        @tailwind base;

        @tailwind components;

        @tailwind utilities;

        .example {
          @apply font-bold;
          color: theme('colors.red.500');
        }
      `,
          { from: null }
        )
        .then(result => {
          const rules = extractRules(result.root)
          assertPurged(result)
          expect(rules).toContain('.example')
        })
    })
  )
})

test('custom css that uses @responsive is not purged by default', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      return postcss([
        tailwind({
          ...config,
          purge: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
        }),
      ])
        .process(
          `
        @tailwind base;

        @tailwind components;

        @tailwind utilities;

        @responsive {
          .example {
            @apply font-bold;
            color: theme('colors.red.500');
          }
        }
      `,
          { from: null }
        )
        .then(result => {
          const rules = extractRules(result.root)
          assertPurged(result)
          expect(rules).toContain('.example')
        })
    })
  )
})

test('custom css in a layer is purged by default when using layers mode', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      return postcss([
        tailwind({
          ...config,
          future: {
            purgeLayersByDefault: true,
          },
          purge: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
        }),
      ])
        .process(
          `
          @tailwind base;

          @tailwind components;

          @layer components {
            .example {
              @apply font-bold;
              color: theme('colors.red.500');
            }
          }

          @tailwind utilities;
        `,
          { from: null }
        )
        .then(result => {
          const rules = extractRules(result.root)
          assertPurged(result)
          expect(rules).not.toContain('.example')
        })
    })
  )
})

test('custom css in a layer in a @responsive at-rule is purged by default', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      return postcss([
        tailwind({
          ...config,
          future: {
            purgeLayersByDefault: true,
          },
          purge: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
        }),
      ])
        .process(
          `
        @tailwind base;

        @tailwind components;

        @layer components {
          @responsive {
            .example {
              @apply font-bold;
              color: theme('colors.red.500');
            }
          }
        }

        @tailwind utilities;
      `,
          { from: null }
        )
        .then(result => {
          const rules = extractRules(result.root)
          assertPurged(result)
          expect(rules).not.toContain('.example')
        })
    })
  )
})

test('purges unused classes with important string', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return postcss([
        tailwind({
          ...config,
          important: '#tailwind',
          purge: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
        }),
      ])
        .process(input, { from: inputPath })
        .then(result => {
          assertPurged(result)
        })
    })
  )
})

test('mode must be a valid value', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return expect(
        postcss([
          tailwind({
            ...config,
            purge: {
              mode: 'poop',
              content: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
            },
          }),
        ]).process(input, { from: inputPath })
      ).rejects.toThrow()
    })
  )
})

test('components are purged by default in layers mode', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return postcss([
        tailwind({
          ...config,
          future: {
            purgeLayersByDefault: true,
          },
          purge: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
        }),
      ])
        .process(input, { from: inputPath })
        .then(result => {
          expect(result.css).not.toContain('.container')
          assertPurged(result)
        })
    })
  )
})

test('you can specify which layers to purge', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return postcss([
        tailwind({
          ...config,
          future: {
            purgeLayersByDefault: true,
          },
          purge: {
            mode: 'layers',
            layers: ['utilities'],
            content: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
          },
        }),
      ])
        .process(input, { from: inputPath })
        .then(result => {
          const rules = extractRules(result.root)
          expect(rules).toContain('optgroup')
          expect(rules).toContain('.container')
          assertPurged(result)
        })
    })
  )
})

test('you can purge just base and component layers (but why)', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return postcss([
        tailwind({
          ...config,
          future: {
            purgeLayersByDefault: true,
          },
          purge: {
            mode: 'layers',
            layers: ['base', 'components'],
            content: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
          },
        }),
      ])
        .process(input, { from: inputPath })
        .then(result => {
          const rules = extractRules(result.root)
          expect(rules).not.toContain('[type="checkbox"]')
          expect(rules).not.toContain('.container')
          expect(rules).toContain('.float-left')
          expect(rules).toContain('.md\\:bg-red-500')
          expect(rules).toContain('.lg\\:appearance-none')
        })
    })
  )
})

test('does not purge components when mode is conservative', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return postcss([
        tailwind({
          ...config,
          purge: {
            mode: 'conservative',
            content: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
          },
        }),
      ])
        .process(input, { from: inputPath })
        .then(result => {
          expect(result.css).toContain('.container')
          assertPurged(result)
        })
    })
  )
})

test('extra purgecss control comments can be added manually', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const input = `
        @tailwind base;

        /* purgecss start ignore */
        .btn {
          background: red;
        }
        /* purgecss end ignore */

        @tailwind components;
        @tailwind utilities;
      `

      return postcss([
        tailwind({
          ...config,
          purge: {
            layers: ['utilities'],
            content: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
          },
        }),
      ])
        .process(input, { from: null })
        .then(result => {
          const rules = extractRules(result.root)

          expect(rules).toContain('.btn')
          expect(rules).toContain('.container')
          assertPurged(result)
        })
    })
  )
})

test(
  'does not purge except in production',
  suppressConsoleLogs(() => {
    const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
    const input = fs.readFileSync(inputPath, 'utf8')

    return postcss([
      tailwind({
        ...defaultConfig,
        purge: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
      }),
    ])
      .process(input, { from: inputPath })
      .then(result => {
        const expected = fs.readFileSync(
          path.resolve(`${__dirname}/fixtures/tailwind-output.css`),
          'utf8'
        )

        expect(result.css).toMatchCss(expected)
      })
  })
)

test('does not purge if the array is empty', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const OLD_NODE_ENV = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return postcss([
        tailwind({
          ...defaultConfig,
          purge: [],
        }),
      ])
        .process(input, { from: inputPath })
        .then(result => {
          process.env.NODE_ENV = OLD_NODE_ENV
          const expected = fs.readFileSync(
            path.resolve(`${__dirname}/fixtures/tailwind-output.css`),
            'utf8'
          )

          expect(result.css).toMatchCss(expected)
        })
    })
  )
})

test('does not purge if explicitly disabled', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return postcss([
        tailwind({
          ...defaultConfig,
          purge: { enabled: false },
        }),
      ])
        .process(input, { from: inputPath })
        .then(result => {
          const expected = fs.readFileSync(
            path.resolve(`${__dirname}/fixtures/tailwind-output.css`),
            'utf8'
          )

          expect(result.css).toMatchCss(expected)
        })
    })
  )
})

test('does not purge if purge is simply false', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return postcss([
        tailwind({
          ...defaultConfig,
          purge: false,
        }),
      ])
        .process(input, { from: inputPath })
        .then(result => {
          const expected = fs.readFileSync(
            path.resolve(`${__dirname}/fixtures/tailwind-output.css`),
            'utf8'
          )

          expect(result.css).toMatchCss(expected)
        })
    })
  )
})

test('purges outside of production if explicitly enabled', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return postcss([
        tailwind({
          ...config,
          purge: { enabled: true, content: [path.resolve(`${__dirname}/fixtures/**/*.html`)] },
        }),
      ])
        .process(input, { from: inputPath })
        .then(result => {
          assertPurged(result)
        })
    })
  )
})

test(
  'purgecss options can be provided',
  suppressConsoleLogs(() => {
    const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
    const input = fs.readFileSync(inputPath, 'utf8')

    return postcss([
      tailwind({
        ...config,
        purge: {
          enabled: true,
          options: {
            content: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
            whitelist: ['md:bg-green-500'],
          },
        },
      }),
    ])
      .process(input, { from: inputPath })
      .then(result => {
        expect(result.css).toContain('.md\\:bg-green-500')
        assertPurged(result)
      })
  })
)

test(
  'can purge all CSS, not just Tailwind classes',
  suppressConsoleLogs(() => {
    const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
    const input = fs.readFileSync(inputPath, 'utf8')

    return postcss([
      tailwind({
        ...config,
        purge: {
          enabled: true,
          mode: 'all',
          content: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
        },
      }),
      function(css) {
        // Remove any comments to avoid accidentally asserting against them
        // instead of against real CSS rules.
        css.walkComments(c => c.remove())
      },
    ])
      .process(input, { from: inputPath })
      .then(result => {
        expect(result.css).toContain('html')
        expect(result.css).toContain('body')
        expect(result.css).toContain('samp')
        expect(result.css).not.toContain('.example')
        expect(result.css).not.toContain('.sm\\:example')

        assertPurged(result)
      })
  })
)

test('the `conservative` mode can be set explicitly', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return postcss([
        tailwind({
          ...config,
          purge: {
            mode: 'conservative',
            content: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
          },
        }),
      ])
        .process(input, { from: inputPath })
        .then(result => {
          expect(result.css).not.toContain('.bg-red-600')
          expect(result.css).not.toContain('.w-1\\/3')
          expect(result.css).not.toContain('.flex')
          expect(result.css).not.toContain('.font-sans')
          expect(result.css).not.toContain('.text-right')
          expect(result.css).not.toContain('.px-4')
          expect(result.css).not.toContain('.h-full')

          expect(result.css).toContain('.bg-red-500')
          expect(result.css).toContain('.md\\:bg-blue-300')
          expect(result.css).toContain('.w-1\\/2')
          expect(result.css).toContain('.block')
          expect(result.css).toContain('.md\\:flow-root')
          expect(result.css).toContain('.h-screen')
          expect(result.css).toContain('.min-h-\\(screen-4\\)')
          expect(result.css).toContain('.bg-black\\!')
          expect(result.css).toContain('.font-\\%\\#\\$\\@')
          expect(result.css).toContain('.w-\\(1\\/2\\+8\\)')
          expect(result.css).toContain('.inline-grid')
          expect(result.css).toContain('.grid-cols-3')
          expect(result.css).toContain('.px-1\\.5')
          expect(result.css).toContain('.col-span-2')
          expect(result.css).toContain('.col-span-1')
          expect(result.css).toContain('.text-center')
        })
    })
  )
})

test('element selectors are preserved by default', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return postcss([
        tailwind({
          ...config,
          purge: {
            content: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
            mode: 'all',
          },
        }),
      ])
        .process(input, { from: inputPath })
        .then(result => {
          const rules = extractRules(result.root)
          ;[
            'a',
            'blockquote',
            'body',
            'code',
            'fieldset',
            'figure',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'hr',
            'html',
            'img',
            'kbd',
            'ol',
            'p',
            'pre',
            'strong',
            'sup',
            'table',
            'ul',
          ].forEach(e => expect(rules).toContain(e))

          assertPurged(result)
        })
    })
  )
})

test('preserving element selectors can be disabled', () => {
  return inProduction(
    suppressConsoleLogs(() => {
      const inputPath = path.resolve(`${__dirname}/fixtures/tailwind-input.css`)
      const input = fs.readFileSync(inputPath, 'utf8')

      return postcss([
        tailwind({
          ...config,
          purge: {
            content: [path.resolve(`${__dirname}/fixtures/**/*.html`)],
            mode: 'all',
            preserveHtmlElements: false,
          },
        }),
      ])
        .process(input, { from: inputPath })
        .then(result => {
          const rules = extractRules(result.root)

          ;[
            'blockquote',
            'code',
            'em',
            'fieldset',
            'figure',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'hr',
            'img',
            'kbd',
            'li',
            'ol',
            'pre',
            'strong',
            'sup',
            'table',
            'ul',
          ].forEach(e => expect(rules).not.toContain(e))

          assertPurged(result)
        })
    })
  )
})
