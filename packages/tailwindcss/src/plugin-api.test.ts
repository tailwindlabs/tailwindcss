import { describe, expect, test, vi } from 'vitest'
import { compile } from '.'
import plugin from './plugin'
import type { CssInJs, PluginAPI } from './plugin-api'
import { optimizeCss } from './test-utils/run'

const css = String.raw

describe('theme', async () => {
  test('plugin theme can contain objects', async ({ expect }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadPlugin: async () => {
        return plugin(
          function ({ addBase, theme }) {
            addBase({
              '@keyframes enter': theme('keyframes.enter'),
              '@keyframes exit': theme('keyframes.exit'),
            })
          },
          {
            theme: {
              extend: {
                keyframes: {
                  enter: {
                    from: {
                      opacity: 'var(--tw-enter-opacity, 1)',
                      transform:
                        'translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0))',
                    },
                  },
                  exit: {
                    to: {
                      opacity: 'var(--tw-exit-opacity, 1)',
                      transform:
                        'translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0))',
                    },
                  },
                },
              },
            },
          },
        )
      },
    })

    expect(compiler.build([])).toMatchInlineSnapshot(`
      "@layer base {
        @keyframes enter {
          from {
            opacity: var(--tw-enter-opacity, 1);
            transform: translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0));
          }
        }
        @keyframes exit {
          to {
            opacity: var(--tw-exit-opacity, 1);
            transform: translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0));
          }
        }
      }
      "
    `)
  })

  test('plugin theme can extend colors', async ({ expect }) => {
    let input = css`
      @theme reference {
        --color-red-500: #ef4444;
      }
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadPlugin: async () => {
        return plugin(
          function ({ matchUtilities, theme }) {
            matchUtilities(
              {
                scrollbar: (value) => ({ 'scrollbar-color': value }),
              },
              {
                values: theme('colors'),
              },
            )
          },
          {
            theme: {
              extend: {
                colors: {
                  'russet-700': '#7a4724',
                },
              },
            },
          },
        )
      },
    })

    expect(compiler.build(['scrollbar-red-500', 'scrollbar-russet-700'])).toMatchInlineSnapshot(`
      ".scrollbar-red-500 {
        scrollbar-color: var(--color-red-500, #ef4444);
      }
      .scrollbar-russet-700 {
        scrollbar-color: #7a4724;
      }
      "
    `)
  })

  test('plugin theme values can reference legacy theme keys that have been replaced with bare value support', async ({
    expect,
  }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadPlugin: async () => {
        return plugin(
          function ({ matchUtilities, theme }) {
            matchUtilities(
              {
                'animate-duration': (value) => ({ 'animation-duration': value }),
              },
              {
                values: theme('animationDuration'),
              },
            )
          },
          {
            theme: {
              extend: {
                animationDuration: ({ theme }: { theme: (path: string) => any }) => {
                  return {
                    ...theme('transitionDuration'),
                  }
                },
              },
            },
          },
        )
      },
    })

    expect(compiler.build(['animate-duration-316'])).toMatchInlineSnapshot(`
      ".animate-duration-316 {
        animation-duration: 316ms;
      }
      "
    `)
  })

  test('plugin theme values that support bare values are merged with other values for that theme key', async ({
    expect,
  }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadPlugin: async () => {
        return plugin(
          function ({ matchUtilities, theme }) {
            matchUtilities(
              {
                'animate-duration': (value) => ({ 'animation-duration': value }),
              },
              {
                values: theme('animationDuration'),
              },
            )
          },
          {
            theme: {
              extend: {
                transitionDuration: {
                  slow: '800ms',
                },

                animationDuration: ({ theme }: { theme: (path: string) => any }) => ({
                  ...theme('transitionDuration'),
                }),
              },
            },
          },
        )
      },
    })

    expect(compiler.build(['animate-duration-316', 'animate-duration-slow']))
      .toMatchInlineSnapshot(`
      ".animate-duration-316 {
        animation-duration: 316ms;
      }
      .animate-duration-slow {
        animation-duration: 800ms;
      }
      "
    `)
  })

  test('theme value functions are resolved correctly regardless of order', async ({ expect }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadPlugin: async () => {
        return plugin(
          function ({ matchUtilities, theme }) {
            matchUtilities(
              {
                'animate-delay': (value) => ({ 'animation-delay': value }),
              },
              {
                values: theme('animationDelay'),
              },
            )
          },
          {
            theme: {
              extend: {
                animationDuration: ({ theme }: { theme: (path: string) => any }) => ({
                  ...theme('transitionDuration'),
                }),

                animationDelay: ({ theme }: { theme: (path: string) => any }) => ({
                  ...theme('animationDuration'),
                }),

                transitionDuration: {
                  slow: '800ms',
                },
              },
            },
          },
        )
      },
    })

    expect(compiler.build(['animate-delay-316', 'animate-delay-slow'])).toMatchInlineSnapshot(`
      ".animate-delay-316 {
        animation-delay: 316ms;
      }
      .animate-delay-slow {
        animation-delay: 800ms;
      }
      "
    `)
  })

  test('plugins can override the default key', async ({ expect }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadPlugin: async () => {
        return plugin(
          function ({ matchUtilities, theme }) {
            matchUtilities(
              {
                'animate-duration': (value) => ({ 'animation-delay': value }),
              },
              {
                values: theme('transitionDuration'),
              },
            )
          },
          {
            theme: {
              extend: {
                transitionDuration: {
                  DEFAULT: '1500ms',
                },
              },
            },
          },
        )
      },
    })

    expect(compiler.build(['animate-duration'])).toMatchInlineSnapshot(`
      ".animate-duration {
        animation-delay: 1500ms;
      }
      "
    `)
  })

  test('plugins can read CSS theme keys using the old theme key notation', async ({ expect }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme reference {
        --animation: pulse 1s linear infinite;
        --animation-spin: spin 1s linear infinite;
      }
    `

    let compiler = await compile(input, {
      loadPlugin: async () => {
        return plugin(function ({ matchUtilities, theme }) {
          matchUtilities(
            {
              animation: (value) => ({ animation: value }),
            },
            {
              values: theme('animation'),
            },
          )

          matchUtilities(
            {
              animation2: (value) => ({ animation: value }),
            },
            {
              values: {
                DEFAULT: theme('animation.DEFAULT'),
                twist: theme('animation.spin'),
              },
            },
          )
        })
      },
    })

    expect(compiler.build(['animation-spin', 'animation', 'animation2', 'animation2-twist']))
      .toMatchInlineSnapshot(`
        ".animation {
          animation: var(--animation, pulse 1s linear infinite);
        }
        .animation-spin {
          animation: var(--animation-spin, spin 1s linear infinite);
        }
        .animation2 {
          animation: var(--animation, pulse 1s linear infinite);
        }
        .animation2-twist {
          animation: var(--animation-spin, spin 1s linear infinite);
        }
        "
      `)
  })

  test('CSS theme values are mreged with JS theme values', async ({ expect }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme reference {
        --animation: pulse 1s linear infinite;
        --animation-spin: spin 1s linear infinite;
      }
    `

    let compiler = await compile(input, {
      loadPlugin: async () => {
        return plugin(
          function ({ matchUtilities, theme }) {
            matchUtilities(
              {
                animation: (value) => ({ '--animation': value }),
              },
              {
                values: theme('animation'),
              },
            )
          },
          {
            theme: {
              extend: {
                animation: {
                  bounce: 'bounce 1s linear infinite',
                },
              },
            },
          },
        )
      },
    })

    expect(compiler.build(['animation', 'animation-spin', 'animation-bounce']))
      .toMatchInlineSnapshot(`
        ".animation {
          --animation: var(--animation, pulse 1s linear infinite);
        }
        .animation-bounce {
          --animation: bounce 1s linear infinite;
        }
        .animation-spin {
          --animation: var(--animation-spin, spin 1s linear infinite);
        }
        "
      `)
  })

  test('CSS theme defaults take precedence over JS theme defaults', async ({ expect }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme reference {
        --animation: pulse 1s linear infinite;
        --animation-spin: spin 1s linear infinite;
      }
    `

    let compiler = await compile(input, {
      loadPlugin: async () => {
        return plugin(
          function ({ matchUtilities, theme }) {
            matchUtilities(
              {
                animation: (value) => ({ '--animation': value }),
              },
              {
                values: theme('animation'),
              },
            )
          },
          {
            theme: {
              extend: {
                animation: {
                  DEFAULT: 'twist 1s linear infinite',
                },
              },
            },
          },
        )
      },
    })

    expect(compiler.build(['animation'])).toMatchInlineSnapshot(`
      ".animation {
        --animation: var(--animation, pulse 1s linear infinite);
      }
      "
    `)
  })

  test('CSS theme values take precedence even over non-object JS values', async ({ expect }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme reference {
        --animation-simple-spin: spin 1s linear infinite;
        --animation-simple-bounce: bounce 1s linear infinite;
      }
    `

    let fn = vi.fn()

    await compile(input, {
      loadPlugin: async () => {
        return plugin(
          function ({ theme }) {
            fn(theme('animation.simple'))
          },
          {
            theme: {
              extend: {
                animation: {
                  simple: 'simple 1s linear',
                },
              },
            },
          },
        )
      },
    })

    expect(fn).toHaveBeenCalledWith({
      spin: 'var(--animation-simple-spin, spin 1s linear infinite)',
      bounce: 'var(--animation-simple-bounce, bounce 1s linear infinite)',
    })
  })

  test('all necessary theme keys support bare values', async ({ expect }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let { build } = await compile(input, {
      loadPlugin: async () => {
        return plugin(function ({ matchUtilities, theme }) {
          function utility(name: string, themeKey: string) {
            matchUtilities(
              { [name]: (value) => ({ '--value': value }) },
              { values: theme(themeKey) },
            )
          }

          utility('my-aspect', 'aspectRatio')
          utility('my-backdrop-brightness', 'backdropBrightness')
          utility('my-backdrop-contrast', 'backdropContrast')
          utility('my-backdrop-grayscale', 'backdropGrayscale')
          utility('my-backdrop-hue-rotate', 'backdropHueRotate')
          utility('my-backdrop-invert', 'backdropInvert')
          utility('my-backdrop-opacity', 'backdropOpacity')
          utility('my-backdrop-saturate', 'backdropSaturate')
          utility('my-backdrop-sepia', 'backdropSepia')
          utility('my-border', 'border')
          utility('my-brightness', 'brightness')
          utility('my-columns', 'columns')
          utility('my-contrast', 'contrast')
          utility('my-divide-width', 'divideWidth')
          utility('my-flex-grow', 'flexGrow')
          utility('my-flex-shrink', 'flexShrink')
          utility('my-gradient-color-stop-positions', 'gradientColorStopPositions')
          utility('my-grayscale', 'grayscale')
          utility('my-grid-row-end', 'gridRowEnd')
          utility('my-grid-row-start', 'gridRowStart')
          utility('my-grid-template-columns', 'gridTemplateColumns')
          utility('my-grid-template-rows', 'gridTemplateRows')
          utility('my-hue-rotate', 'hueRotate')
          utility('my-invert', 'invert')
          utility('my-line-clamp', 'lineClamp')
          utility('my-opacity', 'opacity')
          utility('my-order', 'order')
          utility('my-outline-offset', 'outlineOffset')
          utility('my-outline-width', 'outlineWidth')
          utility('my-ring-offset-width', 'ringOffsetWidth')
          utility('my-ring-width', 'ringWidth')
          utility('my-rotate', 'rotate')
          utility('my-saturate', 'saturate')
          utility('my-scale', 'scale')
          utility('my-sepia', 'sepia')
          utility('my-skew', 'skew')
          utility('my-stroke-width', 'strokeWidth')
          utility('my-text-decoration-thickness', 'textDecorationThickness')
          utility('my-text-underline-offset', 'textUnderlineOffset')
          utility('my-transition-delay', 'transitionDelay')
          utility('my-transition-duration', 'transitionDuration')
          utility('my-z-index', 'zIndex')
        })
      },
    })

    let output = build([
      'my-aspect-2/5',
      'my-backdrop-brightness-1',
      'my-backdrop-contrast-1',
      'my-backdrop-grayscale-1',
      'my-backdrop-hue-rotate-1',
      'my-backdrop-invert-1',
      'my-backdrop-opacity-1',
      'my-backdrop-saturate-1',
      'my-backdrop-sepia-1',
      'my-border-1',
      'my-brightness-1',
      'my-columns-1',
      'my-contrast-1',
      'my-divide-width-1',
      'my-flex-grow-1',
      'my-flex-shrink-1',
      'my-gradient-color-stop-positions-1',
      'my-grayscale-1',
      'my-grid-row-end-1',
      'my-grid-row-start-1',
      'my-grid-template-columns-1',
      'my-grid-template-rows-1',
      'my-hue-rotate-1',
      'my-invert-1',
      'my-line-clamp-1',
      'my-opacity-1',
      'my-order-1',
      'my-outline-offset-1',
      'my-outline-width-1',
      'my-ring-offset-width-1',
      'my-ring-width-1',
      'my-rotate-1',
      'my-saturate-1',
      'my-scale-1',
      'my-sepia-1',
      'my-skew-1',
      'my-stroke-width-1',
      'my-text-decoration-thickness-1',
      'my-text-underline-offset-1',
      'my-transition-delay-1',
      'my-transition-duration-1',
      'my-z-index-1',
    ])

    expect(output).toMatchInlineSnapshot(`
      ".my-aspect-2\\/5 {
        --value: 2/5;
      }
      .my-backdrop-brightness-1 {
        --value: 1%;
      }
      .my-backdrop-contrast-1 {
        --value: 1%;
      }
      .my-backdrop-grayscale-1 {
        --value: 1%;
      }
      .my-backdrop-hue-rotate-1 {
        --value: 1deg;
      }
      .my-backdrop-invert-1 {
        --value: 1%;
      }
      .my-backdrop-opacity-1 {
        --value: 1%;
      }
      .my-backdrop-saturate-1 {
        --value: 1%;
      }
      .my-backdrop-sepia-1 {
        --value: 1%;
      }
      .my-border-1 {
        --value: 1px;
      }
      .my-brightness-1 {
        --value: 1%;
      }
      .my-columns-1 {
        --value: 1;
      }
      .my-contrast-1 {
        --value: 1%;
      }
      .my-divide-width-1 {
        --value: 1px;
      }
      .my-flex-grow-1 {
        --value: 1;
      }
      .my-flex-shrink-1 {
        --value: 1;
      }
      .my-gradient-color-stop-positions-1 {
        --value: 1%;
      }
      .my-grayscale-1 {
        --value: 1%;
      }
      .my-grid-row-end-1 {
        --value: 1;
      }
      .my-grid-row-start-1 {
        --value: 1;
      }
      .my-grid-template-columns-1 {
        --value: repeat(1, minmax(0, 1fr));
      }
      .my-grid-template-rows-1 {
        --value: repeat(1, minmax(0, 1fr));
      }
      .my-hue-rotate-1 {
        --value: 1deg;
      }
      .my-invert-1 {
        --value: 1%;
      }
      .my-line-clamp-1 {
        --value: 1;
      }
      .my-opacity-1 {
        --value: 1%;
      }
      .my-order-1 {
        --value: 1;
      }
      .my-outline-offset-1 {
        --value: 1px;
      }
      .my-outline-width-1 {
        --value: 1px;
      }
      .my-ring-offset-width-1 {
        --value: 1px;
      }
      .my-ring-width-1 {
        --value: 1px;
      }
      .my-rotate-1 {
        --value: 1deg;
      }
      .my-saturate-1 {
        --value: 1%;
      }
      .my-scale-1 {
        --value: 1%;
      }
      .my-sepia-1 {
        --value: 1%;
      }
      .my-skew-1 {
        --value: 1deg;
      }
      .my-stroke-width-1 {
        --value: 1px;
      }
      .my-text-decoration-thickness-1 {
        --value: 1px;
      }
      .my-text-underline-offset-1 {
        --value: 1px;
      }
      .my-transition-delay-1 {
        --value: 1ms;
      }
      .my-transition-duration-1 {
        --value: 1ms;
      }
      .my-z-index-1 {
        --value: 1;
      }
      "
    `)
  })

  test('theme keys can derive from other theme keys', async ({ expect }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme {
        --color-primary: red;
        --color-secondary: blue;
      }
    `

    let fn = vi.fn()

    await compile(input, {
      loadPlugin: async () => {
        return plugin(
          ({ theme }) => {
            // The compatability config specifies that `accentColor` spreads in `colors`
            fn(theme('accentColor.primary'))

            // This should even work for theme keys specified in plugin configs
            fn(theme('myAccentColor.secondary'))
          },
          {
            theme: {
              extend: {
                myAccentColor: ({ theme }) => theme('accentColor'),
              },
            },
          },
        )
      },
    })

    expect(fn).toHaveBeenCalledWith('var(--color-primary, red)')
    expect(fn).toHaveBeenCalledWith('var(--color-secondary, blue)')
  })

  test('nested theme key lookups work even for flattened keys', async ({ expect }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme {
        --color-red-100: red;
        --color-red-200: orangered;
        --color-red-300: darkred;
      }
    `

    let fn = vi.fn()

    await compile(input, {
      loadPlugin: async () => {
        return plugin(({ theme }) => {
          fn(theme('color.red.100'))
          fn(theme('colors.red.200'))
          fn(theme('backgroundColor.red.300'))
        })
      },
    })

    expect(fn).toHaveBeenCalledWith('var(--color-red-100, red)')
    expect(fn).toHaveBeenCalledWith('var(--color-red-200, orangered)')
    expect(fn).toHaveBeenCalledWith('var(--color-red-300, darkred)')
  })

  test('keys that do not exist return the default value (or undefined if none)', async ({
    expect,
  }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let fn = vi.fn()

    await compile(input, {
      loadPlugin: async () => {
        return plugin(({ theme }) => {
          fn(theme('i.do.not.exist'))
          fn(theme('color'))
          fn(theme('color', 'magenta'))
          fn(theme('colors'))
        })
      },
    })

    expect(fn).toHaveBeenCalledWith(undefined) // Not present in CSS or resolved config
    expect(fn).toHaveBeenCalledWith(undefined) // Not present in CSS or resolved config
    expect(fn).toHaveBeenCalledWith('magenta') // Not present in CSS or resolved config
    expect(fn).toHaveBeenCalledWith({}) // Present in the resolved config
  })
})

describe('addUtilities()', () => {
  test('custom static utility', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }

        @theme reference {
          --breakpoint-lg: 1024px;
        }
      `,
      {
        async loadPlugin() {
          return ({ addUtilities }: PluginAPI) => {
            addUtilities({
              '.text-trim': {
                'text-box-trim': 'both',
                'text-box-edge': 'cap alphabetic',
              },
            })
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['text-trim', 'lg:text-trim'])).trim())
      .toMatchInlineSnapshot(`
      "@layer utilities {
        .text-trim {
          text-box-trim: both;
          text-box-edge: cap alphabetic;
        }

        @media (width >= 1024px) {
          .lg\\:text-trim {
            text-box-trim: both;
            text-box-edge: cap alphabetic;
          }
        }
      }"
    `)
  })

  test('define multiple utilities with array syntax', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;
      `,
      {
        async loadPlugin() {
          return ({ addUtilities }: PluginAPI) => {
            addUtilities([
              {
                '.text-trim': {
                  'text-box-trim': 'both',
                  'text-box-edge': 'cap alphabetic',
                },
              },
              {
                '.text-trim-2': {
                  'text-box-trim': 'both',
                  'text-box-edge': 'cap alphabetic',
                },
              },
            ])
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['text-trim', 'text-trim-2'])).trim()).toMatchInlineSnapshot(`
      ".text-trim, .text-trim-2 {
        text-box-trim: both;
        text-box-edge: cap alphabetic;
      }"
    `)
  })

  test('camel case properties are converted to kebab-case', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        async loadPlugin() {
          return ({ addUtilities }: PluginAPI) => {
            addUtilities({
              '.text-trim': {
                WebkitAppearance: 'none',
                textBoxTrim: 'both',
                textBoxEdge: 'cap alphabetic',
              },
            })
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['text-trim'])).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .text-trim {
          -webkit-appearance: none;
          text-box-trim: both;
          text-box-edge: cap alphabetic;
        }
      }"
    `)
  })

  test('custom static utilities support `@apply`', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }

        @theme reference {
          --breakpoint-lg: 1024px;
        }
      `,
      {
        async loadPlugin() {
          return ({ addUtilities }: PluginAPI) => {
            addUtilities({
              '.foo': {
                '@apply flex dark:underline': {},
              },
            })
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['foo', 'lg:foo'])).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .foo {
          display: flex;
        }

        @media (prefers-color-scheme: dark) {
          .foo {
            text-decoration-line: underline;
          }
        }

        @media (width >= 1024px) {
          .lg\\:foo {
            display: flex;
          }

          @media (prefers-color-scheme: dark) {
            .lg\\:foo {
              text-decoration-line: underline;
            }
          }
        }
      }"
    `)
  })

  test('throws on custom static utilities with an invalid name', async () => {
    await expect(() => {
      return compile(
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,
        {
          async loadPlugin() {
            return ({ addUtilities }: PluginAPI) => {
              addUtilities({
                '.text-trim > *': {
                  'text-box-trim': 'both',
                  'text-box-edge': 'cap alphabetic',
                },
              })
            }
          },
        },
      )
    }).rejects.toThrowError(/invalid utility selector/)
  })

  test('supports multiple selector names', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;

        @theme reference {
          --breakpoint-lg: 1024px;
        }
      `,
      {
        async loadPlugin() {
          return ({ addUtilities }: PluginAPI) => {
            addUtilities({
              '.form-input, .form-textarea': {
                appearance: 'none',
                'background-color': '#fff',
              },
            })
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['form-input', 'lg:form-textarea'])).trim())
      .toMatchInlineSnapshot(`
        ".form-input {
          appearance: none;
          background-color: #fff;
        }

        @media (width >= 1024px) {
          .lg\\:form-textarea {
            appearance: none;
            background-color: #fff;
          }
        }"
      `)
  })

  test('supports pseudo classes and pseudo elements', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;

        @theme reference {
          --breakpoint-lg: 1024px;
        }
      `,
      {
        async loadPlugin() {
          return ({ addUtilities }: PluginAPI) => {
            addUtilities({
              '.form-input, .form-input::placeholder, .form-textarea:hover:focus': {
                'background-color': 'red',
              },
            })
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['form-input', 'lg:form-textarea'])).trim())
      .toMatchInlineSnapshot(`
        ".form-input {
          background-color: red;
        }

        .form-input::placeholder {
          background-color: red;
        }

        @media (width >= 1024px) {
          .lg\\:form-textarea:hover:focus {
            background-color: red;
          }
        }"
      `)
  })
})

describe('matchUtilities()', () => {
  test('custom functional utility', async () => {
    async function run(candidates: string[]) {
      let compiled = await compile(
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,
        {
          async loadPlugin() {
            return ({ matchUtilities }: PluginAPI) => {
              matchUtilities(
                {
                  'border-block': (value) => ({ 'border-block-width': value }),
                },
                {
                  values: {
                    DEFAULT: '1px',
                    '2': '2px',
                  },
                },
              )
            }
          },
        },
      )

      return compiled.build(candidates)
    }

    expect(
      optimizeCss(
        await run([
          'border-block',
          'border-block-2',
          'border-block-[35px]',
          'border-block-[var(--foo)]',
          'lg:border-block-2',
        ]),
      ).trim(),
    ).toMatchInlineSnapshot(`
      ".border-block {
        border-block-width: 1px;
      }

      .border-block-2 {
        border-block-width: 2px;
      }

      .border-block-\\[35px\\] {
        border-block-width: 35px;
      }

      .border-block-\\[var\\(--foo\\)\\] {
        border-block-width: var(--foo);
      }

      @media (width >= 1024px) {
        .lg\\:border-block-2 {
          border-block-width: 2px;
        }
      }"
    `)

    expect(
      optimizeCss(
        await run([
          '-border-block',
          '-border-block-2',
          'lg:-border-block-2',
          'border-block-unknown',
          'border-block/1',
        ]),
      ).trim(),
    ).toEqual('')
  })

  test('custom functional utilities can return an array of rules', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;
      `,
      {
        async loadPlugin() {
          return ({ matchUtilities }: PluginAPI) => {
            matchUtilities(
              {
                'all-but-order-bottom-left-radius': (value) =>
                  [
                    { 'border-top-left-radius': value },
                    { 'border-top-right-radius': value },
                    { 'border-bottom-right-radius': value },
                  ] as CssInJs[],
              },
              {
                values: {
                  DEFAULT: '1px',
                },
              },
            )
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['all-but-order-bottom-left-radius'])).trim())
      .toMatchInlineSnapshot(`
        ".all-but-order-bottom-left-radius {
          border-top-left-radius: 1px;
          border-top-right-radius: 1px;
          border-bottom-right-radius: 1px;
        }"
      `)
  })

  test('custom functional utility with any modifier', async () => {
    async function run(candidates: string[]) {
      let compiled = await compile(
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,
        {
          async loadPlugin() {
            return ({ matchUtilities }: PluginAPI) => {
              matchUtilities(
                {
                  'border-block': (value, { modifier }) => ({
                    '--my-modifier': modifier ?? 'none',
                    'border-block-width': value,
                  }),
                },
                {
                  values: {
                    DEFAULT: '1px',
                    '2': '2px',
                  },

                  modifiers: 'any',
                },
              )
            }
          },
        },
      )

      return compiled.build(candidates)
    }

    expect(
      optimizeCss(
        await run(['border-block', 'border-block-2', 'border-block/foo', 'border-block-2/foo']),
      ).trim(),
    ).toMatchInlineSnapshot(`
      ".border-block {
        --my-modifier: none;
        border-block-width: 1px;
      }

      .border-block-2 {
        --my-modifier: none;
        border-block-width: 2px;
      }

      .border-block-2\\/foo {
        --my-modifier: foo;
        border-block-width: 2px;
      }

      .border-block\\/foo {
        --my-modifier: foo;
        border-block-width: 1px;
      }"
    `)
  })

  test('custom functional utility with known modifier', async () => {
    async function run(candidates: string[]) {
      let compiled = await compile(
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,
        {
          async loadPlugin() {
            return ({ matchUtilities }: PluginAPI) => {
              matchUtilities(
                {
                  'border-block': (value, { modifier }) => ({
                    '--my-modifier': modifier ?? 'none',
                    'border-block-width': value,
                  }),
                },
                {
                  values: {
                    DEFAULT: '1px',
                    '2': '2px',
                  },

                  modifiers: {
                    foo: 'foo',
                  },
                },
              )
            }
          },
        },
      )

      return compiled.build(candidates)
    }

    expect(
      optimizeCss(
        await run(['border-block', 'border-block-2', 'border-block/foo', 'border-block-2/foo']),
      ).trim(),
    ).toMatchInlineSnapshot(`
      ".border-block {
        --my-modifier: none;
        border-block-width: 1px;
      }

      .border-block-2 {
        --my-modifier: none;
        border-block-width: 2px;
      }

      .border-block-2\\/foo {
        --my-modifier: foo;
        border-block-width: 2px;
      }

      .border-block\\/foo {
        --my-modifier: foo;
        border-block-width: 1px;
      }"
    `)

    expect(
      optimizeCss(await run(['border-block/unknown', 'border-block-2/unknown'])).trim(),
    ).toEqual('')
  })

  // We're not married to this behavior — if there's a good reason to do this differently in the
  // future don't be afraid to change what should happen in this scenario.
  describe('plugins that handle a specific arbitrary value type prevent falling through to other plugins if the result is invalid for that plugin', () => {
    test('implicit color modifier', async () => {
      async function run(candidates: string[]) {
        let compiled = await compile(
          css`
            @tailwind utilities;
            @plugin "my-plugin";
          `,
          {
            async loadPlugin() {
              return ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  {
                    scrollbar: (value) => ({ 'scrollbar-color': value }),
                  },
                  { type: ['color', 'any'] },
                )

                matchUtilities(
                  {
                    scrollbar: (value) => ({ 'scrollbar-width': value }),
                  },
                  { type: ['length'] },
                )
              }
            },
          },
        )

        return compiled.build(candidates)
      }

      expect(
        optimizeCss(
          await run(['scrollbar-[2px]', 'scrollbar-[#08c]', 'scrollbar-[#08c]/50']),
        ).trim(),
      ).toMatchInlineSnapshot(`
        ".scrollbar-\\[\\#08c\\] {
          scrollbar-color: #08c;
        }

        .scrollbar-\\[\\#08c\\]\\/50 {
          scrollbar-color: #0088cc80;
        }

        .scrollbar-\\[2px\\] {
          scrollbar-width: 2px;
        }"
      `)
      expect(optimizeCss(await run(['scrollbar-[2px]/50'])).trim()).toEqual('')
    })

    test('no modifiers are supported by the plugins', async () => {
      async function run(candidates: string[]) {
        let compiled = await compile(
          css`
            @tailwind utilities;
            @plugin "my-plugin";
          `,
          {
            async loadPlugin() {
              return ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  {
                    scrollbar: (value) => ({ '--scrollbar-angle': value }),
                  },
                  { type: ['angle', 'any'] },
                )

                matchUtilities(
                  {
                    scrollbar: (value) => ({ '--scrollbar-width': value }),
                  },
                  { type: ['length'] },
                )
              }
            },
          },
        )

        return compiled.build(candidates)
      }

      expect(optimizeCss(await run(['scrollbar-[2px]/50'])).trim()).toEqual('')
    })

    test('invalid named modifier', async () => {
      async function run(candidates: string[]) {
        let compiled = await compile(
          css`
            @tailwind utilities;
            @plugin "my-plugin";
          `,
          {
            async loadPlugin() {
              return ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  {
                    scrollbar: (value) => ({ 'scrollbar-color': value }),
                  },
                  { type: ['color', 'any'], modifiers: { foo: 'foo' } },
                )

                matchUtilities(
                  {
                    scrollbar: (value) => ({ 'scrollbar-width': value }),
                  },
                  { type: ['length'], modifiers: { bar: 'bar' } },
                )
              }
            },
          },
        )

        return compiled.build(candidates)
      }

      expect(optimizeCss(await run(['scrollbar-[2px]/foo'])).trim()).toEqual('')
    })
  })

  test('custom functional utilities with different types', async () => {
    async function run(candidates: string[]) {
      let compiled = await compile(
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,
        {
          async loadPlugin() {
            return ({ matchUtilities }: PluginAPI) => {
              matchUtilities(
                {
                  scrollbar: (value) => ({ 'scrollbar-color': value }),
                },
                {
                  type: ['color', 'any'],
                  values: {
                    black: 'black',
                  },
                },
              )

              matchUtilities(
                {
                  scrollbar: (value) => ({ 'scrollbar-width': value }),
                },
                {
                  type: ['length'],
                  values: {
                    2: '2px',
                  },
                },
              )
            }
          },
        },
      )

      return compiled.build(candidates)
    }

    expect(
      optimizeCss(
        await run([
          'scrollbar-black',
          'scrollbar-black/50',
          'scrollbar-2',
          'scrollbar-[#fff]',
          'scrollbar-[#fff]/50',
          'scrollbar-[2px]',
          'scrollbar-[var(--my-color)]',
          'scrollbar-[var(--my-color)]/50',
          'scrollbar-[color:var(--my-color)]',
          'scrollbar-[color:var(--my-color)]/50',
          'scrollbar-[length:var(--my-width)]',
        ]),
      ).trim(),
    ).toMatchInlineSnapshot(`
      ".scrollbar-2 {
        scrollbar-width: 2px;
      }

      .scrollbar-\\[\\#fff\\] {
        scrollbar-color: #fff;
      }

      .scrollbar-\\[\\#fff\\]\\/50 {
        scrollbar-color: #ffffff80;
      }

      .scrollbar-\\[2px\\] {
        scrollbar-width: 2px;
      }

      .scrollbar-\\[color\\:var\\(--my-color\\)\\] {
        scrollbar-color: var(--my-color);
      }

      .scrollbar-\\[color\\:var\\(--my-color\\)\\]\\/50 {
        scrollbar-color: color-mix(in srgb, var(--my-color) 50%, transparent);
      }

      .scrollbar-\\[length\\:var\\(--my-width\\)\\] {
        scrollbar-width: var(--my-width);
      }

      .scrollbar-\\[var\\(--my-color\\)\\] {
        scrollbar-color: var(--my-color);
      }

      .scrollbar-\\[var\\(--my-color\\)\\]\\/50 {
        scrollbar-color: color-mix(in srgb, var(--my-color) 50%, transparent);
      }

      .scrollbar-black {
        scrollbar-color: black;
      }

      .scrollbar-black\\/50 {
        scrollbar-color: #00000080;
      }"
    `)

    expect(
      optimizeCss(
        await run([
          'scrollbar-2/50',
          'scrollbar-[2px]/50',
          'scrollbar-[length:var(--my-width)]/50',
        ]),
      ).trim(),
    ).toEqual('')
  })

  test('functional utilities with `type: color` automatically support opacity', async () => {
    async function run(candidates: string[]) {
      let compiled = await compile(
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,
        {
          async loadPlugin() {
            return ({ matchUtilities }: PluginAPI) => {
              matchUtilities(
                {
                  scrollbar: (value) => ({ 'scrollbar-color': value }),
                },
                {
                  type: ['color', 'any'],
                  values: {
                    black: 'black',
                  },
                },
              )
            }
          },
        },
      )

      return compiled.build(candidates)
    }

    expect(
      optimizeCss(
        await run([
          'scrollbar-current',
          'scrollbar-current/45',
          'scrollbar-black',
          'scrollbar-black/33',
          'scrollbar-black/[50%]',
          'scrollbar-[var(--my-color)]/[25%]',
        ]),
      ).trim(),
    ).toMatchInlineSnapshot(`
      ".scrollbar-\\[var\\(--my-color\\)\\]\\/\\[25\\%\\] {
        scrollbar-color: color-mix(in srgb, var(--my-color) 25%, transparent);
      }

      .scrollbar-black {
        scrollbar-color: black;
      }

      .scrollbar-black\\/33 {
        scrollbar-color: #00000054;
      }

      .scrollbar-black\\/\\[50\\%\\] {
        scrollbar-color: #00000080;
      }

      .scrollbar-current {
        scrollbar-color: currentColor;
      }

      .scrollbar-current\\/45 {
        scrollbar-color: color-mix(in srgb, currentColor 45%, transparent);
      }"
    `)
  })

  test('functional utilities with explicit modifiers', async () => {
    async function run(candidates: string[]) {
      let compiled = await compile(
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
            --opacity-my-opacity: 0.5;
          }
        `,
        {
          async loadPlugin() {
            return ({ matchUtilities }: PluginAPI) => {
              matchUtilities(
                {
                  scrollbar: (value, { modifier }) => ({
                    '--modifier': modifier ?? 'none',
                    'scrollbar-width': value,
                  }),
                },
                {
                  type: ['any'],
                  values: {},
                  modifiers: {
                    foo: 'foo',
                  },
                },
              )
            }
          },
        },
      )

      return compiled.build(candidates)
    }

    expect(
      optimizeCss(
        await run(['scrollbar-[12px]', 'scrollbar-[12px]/foo', 'scrollbar-[12px]/bar']),
      ).trim(),
    ).toMatchInlineSnapshot(`
      ".scrollbar-\\[12px\\] {
        --modifier: none;
        scrollbar-width: 12px;
      }

      .scrollbar-\\[12px\\]\\/foo {
        --modifier: foo;
        scrollbar-width: 12px;
      }"
    `)
  })

  test('functional utilities support `@apply`', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }

        @theme reference {
          --breakpoint-lg: 1024px;
        }
      `,
      {
        async loadPlugin() {
          return ({ matchUtilities }: PluginAPI) => {
            matchUtilities(
              {
                foo: (value) => ({
                  '--foo': value,
                  [`@apply flex`]: {},
                }),
              },
              {
                values: {
                  bar: 'bar',
                },
              },
            )
          }
        },
      },
    )

    expect(
      optimizeCss(compiled.build(['foo-bar', 'lg:foo-bar', 'foo-[12px]', 'lg:foo-[12px]'])).trim(),
    ).toMatchInlineSnapshot(`
      "@layer utilities {
        .foo-\\[12px\\] {
          --foo: 12px;
          display: flex;
        }

        .foo-bar {
          --foo: bar;
          display: flex;
        }

        @media (width >= 1024px) {
          .lg\\:foo-\\[12px\\] {
            --foo: 12px;
            display: flex;
          }
        }

        @media (width >= 1024px) {
          .lg\\:foo-bar {
            --foo: bar;
            display: flex;
          }
        }
      }"
    `)
  })

  test('throws on custom utilities with an invalid name', async () => {
    await expect(() => {
      return compile(
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,
        {
          async loadPlugin() {
            return ({ matchUtilities }: PluginAPI) => {
              matchUtilities({
                '.text-trim > *': () => ({
                  'text-box-trim': 'both',
                  'text-box-edge': 'cap alphabetic',
                }),
              })
            }
          },
        },
      )
    }).rejects.toThrowError(/invalid utility name/)
  })
})

describe('addComponents()', () => {
  test('is an alias for addUtilities', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;
      `,
      {
        async loadPlugin() {
          return ({ addComponents }: PluginAPI) => {
            addComponents({
              '.btn': {
                padding: '.5rem 1rem',
                borderRadius: '.25rem',
                fontWeight: '600',
              },
              '.btn-blue': {
                backgroundColor: '#3490dc',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#2779bd',
                },
              },
              '.btn-red': {
                backgroundColor: '#e3342f',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#cc1f1a',
                },
              },
            })
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['btn', 'btn-blue', 'btn-red'])).trim())
      .toMatchInlineSnapshot(`
      ".btn {
        border-radius: .25rem;
        padding: .5rem 1rem;
        font-weight: 600;
      }

      .btn-blue {
        color: #fff;
        background-color: #3490dc;
      }

      .btn-blue:hover {
        background-color: #2779bd;
      }

      .btn-red {
        color: #fff;
        background-color: #e3342f;
      }

      .btn-red:hover {
        background-color: #cc1f1a;
      }"
    `)
  })
})

describe('prefix()', () => {
  test('is an identity function', async () => {
    let fn = vi.fn()
    await compile(
      css`
        @plugin "my-plugin";
      `,
      {
        async loadPlugin() {
          return ({ prefix }: PluginAPI) => {
            fn(prefix('btn'))
          }
        },
      },
    )

    expect(fn).toHaveBeenCalledWith('btn')
  })
})
