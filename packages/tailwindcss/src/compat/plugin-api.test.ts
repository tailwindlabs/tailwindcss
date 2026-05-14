import { describe, expect, test, vi } from 'vitest'
import { compile } from '..'
import plugin from '../plugin'
import { compileCss, run } from '../test-utils/run'
import defaultTheme from './default-theme'
import type { CssInJs, PluginAPI } from './plugin-api'

const css = String.raw

describe('theme', async () => {
  test('plugin theme can contain objects', async () => {
    expect(
      await compileCss(
        css`
          @tailwind utilities;
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(
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
              ),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer base {
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

  test('keyframes added via addUtilities are appended to the AST', async () => {
    expect(
      await compileCss(
        css`
          @tailwind utilities;
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(function ({ addUtilities }) {
                addUtilities({
                  '@keyframes enter': { from: { opacity: 'var(--tw-enter-opacity, 1)' } },
                })
              }),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @keyframes enter {
        from {
          opacity: var(--tw-enter-opacity, 1);
        }
      }
      "
    `)
  })

  test('plugin theme can extend colors', async () => {
    expect(
      await run(
        ['scrollbar-red-500', 'scrollbar-russet-700'],
        css`
          @theme reference {
            --color-red-500: #ef4444;
          }
          @tailwind utilities;
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(
                function ({ matchUtilities, theme }) {
                  matchUtilities(
                    { scrollbar: (value) => ({ 'scrollbar-color': value }) },
                    { values: theme('colors') },
                  )
                },
                { theme: { extend: { colors: { 'russet-700': '#7a4724' } } } },
              ),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .scrollbar-red-500 {
        scrollbar-color: #ef4444;
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
    expect(
      await run(
        ['animate-duration-316'],
        css`
          @tailwind utilities;
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(
                function ({ matchUtilities, theme }) {
                  matchUtilities(
                    { 'animate-duration': (value) => ({ 'animation-duration': value }) },
                    { values: theme('animationDuration') },
                  )
                },
                {
                  theme: {
                    extend: {
                      animationDuration: ({ theme }: { theme: (path: string) => any }) => {
                        return { ...theme('transitionDuration') }
                      },
                    },
                  },
                },
              ),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .animate-duration-316 {
        animation-duration: .316s;
      }
      "
    `)
  })

  test('plugin theme values that support bare values are merged with other values for that theme key', async ({
    expect,
  }) => {
    expect(
      await run(
        ['animate-duration-316', 'animate-duration-slow'],
        css`
          @tailwind utilities;
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(
                function ({ matchUtilities, theme }) {
                  matchUtilities(
                    { 'animate-duration': (value) => ({ 'animation-duration': value }) },
                    { values: theme('animationDuration') },
                  )
                },
                {
                  theme: {
                    extend: {
                      transitionDuration: { slow: '800ms' },
                      animationDuration: ({ theme }: { theme: (path: string) => any }) => ({
                        ...theme('transitionDuration'),
                      }),
                    },
                  },
                },
              ),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .animate-duration-316 {
        animation-duration: .316s;
      }

      .animate-duration-slow {
        animation-duration: .8s;
      }
      "
    `)
  })

  test('plugin theme can have opacity modifiers', async () => {
    expect(
      await run(
        ['percentage', 'fraction', 'variable'],
        css`
          @tailwind utilities;
          @theme {
            --color-red-500: #ef4444;
          }
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(function ({ addUtilities, theme }) {
                addUtilities({
                  '.percentage': { color: theme('colors.red.500 / 50%') },
                  '.fraction': { color: theme('colors.red.500 / 0.5') },
                  '.variable': { color: theme('colors.red.500 / var(--opacity)') },
                })
              }),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .fraction, .percentage {
        color: oklab(63.6834% .187 .088 / .5);
      }

      .variable {
        color: #ef4444;
      }

      @supports (color: color-mix(in lab, red, red)) {
        .variable {
          color: color-mix(in oklab, #ef4444 var(--opacity), transparent);
        }
      }
      "
    `)
  })

  test('plugin theme colors can use <alpha-value>', async () => {
    expect(
      await run(
        [
          'bg-custom',
          'css-percentage',
          'css-fraction',
          'css-variable',
          'js-percentage',
          'js-fraction',
          'js-variable',
        ],
        css`
          @tailwind utilities;
          @theme {
            /* This should not work */
            --color-custom-css: rgba(255 0 0 / <alpha-value>);
          }
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(
                function ({ addUtilities, theme }) {
                  addUtilities({
                    '.css-percentage': { color: theme('colors.custom-css / 50%') },
                    '.css-fraction': { color: theme('colors.custom-css / 0.5') },
                    '.css-variable': { color: theme('colors.custom-css / var(--opacity)') },
                    '.js-percentage': { color: theme('colors.custom-js / 50%') },
                    '.js-fraction': { color: theme('colors.custom-js / 0.5') },
                    '.js-variable': { color: theme('colors.custom-js / var(--opacity)') },
                  })
                },
                {
                  theme: {
                    colors: {
                      /* This should work */
                      'custom-js': 'rgb(255 0 0 / <alpha-value>)',
                    },
                  },
                },
              ),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .css-fraction, .css-percentage {
        color: color-mix(in oklab, rgba(255 0 0 / <alpha-value>) 50%, transparent);
      }

      .css-variable {
        color: rgba(255 0 0 / <alpha-value>);
      }

      @supports (color: color-mix(in lab, red, red)) {
        .css-variable {
          color: color-mix(in oklab, rgba(255 0 0 / <alpha-value>) var(--opacity), transparent);
        }
      }

      .js-fraction, .js-percentage {
        color: oklab(62.7955% .224 .125 / .5);
      }

      .js-variable {
        color: red;
      }

      @supports (color: color-mix(in lab, red, red)) {
        .js-variable {
          color: color-mix(in oklab, red var(--opacity), transparent);
        }
      }
      "
    `)
  })

  test('theme value functions are resolved correctly regardless of order', async () => {
    expect(
      await run(
        ['animate-delay-316', 'animate-delay-slow'],
        css`
          @tailwind utilities;
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(
                function ({ matchUtilities, theme }) {
                  matchUtilities(
                    { 'animate-delay': (value) => ({ 'animation-delay': value }) },
                    { values: theme('animationDelay') },
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
                      transitionDuration: { slow: '800ms' },
                    },
                  },
                },
              ),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .animate-delay-316 {
        animation-delay: .316s;
      }

      .animate-delay-slow {
        animation-delay: .8s;
      }
      "
    `)
  })

  test('plugins can override the default key', async () => {
    expect(
      await run(
        ['animate-duration'],
        css`
          @tailwind utilities;
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(
                function ({ matchUtilities, theme }) {
                  matchUtilities(
                    { 'animate-duration': (value) => ({ 'animation-delay': value }) },
                    { values: theme('transitionDuration') },
                  )
                },
                { theme: { extend: { transitionDuration: { DEFAULT: '1500ms' } } } },
              ),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .animate-duration {
        animation-delay: 1.5s;
      }
      "
    `)
  })

  test('plugins can read CSS theme keys using the old theme key notation', async () => {
    expect(
      await run(
        ['animation-spin', 'animation', 'animation2', 'animation2-twist'],
        css`
          @tailwind utilities;
          @plugin "my-plugin";
          @theme reference {
            --animate: pulse 1s linear infinite;
            --animate-spin: spin 1s linear infinite;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(function ({ matchUtilities, theme }) {
                matchUtilities(
                  { animation: (value) => ({ animation: value }) },
                  { values: theme('animation') },
                )

                matchUtilities(
                  { animation2: (value) => ({ animation: value }) },
                  {
                    values: { DEFAULT: theme('animation.DEFAULT'), twist: theme('animation.spin') },
                  },
                )
              }),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .animation {
        animation: 1s linear infinite pulse;
      }

      .animation-spin {
        animation: 1s linear infinite spin;
      }

      .animation2 {
        animation: 1s linear infinite pulse;
      }

      .animation2-twist {
        animation: 1s linear infinite spin;
      }
      "
    `)
  })

  test('CSS theme values are merged with JS theme values', async () => {
    expect(
      await run(
        ['animation', 'animation-spin', 'animation-bounce'],
        css`
          @tailwind utilities;
          @plugin "my-plugin";
          @theme reference {
            --animate: pulse 1s linear infinite;
            --animate-spin: spin 1s linear infinite;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(
                function ({ matchUtilities, theme }) {
                  matchUtilities(
                    { animation: (value) => ({ '--animation': value }) },
                    { values: theme('animation') },
                  )
                },
                { theme: { extend: { animation: { bounce: 'bounce 1s linear infinite' } } } },
              ),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .animation {
        --animation: pulse 1s linear infinite;
      }

      .animation-bounce {
        --animation: bounce 1s linear infinite;
      }

      .animation-spin {
        --animation: spin 1s linear infinite;
      }
      "
    `)
  })

  test('CSS theme defaults take precedence over JS theme defaults', async () => {
    expect(
      await run(
        ['animation'],
        css`
          @tailwind utilities;
          @plugin "my-plugin";
          @theme reference {
            --animate: pulse 1s linear infinite;
            --animate-spin: spin 1s linear infinite;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(
                function ({ matchUtilities, theme }) {
                  matchUtilities(
                    { animation: (value) => ({ '--animation': value }) },
                    { values: theme('animation') },
                  )
                },
                { theme: { extend: { animation: { DEFAULT: 'twist 1s linear infinite' } } } },
              ),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .animation {
        --animation: pulse 1s linear infinite;
      }
      "
    `)
  })

  test('CSS theme values take precedence even over non-object JS values', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme reference {
        --animate-simple-spin: spin 1s linear infinite;
        --animate-simple-bounce: bounce 1s linear infinite;
      }
    `

    using fn = vi.fn()

    await compile(input, {
      loadModule: async (_id, base) => {
        return {
          path: '',
          base,
          module: plugin(
            function ({ theme }) {
              fn(theme('animation.simple'))
            },
            {
              theme: { extend: { animation: { simple: 'simple 1s linear' } } },
            },
          ),
        }
      },
    })

    expect(fn).toHaveBeenCalledWith({
      __CSS_VALUES__: { bounce: 2, spin: 2 },
      spin: 'spin 1s linear infinite',
      bounce: 'bounce 1s linear infinite',
    })
  })

  test('all necessary theme keys support bare values', async () => {
    expect(
      await run(
        [
          'my-aspect-2/5',
          'my-backdrop-brightness-1',
          'my-backdrop-contrast-1',
          'my-backdrop-grayscale-1',
          'my-backdrop-hue-rotate-1',
          'my-backdrop-invert-1',
          'my-backdrop-opacity-1',
          'my-backdrop-saturate-1',
          'my-backdrop-sepia-1',
          'my-border-width-1',
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
        ],
        css`
          @tailwind utilities;
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(function ({ matchUtilities, theme }) {
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
                utility('my-border-width', 'borderWidth')
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
              }),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .my-aspect-2\\/5 {
        --value: 2/5;
      }

      .my-backdrop-brightness-1, .my-backdrop-contrast-1, .my-backdrop-grayscale-1 {
        --value: 1%;
      }

      .my-backdrop-hue-rotate-1 {
        --value: 1deg;
      }

      .my-backdrop-invert-1, .my-backdrop-opacity-1, .my-backdrop-saturate-1, .my-backdrop-sepia-1 {
        --value: 1%;
      }

      .my-border-width-1 {
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

      .my-flex-grow-1, .my-flex-shrink-1 {
        --value: 1;
      }

      .my-gradient-color-stop-positions-1, .my-grayscale-1 {
        --value: 1%;
      }

      .my-grid-row-end-1, .my-grid-row-start-1 {
        --value: 1;
      }

      .my-grid-template-columns-1, .my-grid-template-rows-1 {
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

      .my-outline-offset-1, .my-outline-width-1, .my-ring-offset-width-1, .my-ring-width-1 {
        --value: 1px;
      }

      .my-rotate-1 {
        --value: 1deg;
      }

      .my-saturate-1, .my-scale-1, .my-sepia-1 {
        --value: 1%;
      }

      .my-skew-1 {
        --value: 1deg;
      }

      .my-stroke-width-1 {
        --value: 1;
      }

      .my-text-decoration-thickness-1, .my-text-underline-offset-1 {
        --value: 1px;
      }

      .my-transition-delay-1, .my-transition-duration-1 {
        --value: 1ms;
      }

      .my-z-index-1 {
        --value: 1;
      }
      "
    `)
  })

  test('theme keys can derive from other theme keys', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme {
        --color-primary: red;
        --color-secondary: blue;
      }
    `

    using fn = vi.fn()

    await compile(input, {
      loadModule: async (_id, base) => {
        return {
          path: '',
          base,
          module: plugin(
            ({ theme }) => {
              // The compatibility config specifies that `accentColor` spreads in `colors`
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
          ),
        }
      },
    })

    expect(fn).toHaveBeenCalledWith('red')
    expect(fn).toHaveBeenCalledWith('blue')
  })

  test("`theme('*.DEFAULT')` resolves to `undefined` when all theme keys in that namespace have a suffix", async ({
    expect,
  }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme {
        --ease-in: ease-in;
        --ease-out: ease-out;
      }
    `

    using fn = vi.fn()

    await compile(input, {
      loadModule: async (_id, base) => {
        return {
          path: '',
          base,
          module: plugin(({ theme }) => {
            fn(theme('transitionTimingFunction.DEFAULT'))
            fn(theme('transitionTimingFunction.in'))
            fn(theme('transitionTimingFunction.out'))
          }),
        }
      },
    })

    expect(fn).toHaveBeenNthCalledWith(1, undefined)
    expect(fn).toHaveBeenNthCalledWith(2, 'ease-in')
    expect(fn).toHaveBeenNthCalledWith(3, 'ease-out')
  })

  test('nested theme key lookups work even for flattened keys', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme {
        --color-red-100: red;
        --color-red-200: orangered;
        --color-red-300: darkred;
      }
    `

    using fn = vi.fn()

    await compile(input, {
      loadModule: async (_id, base) => {
        return {
          path: '',
          base,
          module: plugin(({ theme }) => {
            fn(theme('color.red.100'))
            fn(theme('colors.red.200'))
            fn(theme('backgroundColor.red.300'))
          }),
        }
      },
    })

    expect(fn).toHaveBeenCalledWith('red')
    expect(fn).toHaveBeenCalledWith('orangered')
    expect(fn).toHaveBeenCalledWith('darkred')
  })

  test('keys that do not exist return the default value (or undefined if none)', async ({
    expect,
  }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    using fn = vi.fn()

    await compile(input, {
      loadModule: async (_id, base) => {
        return {
          path: '',
          base,
          module: plugin(({ theme }) => {
            fn(theme('i.do.not.exist'))
            fn(theme('color'))
            fn(theme('color', 'magenta'))
            fn(theme('colors'))
          }),
        }
      },
    })

    expect(fn).toHaveBeenCalledWith(undefined) // Not present in CSS or resolved config
    expect(fn).toHaveBeenCalledWith(undefined) // Not present in CSS or resolved config
    expect(fn).toHaveBeenCalledWith('magenta') // Not present in CSS or resolved config
    expect(fn).toHaveBeenCalledWith({}) // Present in the resolved config
  })

  test('Candidates can match multiple utility definitions', async () => {
    expect(
      await run(
        ['foo-bar'],
        css`
          @tailwind utilities;
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(({ addUtilities, matchUtilities }) => {
                addUtilities({ '.foo-bar': { color: 'red' } })
                matchUtilities(
                  { foo: (value) => ({ '--my-prop': value }) },
                  { values: { bar: 'bar-valuer', baz: 'bar-valuer' } },
                )
                addUtilities({ '.foo-bar': { backgroundColor: 'red' } })
              }),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .foo-bar {
        color: red;
        --my-prop: bar-valuer;
        background-color: red;
      }
      "
    `)
  })

  test('spreading `tailwindcss/defaultTheme` exports keeps bare values', async () => {
    expect(
      await run(
        [
          'my-aspect-2/5',
          // 'my-backdrop-brightness-1',
          // 'my-backdrop-contrast-1',
          // 'my-backdrop-grayscale-1',
          // 'my-backdrop-hue-rotate-1',
          // 'my-backdrop-invert-1',
          // 'my-backdrop-opacity-1',
          // 'my-backdrop-saturate-1',
          // 'my-backdrop-sepia-1',
          // 'my-divide-width-1',
          'my-border-width-1',
          'my-brightness-1',
          'my-columns-1',
          'my-contrast-1',
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
        ],
        css`
          @tailwind utilities;
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(function ({ matchUtilities }) {
                function utility(name: string, themeKey: string) {
                  matchUtilities(
                    { [name]: (value) => ({ '--value': value }) },
                    // @ts-ignore
                    { values: defaultTheme[themeKey] },
                  )
                }

                utility('my-aspect', 'aspectRatio')
                // The following keys deliberately doesn't work as these are exported
                // as functions from the compat config.
                //
                // utility('my-backdrop-brightness', 'backdropBrightness')
                // utility('my-backdrop-contrast', 'backdropContrast')
                // utility('my-backdrop-grayscale', 'backdropGrayscale')
                // utility('my-backdrop-hue-rotate', 'backdropHueRotate')
                // utility('my-backdrop-invert', 'backdropInvert')
                // utility('my-backdrop-opacity', 'backdropOpacity')
                // utility('my-backdrop-saturate', 'backdropSaturate')
                // utility('my-backdrop-sepia', 'backdropSepia')
                // utility('my-divide-width', 'divideWidth')
                utility('my-border-width', 'borderWidth')
                utility('my-brightness', 'brightness')
                utility('my-columns', 'columns')
                utility('my-contrast', 'contrast')
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
              }),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .my-aspect-2\\/5 {
        --value: 2/5;
      }

      .my-border-width-1 {
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

      .my-flex-grow-1, .my-flex-shrink-1 {
        --value: 1;
      }

      .my-gradient-color-stop-positions-1, .my-grayscale-1 {
        --value: 1%;
      }

      .my-grid-row-end-1, .my-grid-row-start-1 {
        --value: 1;
      }

      .my-grid-template-columns-1, .my-grid-template-rows-1 {
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

      .my-outline-offset-1, .my-outline-width-1, .my-ring-offset-width-1, .my-ring-width-1 {
        --value: 1px;
      }

      .my-rotate-1 {
        --value: 1deg;
      }

      .my-saturate-1, .my-scale-1, .my-sepia-1 {
        --value: 1%;
      }

      .my-skew-1 {
        --value: 1deg;
      }

      .my-stroke-width-1 {
        --value: 1;
      }

      .my-text-decoration-thickness-1, .my-text-underline-offset-1 {
        --value: 1px;
      }

      .my-transition-delay-1, .my-transition-duration-1 {
        --value: 1ms;
      }

      .my-z-index-1 {
        --value: 1;
      }
      "
    `)
  })

  test('can use escaped JS variables in theme values', async () => {
    expect(
      await run(
        ['my-width-1', 'my-width-1/2', 'my-width-1.5'],
        css`
          @tailwind utilities;
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(
                function ({ matchUtilities, theme }) {
                  matchUtilities(
                    { 'my-width': (value) => ({ width: value }) },
                    { values: theme('width') },
                  )
                },
                {
                  theme: {
                    extend: {
                      width: {
                        '1': '0.25rem',
                        // Purposely setting to something different from the v3 default
                        '1/2': '60%',
                        '1.5': '0.375rem',
                      },
                    },
                  },
                },
              ),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .my-width-1 {
        width: .25rem;
      }

      .my-width-1\\.5 {
        width: .375rem;
      }

      .my-width-1\\/2 {
        width: 60%;
      }
      "
    `)
  })

  test('can use escaped CSS variables in theme values', async () => {
    expect(
      await run(
        ['my-width-1', 'my-width-1.5', 'my-width-1/2', 'my-width-2.5'],
        css`
          @tailwind utilities;
          @plugin "my-plugin";

          @theme {
            --width-1: 0.25rem;
            /* Purposely setting to something different from the v3 default */
            --width-1\/2: 60%;
            --width-1\.5: 0.375rem;
            --width-2_5: 0.625rem;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(function ({ matchUtilities, theme }) {
                matchUtilities(
                  { 'my-width': (value) => ({ width: value }) },
                  { values: theme('width') },
                )
              }),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .my-width-1 {
        width: .25rem;
      }

      .my-width-1\\.5 {
        width: .375rem;
      }

      .my-width-1\\/2 {
        width: 60%;
      }

      .my-width-2\\.5 {
        width: .625rem;
      }
      "
    `)
  })

  test('can use escaped CSS variables in referenced theme namespace', async () => {
    expect(
      await run(
        ['my-width-1', 'my-width-1.5', 'my-width-1/2', 'my-width-2.5'],
        css`
          @tailwind utilities;
          @plugin "my-plugin";

          @theme {
            --width-1: 0.25rem;
            /* Purposely setting to something different from the v3 default */
            --width-1\/2: 60%;
            --width-1\.5: 0.375rem;
            --width-2_5: 0.625rem;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(
                function ({ matchUtilities, theme }) {
                  matchUtilities(
                    { 'my-width': (value) => ({ width: value }) },
                    { values: theme('myWidth') },
                  )
                },
                {
                  theme: { myWidth: ({ theme }) => theme('width') },
                },
              ),
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .my-width-1 {
        width: .25rem;
      }

      .my-width-1\\.5 {
        width: .375rem;
      }

      .my-width-1\\/2 {
        width: 60%;
      }

      .my-width-2\\.5 {
        width: .625rem;
      }
      "
    `)
  })
})

describe('addBase', () => {
  test('does not create rules when imported via `@import "…" reference`', async () => {
    expect(
      await compileCss(
        css`
          @tailwind utilities;
          @plugin "outside";
          @import './inside.css' reference;
        `,
        {
          loadModule: async (_id, base) => {
            if (_id === 'inside') {
              return {
                path: '',
                base,
                module: plugin(function ({ addBase }) {
                  addBase({ inside: { color: 'red' } })
                }),
              }
            }
            return {
              path: '',
              base,
              module: plugin(function ({ addBase }) {
                addBase({ outside: { color: 'red' } })
              }),
            }
          },
          async loadStylesheet() {
            return {
              path: '',
              base: '',
              content: css`
                @plugin "inside";
              `,
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer base {
        outside {
          color: red;
        }
      }
      "
    `)
  })

  test('does not modify CSS variables', async () => {
    expect(
      await compileCss(
        css`
          @plugin "my-plugin";
        `,
        {
          loadModule: async () => ({
            path: '',
            base: '/root',
            module: plugin(function ({ addBase }) {
              addBase({ ':root': { '--PascalCase': '1', '--camelCase': '1', '--UPPERCASE': '1' } })
            }),
          }),
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer base {
        :root {
          --PascalCase: 1;
          --camelCase: 1;
          --UPPERCASE: 1;
        }
      }
      "
    `)
  })
})

describe('addVariant', () => {
  test('addVariant with string selector', async () => {
    expect(
      await run(
        ['hocus:underline', 'group-hocus:flex'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ addVariant }: PluginAPI) => {
                addVariant('hocus', '&:hover, &:focus')
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .group-hocus\\:flex:is(:is(:where(.group):hover, :where(.group):focus) *) {
          display: flex;
        }

        .hocus\\:underline:hover, .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }
      "
    `)
  })

  test('addVariant with array of selectors', async () => {
    expect(
      await run(
        ['hocus:underline', 'group-hocus:flex'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ addVariant }: PluginAPI) => {
                addVariant('hocus', ['&:hover', '&:focus'])
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .group-hocus\\:flex:is(:where(.group):hover *), .group-hocus\\:flex:is(:where(.group):focus *) {
          display: flex;
        }

        .hocus\\:underline:hover, .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }
      "
    `)
  })

  test('addVariant with object syntax and @slot', async () => {
    expect(
      await run(
        ['hocus:underline', 'group-hocus:flex'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ addVariant }: PluginAPI) => {
                addVariant('hocus', {
                  '&:hover': '@slot',
                  '&:focus': '@slot',
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .group-hocus\\:flex:is(:where(.group):hover *), .group-hocus\\:flex:is(:where(.group):focus *) {
          display: flex;
        }

        .hocus\\:underline:hover, .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }
      "
    `)
  })

  test('addVariant with object syntax, media, nesting and multiple @slot', async () => {
    expect(
      await run(
        ['hocus:underline', 'group-hocus:flex'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ addVariant }: PluginAPI) => {
                addVariant('hocus', {
                  '@media (hover: hover)': {
                    '&:hover': '@slot',
                  },
                  '&:focus': '@slot',
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        @media (hover: hover) {
          .group-hocus\\:flex:is(:where(.group):hover *) {
            display: flex;
          }
        }

        .group-hocus\\:flex:is(:where(.group):focus *) {
          display: flex;
        }

        @media (hover: hover) {
          .hocus\\:underline:hover {
            text-decoration-line: underline;
          }
        }

        .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }
      "
    `)
  })

  test('addVariant with at-rules and placeholder', async () => {
    expect(
      await run(
        ['potato:underline', 'potato:flex'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ addVariant }: PluginAPI) => {
                addVariant(
                  'potato',
                  '@media (max-width: 400px) { @supports (font:bold) { &:large-potato } }',
                )
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        @media (max-width: 400px) {
          @supports (font: bold) {
            .potato\\:flex:large-potato {
              display: flex;
            }

            .potato\\:underline:large-potato {
              text-decoration-line: underline;
            }
          }
        }
      }
      "
    `)
  })

  test('@slot is preserved when used as a custom property value', async () => {
    expect(
      await run(
        ['hocus:underline'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ addVariant }: PluginAPI) => {
                addVariant('hocus', {
                  '&': {
                    '--custom-property': '@slot',
                    '&:hover': '@slot',
                    '&:focus': '@slot',
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .hocus\\:underline {
          --custom-property: @slot;
        }

        .hocus\\:underline:hover, .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }
      "
    `)
  })

  test('ignores variants that use :merge(…) and ensures `peer-*` and `group-*` rules work out of the box', async () => {
    expect(
      await run(
        ['optional:flex', 'group-optional:flex', 'peer-optional:flex', 'group-optional/foo:flex'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ addVariant }: PluginAPI) => {
                addVariant('optional', '&:optional')
                addVariant('group-optional', { ':merge(.group):optional &': '@slot' })
                addVariant('peer-optional', { '&': { ':merge(.peer):optional ~ &': '@slot' } })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .group-optional\\:flex:is(:where(.group):optional *), .group-optional\\/foo\\:flex:is(:where(.group\\/foo):optional *), .peer-optional\\:flex:is(:where(.peer):optional ~ *), .optional\\:flex:optional {
          display: flex;
        }
      }
      "
    `)
  })
})

describe('matchVariant', () => {
  test('partial arbitrary variants', async () => {
    expect(
      await run(
        ['potato-[yellow]:underline', 'potato-[baked]:flex'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('potato', (flavor) => `.potato-${flavor} &`)
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .potato-baked .potato-\\[baked\\]\\:flex {
          display: flex;
        }

        .potato-yellow .potato-\\[yellow\\]\\:underline {
          text-decoration-line: underline;
        }
      }
      "
    `)
  })

  test('partial arbitrary variants with at-rules', async () => {
    expect(
      await run(
        ['potato-[yellow]:underline', 'potato-[baked]:flex'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('potato', (flavor) => `@media (potato: ${flavor})`)
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        @media (potato: baked) {
          .potato-\\[baked\\]\\:flex {
            display: flex;
          }
        }

        @media (potato: yellow) {
          .potato-\\[yellow\\]\\:underline {
            text-decoration-line: underline;
          }
        }
      }
      "
    `)
  })

  test('partial arbitrary variants with at-rules and placeholder', async () => {
    expect(
      await run(
        ['potato-[yellow]:underline', 'potato-[baked]:flex'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('potato', (flavor) => {
                  return `@media (potato: ${flavor}) { @supports (font:bold) { &:large-potato } }`
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        @media (potato: baked) {
          @supports (font: bold) {
            .potato-\\[baked\\]\\:flex:large-potato {
              display: flex;
            }
          }
        }

        @media (potato: yellow) {
          @supports (font: bold) {
            .potato-\\[yellow\\]\\:underline:large-potato {
              text-decoration-line: underline;
            }
          }
        }
      }
      "
    `)
  })

  test('partial arbitrary variants with default values', async () => {
    expect(
      await run(
        ['tooltip-bottom:underline', 'tooltip-top:flex'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('tooltip', (side) => `&${side}`, {
                  values: {
                    bottom: '[data-location="bottom"]',
                    top: '[data-location="top"]',
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .tooltip-bottom\\:underline[data-location="bottom"] {
          text-decoration-line: underline;
        }

        .tooltip-top\\:flex[data-location="top"] {
          display: flex;
        }
      }
      "
    `)
  })

  test('matched variant values maintain the sort order they are registered in', async () => {
    expect(
      await run(
        [
          'alphabet-c:underline',
          'alphabet-a:underline',
          'alphabet-d:underline',
          'alphabet-b:underline',
        ],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('alphabet', (side) => `&${side}`, {
                  values: {
                    d: '[data-order="1"]',
                    a: '[data-order="2"]',
                    c: '[data-order="3"]',
                    b: '[data-order="4"]',
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .alphabet-d\\:underline[data-order="1"], .alphabet-a\\:underline[data-order="2"], .alphabet-c\\:underline[data-order="3"], .alphabet-b\\:underline[data-order="4"] {
          text-decoration-line: underline;
        }
      }
      "
    `)
  })

  test('matchVariant can return an array of format strings from the function', async () => {
    expect(
      await run(
        ['test-[a,b,c]:underline'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('test', (selector) =>
                  selector.split(',').map((selector) => `&.${selector} > *`),
                )
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .test-\\[a\\,b\\,c\\]\\:underline.a > *, .test-\\[a\\,b\\,c\\]\\:underline.b > *, .test-\\[a\\,b\\,c\\]\\:underline.c > * {
          text-decoration-line: underline;
        }
      }
      "
    `)
  })

  test('should be possible to sort variants', async () => {
    expect(
      await run(
        ['testmin-[600px]:flex', 'testmin-[500px]:underline', 'testmin-[700px]:italic'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                  sort(a, z) {
                    return parseInt(a.value) - parseInt(z.value)
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        @media (min-width: 500px) {
          .testmin-\\[500px\\]\\:underline {
            text-decoration-line: underline;
          }
        }

        @media (min-width: 600px) {
          .testmin-\\[600px\\]\\:flex {
            display: flex;
          }
        }

        @media (min-width: 700px) {
          .testmin-\\[700px\\]\\:italic {
            font-style: italic;
          }
        }
      }
      "
    `)
  })

  test('should be possible to compare arbitrary variants and hardcoded variants', async () => {
    expect(
      await run(
        ['testmin-[700px]:italic', 'testmin-example:italic', 'testmin-[500px]:italic'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                  values: { example: '600px' },
                  sort(a, z) {
                    return parseInt(a.value) - parseInt(z.value)
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        @media (min-width: 500px) {
          .testmin-\\[500px\\]\\:italic {
            font-style: italic;
          }
        }

        @media (min-width: 600px) {
          .testmin-example\\:italic {
            font-style: italic;
          }
        }

        @media (min-width: 700px) {
          .testmin-\\[700px\\]\\:italic {
            font-style: italic;
          }
        }
      }
      "
    `)
  })

  test('should be possible to sort stacked arbitrary variants correctly', async () => {
    expect(
      await run(
        [
          'testmin-[150px]:testmax-[400px]:order-2',
          'testmin-[100px]:testmax-[350px]:order-3',
          'testmin-[100px]:testmax-[300px]:order-4',
          'testmin-[100px]:testmax-[400px]:order-1',
        ],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                  sort(a, z) {
                    return parseInt(a.value) - parseInt(z.value)
                  },
                })

                matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
                  sort(a, z) {
                    return parseInt(z.value) - parseInt(a.value)
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        @media (min-width: 100px) {
          @media (max-width: 400px) {
            .testmin-\\[100px\\]\\:testmax-\\[400px\\]\\:order-1 {
              order: 1;
            }
          }
        }

        @media (min-width: 150px) {
          @media (max-width: 400px) {
            .testmin-\\[150px\\]\\:testmax-\\[400px\\]\\:order-2 {
              order: 2;
            }
          }
        }

        @media (min-width: 100px) {
          @media (max-width: 350px) {
            .testmin-\\[100px\\]\\:testmax-\\[350px\\]\\:order-3 {
              order: 3;
            }
          }

          @media (max-width: 300px) {
            .testmin-\\[100px\\]\\:testmax-\\[300px\\]\\:order-4 {
              order: 4;
            }
          }
        }
      }
      "
    `)
  })

  test('should maintain sort from other variants, if sort functions of arbitrary variants return 0', async () => {
    // Expect :focus to come after :hover
    expect(
      await run(
        [
          'testmin-[100px]:testmax-[200px]:focus:underline',
          'testmin-[100px]:testmax-[200px]:hover:underline',
        ],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                  sort(a, z) {
                    return parseInt(a.value) - parseInt(z.value)
                  },
                })

                matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
                  sort(a, z) {
                    return parseInt(z.value) - parseInt(a.value)
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        @media (min-width: 100px) {
          @media (max-width: 200px) {
            @media (hover: hover) {
              .testmin-\\[100px\\]\\:testmax-\\[200px\\]\\:hover\\:underline:hover {
                text-decoration-line: underline;
              }
            }

            .testmin-\\[100px\\]\\:testmax-\\[200px\\]\\:focus\\:underline:focus {
              text-decoration-line: underline;
            }
          }
        }
      }
      "
    `)
  })

  test('should sort arbitrary variants left to right (1)', async () => {
    expect(
      await run(
        [
          'testmin-[200px]:testmax-[400px]:order-2',
          'testmin-[200px]:testmax-[300px]:order-4',
          'testmin-[100px]:testmax-[400px]:order-1',
          'testmin-[100px]:testmax-[300px]:order-3',
        ],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                  sort(a, z) {
                    return parseInt(a.value) - parseInt(z.value)
                  },
                })
                matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
                  sort(a, z) {
                    return parseInt(z.value) - parseInt(a.value)
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        @media (min-width: 100px) {
          @media (max-width: 400px) {
            .testmin-\\[100px\\]\\:testmax-\\[400px\\]\\:order-1 {
              order: 1;
            }
          }
        }

        @media (min-width: 200px) {
          @media (max-width: 400px) {
            .testmin-\\[200px\\]\\:testmax-\\[400px\\]\\:order-2 {
              order: 2;
            }
          }
        }

        @media (min-width: 100px) {
          @media (max-width: 300px) {
            .testmin-\\[100px\\]\\:testmax-\\[300px\\]\\:order-3 {
              order: 3;
            }
          }
        }

        @media (min-width: 200px) {
          @media (max-width: 300px) {
            .testmin-\\[200px\\]\\:testmax-\\[300px\\]\\:order-4 {
              order: 4;
            }
          }
        }
      }
      "
    `)
  })

  test('should sort arbitrary variants left to right (2)', async () => {
    expect(
      await run(
        [
          'testmax-[400px]:testmin-[200px]:underline',
          'testmax-[300px]:testmin-[200px]:underline',
          'testmax-[400px]:testmin-[100px]:underline',
          'testmax-[300px]:testmin-[100px]:underline',
        ],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                  sort(a, z) {
                    return parseInt(a.value) - parseInt(z.value)
                  },
                })
                matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
                  sort(a, z) {
                    return parseInt(z.value) - parseInt(a.value)
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        @media (max-width: 400px) {
          @media (min-width: 100px) {
            .testmax-\\[400px\\]\\:testmin-\\[100px\\]\\:underline {
              text-decoration-line: underline;
            }
          }

          @media (min-width: 200px) {
            .testmax-\\[400px\\]\\:testmin-\\[200px\\]\\:underline {
              text-decoration-line: underline;
            }
          }
        }

        @media (max-width: 300px) {
          @media (min-width: 100px) {
            .testmax-\\[300px\\]\\:testmin-\\[100px\\]\\:underline {
              text-decoration-line: underline;
            }
          }

          @media (min-width: 200px) {
            .testmax-\\[300px\\]\\:testmin-\\[200px\\]\\:underline {
              text-decoration-line: underline;
            }
          }
        }
      }
      "
    `)
  })

  test('should guarantee that we are not passing values from other variants to the wrong function', async () => {
    expect(
      await run(
        [
          'testmin-[200px]:testmax-[400px]:order-2',
          'testmin-[200px]:testmax-[300px]:order-4',
          'testmin-[100px]:testmax-[400px]:order-1',
          'testmin-[100px]:testmax-[300px]:order-3',
        ],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                  sort(a, z) {
                    let lookup = ['100px', '200px']
                    if (lookup.indexOf(a.value) === -1 || lookup.indexOf(z.value) === -1) {
                      throw new Error('We are seeing values that should not be there!')
                    }
                    return lookup.indexOf(a.value) - lookup.indexOf(z.value)
                  },
                })
                matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
                  sort(a, z) {
                    let lookup = ['300px', '400px']
                    if (lookup.indexOf(a.value) === -1 || lookup.indexOf(z.value) === -1) {
                      throw new Error('We are seeing values that should not be there!')
                    }
                    return lookup.indexOf(z.value) - lookup.indexOf(a.value)
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        @media (min-width: 100px) {
          @media (max-width: 400px) {
            .testmin-\\[100px\\]\\:testmax-\\[400px\\]\\:order-1 {
              order: 1;
            }
          }
        }

        @media (min-width: 200px) {
          @media (max-width: 400px) {
            .testmin-\\[200px\\]\\:testmax-\\[400px\\]\\:order-2 {
              order: 2;
            }
          }
        }

        @media (min-width: 100px) {
          @media (max-width: 300px) {
            .testmin-\\[100px\\]\\:testmax-\\[300px\\]\\:order-3 {
              order: 3;
            }
          }
        }

        @media (min-width: 200px) {
          @media (max-width: 300px) {
            .testmin-\\[200px\\]\\:testmax-\\[300px\\]\\:order-4 {
              order: 4;
            }
          }
        }
      }
      "
    `)
  })

  test('should default to the DEFAULT value for variants', async () => {
    expect(
      await run(
        ['foo:underline'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('foo', (value) => `.foo${value} &`, {
                  values: { DEFAULT: '.bar' },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .foo.bar .foo\\:underline {
          text-decoration-line: underline;
        }
      }
      "
    `)
  })

  test('should not generate anything if the matchVariant does not have a DEFAULT value configured', async () => {
    expect(
      await run(
        ['foo:underline'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('foo', (value) => `.foo${value} &`)
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities;
      "
    `)
  })

  test('should be possible to use `null` as a DEFAULT value', async () => {
    expect(
      await run(
        ['foo:underline'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('foo', (value) => `.foo${value === null ? '-good' : '-bad'} &`, {
                  values: { DEFAULT: null },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .foo-good .foo\\:underline {
          text-decoration-line: underline;
        }
      }
      "
    `)
  })

  test('should be possible to use `undefined` as a DEFAULT value', async () => {
    expect(
      await run(
        ['foo:underline'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('foo', (value) => `.foo${value === undefined ? '-good' : '-bad'} &`, {
                  values: { DEFAULT: undefined },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .foo-good .foo\\:underline {
          text-decoration-line: underline;
        }
      }
      "
    `)
  })

  test('should be called with eventual modifiers', async () => {
    expect(
      await run(
        ['my-container-[250px]:underline', 'my-container-[250px]/placement:underline'],
        css`
          @plugin "my-plugin";
          @tailwind utilities;
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('my-container', (value, { modifier }) => {
                  function parseValue(value: string) {
                    const numericValue = value.match(/^(\d+\.\d+|\d+|\.\d+)\D+/)?.[1] ?? null
                    if (numericValue === null) return null

                    return parseFloat(value)
                  }

                  const parsed = parseValue(value)
                  return parsed !== null ? `@container ${modifier ?? ''} (min-width: ${value})` : []
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @container (min-width: 250px) {
        .my-container-\\[250px\\]\\:underline {
          text-decoration-line: underline;
        }
      }

      @container placement (min-width: 250px) {
        .my-container-\\[250px\\]\\/placement\\:underline {
          text-decoration-line: underline;
        }
      }
      "
    `)
  })

  test('ignores variants that use :merge(…)', async () => {
    expect(
      await run(
        [
          'optional-[test]:flex',
          'group-optional-[test]:flex',
          'peer-optional-[test]:flex',
          'group-optional-[test]/foo:flex',
        ],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('optional', (flavor) => `&:optional:has(${flavor}) &`)
                matchVariant(
                  'group-optional',
                  (flavor) => `:merge(.group):optional:has(${flavor}) &`,
                )
                matchVariant(
                  'peer-optional',
                  (flavor) => `:merge(.peer):optional:has(${flavor}) ~ &`,
                )
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .group-optional-\\[test\\]\\:flex:is(:where(.group):optional:has(test) :where(.group) *), .group-optional-\\[test\\]\\/foo\\:flex:is(:where(.group\\/foo):optional:has(test) :where(.group\\/foo) *), .peer-optional-\\[test\\]\\:flex:is(:where(.peer):optional:has(test) :where(.peer) ~ *), .optional-\\[test\\]\\:flex:optional:has(test) .optional-\\[test\\]\\:flex {
          display: flex;
        }
      }
      "
    `)
  })

  test('ignores variants that use unknown values', async () => {
    expect(
      await run(
        ['foo-[test]:flex', 'foo-known:flex', 'foo-unknown:flex'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('foo', (flavor) => `&:is(${flavor})`, {
                  values: { known: 'known' },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .foo-known\\:flex:is(known), .foo-\\[test\\]\\:flex:is(test) {
          display: flex;
        }
      }
      "
    `)
  })

  test('ignores variants that produce non-string values', async () => {
    expect(
      await run(
        ['foo-[test]:flex', 'foo-string:flex', 'foo-object:flex'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: ({ matchVariant }: PluginAPI) => {
                matchVariant('foo', (flavor) => `&:is(${flavor})`, {
                  values: {
                    string: 'some string',
                    object: { some: 'object' },
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .foo-string\\:flex:is(some string), .foo-\\[test\\]\\:flex:is(test) {
          display: flex;
        }
      }
      "
    `)
  })
})

describe('addUtilities()', () => {
  test('custom static utility', async () => {
    expect(
      await run(
        ['text-trim', 'lg:text-trim'],
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
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addUtilities }: PluginAPI) => {
                addUtilities({
                  '.text-trim': {
                    'text-box-trim': 'both',
                    'text-box-edge': 'cap alphabetic',
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .text-trim {
          text-box-trim: both;
          text-box-edge: cap alphabetic;
        }

        @media (min-width: 1024px) {
          .lg\\:text-trim {
            text-box-trim: both;
            text-box-edge: cap alphabetic;
          }
        }
      }
      "
    `)
  })

  test('return multiple rule objects from a custom utility', async () => {
    expect(
      await run(
        ['text-trim'],
        css`
          @plugin "my-plugin";
          @tailwind utilities;
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addUtilities }: PluginAPI) => {
                addUtilities([
                  {
                    '.text-trim': [
                      { 'text-box-trim': 'both' },
                      { 'text-box-edge': 'cap alphabetic' },
                    ],
                  },
                ])
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .text-trim {
        text-box-trim: both;
        text-box-edge: cap alphabetic;
      }
      "
    `)
  })

  test('define multiple utilities with array syntax', async () => {
    expect(
      await run(
        ['text-trim', 'text-trim-2'],
        css`
          @plugin "my-plugin";
          @tailwind utilities;
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addUtilities }: PluginAPI) => {
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
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .text-trim, .text-trim-2 {
        text-box-trim: both;
        text-box-edge: cap alphabetic;
      }
      "
    `)
  })

  test('utilities can use arrays for fallback declaration values', async () => {
    expect(
      await run(
        ['outlined'],
        css`
          @plugin "my-plugin";
          @tailwind utilities;
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addUtilities }: PluginAPI) => {
                addUtilities([
                  {
                    '.outlined': {
                      outline: ['1px solid ButtonText', '1px auto -webkit-focus-ring-color'],
                    },
                  },
                ])
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .outlined {
        outline: 1px solid buttontext;
        outline: 1px auto -webkit-focus-ring-color;
      }
      "
    `)
  })

  test('camel case properties are converted to kebab-case', async () => {
    expect(
      await run(
        ['text-trim'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addUtilities }: PluginAPI) => {
                addUtilities({
                  '.text-trim': {
                    WebkitAppearance: 'none',
                    textBoxTrim: 'both',
                    textBoxEdge: 'cap alphabetic',
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .text-trim {
          -webkit-appearance: none;
          text-box-trim: both;
          text-box-edge: cap alphabetic;
        }
      }
      "
    `)
  })

  test('custom static utilities support `@apply`', async () => {
    expect(
      await run(
        ['foo', 'lg:foo'],
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
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addUtilities }: PluginAPI) => {
                addUtilities({
                  '.foo': {
                    '@apply flex dark:underline': {},
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .foo {
          display: flex;
        }

        @media (prefers-color-scheme: dark) {
          .foo {
            text-decoration-line: underline;
          }
        }

        @media (min-width: 1024px) {
          .lg\\:foo {
            display: flex;
          }

          @media (prefers-color-scheme: dark) {
            .lg\\:foo {
              text-decoration-line: underline;
            }
          }
        }
      }
      "
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
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addUtilities }: PluginAPI) => {
                addUtilities({
                  ':hover > *': {
                    'text-box-trim': 'both',
                    'text-box-edge': 'cap alphabetic',
                  },
                })
              },
            }
          },
        },
      )
    }).rejects.toThrow(/invalid utility selector/)
  })

  test('supports multiple selector names', async () => {
    expect(
      await run(
        ['form-input', 'lg:form-textarea'],
        css`
          @plugin "my-plugin";
          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addUtilities }: PluginAPI) => {
                addUtilities({
                  '.form-input, .form-textarea': {
                    appearance: 'none',
                    'background-color': '#fff',
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .form-input {
        appearance: none;
        background-color: #fff;
      }

      @media (min-width: 1024px) {
        .lg\\:form-textarea {
          appearance: none;
          background-color: #fff;
        }
      }
      "
    `)
  })

  test('supports pseudo classes and pseudo elements', async () => {
    expect(
      await run(
        ['form-input', 'lg:form-textarea'],
        css`
          @plugin "my-plugin";
          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addUtilities }: PluginAPI) => {
                addUtilities({
                  '.form-input, .form-input::placeholder, .form-textarea:hover:focus': {
                    'background-color': 'red',
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .form-input, .form-input::placeholder {
        background-color: red;
      }

      @media (min-width: 1024px) {
        .lg\\:form-textarea:hover:focus {
          background-color: red;
        }
      }
      "
    `)
  })

  test('nests complex utility names', async () => {
    expect(
      await run(
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addUtilities }: PluginAPI) => {
                addUtilities({
                  '.a .b:hover .c': { color: 'red' },
                  '.d > *': { color: 'red' },
                  '.e .bar:not(.f):has(.g)': { color: 'red' },
                  '.h~.i': { color: 'red' },
                  '.j.j': { color: 'red' },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .j.j, .j.j, .a .b:hover .c, .a .b:hover .c, .a .b:hover .c, .d > *, .e .bar:not(.f):has(.g), .e .bar:not(.f):has(.g), .h ~ .i, .h ~ .i {
          color: red;
        }
      }
      "
    `)
  })

  test('prefixes nested class names with the configured theme prefix', async () => {
    expect(
      await run(
        ['tw:a', 'tw:b', 'tw:c', 'tw:d'],
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }
          @theme prefix(tw) {
          }
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addUtilities }: PluginAPI) => {
                addUtilities({ '.a .b:hover .c.d': { color: 'red' } })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .tw\\:a .tw\\:b:hover .tw\\:c.tw\\:d {
          color: red;
        }
      }
      "
    `)
  })

  test('replaces the class name with variants in nested selectors', async () => {
    expect(
      await run(
        ['foo', 'md:foo', 'not-hover:md:foo'],
        css`
          @plugin "my-plugin";
          @theme {
            --breakpoint-md: 768px;
          }
          @tailwind utilities;
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addUtilities }: PluginAPI) => {
                addUtilities({ '.foo': { ':where(.foo > :first-child)': { color: 'red' } } })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .foo :where(.foo > :first-child) {
        color: red;
      }

      @media (min-width: 768px) {
        .md\\:foo :where(.md\\:foo > :first-child), .not-hover\\:md\\:foo:not(:hover) :where(.not-hover\\:md\\:foo > :first-child) {
          color: red;
        }
      }

      @media not all and (hover: hover) {
        @media (min-width: 768px) {
          .not-hover\\:md\\:foo :where(.not-hover\\:md\\:foo > :first-child) {
            color: red;
          }
        }
      }
      "
    `)
  })

  test('values that are `false`, `null`, or `undefined` are discarded from CSS object ASTs', async () => {
    expect(
      await run(
        ['foo'],
        css`
          @plugin "my-plugin";
          @tailwind utilities;
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addUtilities }: PluginAPI) => {
                addUtilities({
                  '.foo': {
                    a: 'red',
                    // @ts-ignore: While this isn't valid per the types this did work in v3
                    'z-index': 0,
                    // @ts-ignore
                    '.bar': false,
                    // @ts-ignore
                    '.baz': null,
                    // @ts-ignore
                    '.qux': undefined,
                  },
                })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .foo {
        a: red;
        z-index: 0;
      }
      "
    `)
  })
})

describe('matchUtilities()', () => {
  test('custom functional utility', async () => {
    let input = css`
      @plugin "my-plugin";

      @tailwind utilities;

      @theme reference {
        --breakpoint-lg: 1024px;
      }
    `

    expect(
      await run(
        [
          'border-block',
          'border-block-2',
          'border-block-[35px]',
          'border-block-[var(--foo)]',
          'lg:border-block-2',
        ],
        input,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  { 'border-block': (value) => ({ 'border-block-width': value }) },
                  { values: { DEFAULT: '1px', '2': '2px' } },
                )
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .border-block {
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

      @media (min-width: 1024px) {
        .lg\\:border-block-2 {
          border-block-width: 2px;
        }
      }
      "
    `)

    expect(
      await run(
        [
          '-border-block',
          '-border-block-2',
          'lg:-border-block-2',
          'border-block-unknown',
          'border-block/1',
        ],
        input,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  { 'border-block': (value) => ({ 'border-block-width': value }) },
                  { values: { DEFAULT: '1px', '2': '2px' } },
                )
              },
            }
          },
        },
      ),
    ).toEqual('')
  })

  test('custom functional utilities can start with @', async () => {
    expect(
      await run(
        ['@w-1', 'hover:@w-1'],
        css`
          @plugin "my-plugin";
          @tailwind utilities;
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities({ '@w': (value) => ({ width: value }) }, { values: { 1: '1px' } })
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .\\@w-1 {
        width: 1px;
      }

      @media (hover: hover) {
        .hover\\:\\@w-1:hover {
          width: 1px;
        }
      }
      "
    `)
  })

  test('custom functional utilities can return an array of rules', async () => {
    expect(
      await run(
        ['all-but-order-bottom-left-radius'],
        css`
          @plugin "my-plugin";
          @tailwind utilities;
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  {
                    'all-but-order-bottom-left-radius': (value) =>
                      [
                        { 'border-top-left-radius': value },
                        { 'border-top-right-radius': value },
                        { 'border-bottom-right-radius': value },
                      ] as CssInJs[],
                  },
                  { values: { DEFAULT: '1px' } },
                )
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .all-but-order-bottom-left-radius {
        border-top-left-radius: 1px;
        border-top-right-radius: 1px;
        border-bottom-right-radius: 1px;
      }
      "
    `)
  })

  test('custom functional utility with any modifier', async () => {
    expect(
      await run(
        ['border-block', 'border-block-2', 'border-block/foo', 'border-block-2/foo'],
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  {
                    'border-block': (value, { modifier }) => ({
                      '--my-modifier': modifier ?? 'none',
                      'border-block-width': value,
                    }),
                  },
                  { values: { DEFAULT: '1px', '2': '2px' }, modifiers: 'any' },
                )
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .border-block {
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
      }
      "
    `)
  })

  test('custom functional utility with known modifier', async () => {
    let input = css`
      @plugin "my-plugin";

      @tailwind utilities;

      @theme reference {
        --breakpoint-lg: 1024px;
      }
    `

    expect(
      await run(
        ['border-block', 'border-block-2', 'border-block/foo', 'border-block-2/foo'],
        input,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  {
                    'border-block': (value, { modifier }) => ({
                      '--my-modifier': modifier ?? 'none',
                      'border-block-width': value,
                    }),
                  },
                  {
                    values: { DEFAULT: '1px', '2': '2px' },
                    modifiers: { foo: 'foo' },
                  },
                )
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .border-block {
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
      }
      "
    `)

    expect(
      await run(['border-block/unknown', 'border-block-2/unknown'], input, {
        async loadModule(_id, base) {
          return {
            path: '',
            base,
            module: ({ matchUtilities }: PluginAPI) => {
              matchUtilities(
                {
                  'border-block': (value, { modifier }) => ({
                    '--my-modifier': modifier ?? 'none',
                    'border-block-width': value,
                  }),
                },
                {
                  values: { DEFAULT: '1px', '2': '2px' },
                  modifiers: { foo: 'foo' },
                },
              )
            },
          }
        },
      }),
    ).toEqual('')
  })

  // We're not married to this behavior — if there's a good reason to do this differently in the
  // future don't be afraid to change what should happen in this scenario.
  describe('plugins that handle a specific arbitrary value type prevent falling through to other plugins if the result is invalid for that plugin', () => {
    test('implicit color modifier', async () => {
      let input = css`
        @tailwind utilities;
        @plugin "my-plugin";
      `

      let options: Partial<Parameters<typeof compile>[1]> = {
        async loadModule(_id, base) {
          return {
            path: '',
            base,
            module: ({ matchUtilities }: PluginAPI) => {
              matchUtilities(
                { scrollbar: (value) => ({ 'scrollbar-color': value }) },
                { type: ['color', 'any'] },
              )
              matchUtilities(
                { scrollbar: (value) => ({ 'scrollbar-width': value }) },
                { type: ['length'] },
              )
            },
          }
        },
      }

      expect(
        await run(['scrollbar-[2px]', 'scrollbar-[#08c]', 'scrollbar-[#08c]/50'], input, options),
      ).toMatchInlineSnapshot(`
        "
        .scrollbar-\\[2px\\] {
          scrollbar-width: 2px;
        }

        .scrollbar-\\[\\#08c\\] {
          scrollbar-color: #08c;
        }

        .scrollbar-\\[\\#08c\\]\\/50 {
          scrollbar-color: oklab(59.9824% -.067 -.124 / .5);
        }
        "
      `)
      expect(await run(['scrollbar-[2px]/50'], input, options)).toEqual('')
    })

    test('no modifiers are supported by the plugins', async () => {
      expect(
        await run(
          ['scrollbar-[2px]/50'],
          css`
            @tailwind utilities;
            @plugin "my-plugin";
          `,
          {
            async loadModule(_id, base) {
              return {
                path: '',
                base,
                module: ({ matchUtilities }: PluginAPI) => {
                  matchUtilities(
                    { scrollbar: (value) => ({ '--scrollbar-angle': value }) },
                    { type: ['angle', 'any'] },
                  )

                  matchUtilities(
                    { scrollbar: (value) => ({ '--scrollbar-width': value }) },
                    { type: ['length'] },
                  )
                },
              }
            },
          },
        ),
      ).toEqual('')
    })

    test('invalid named modifier', async () => {
      expect(
        await run(
          ['scrollbar-[2px]/foo'],
          css`
            @tailwind utilities;
            @plugin "my-plugin";
          `,
          {
            async loadModule(_id, base) {
              return {
                path: '',
                base,
                module: ({ matchUtilities }: PluginAPI) => {
                  matchUtilities(
                    { scrollbar: (value) => ({ 'scrollbar-color': value }) },
                    { type: ['color', 'any'], modifiers: { foo: 'foo' } },
                  )

                  matchUtilities(
                    { scrollbar: (value) => ({ 'scrollbar-width': value }) },
                    { type: ['length'], modifiers: { bar: 'bar' } },
                  )
                },
              }
            },
          },
        ),
      ).toEqual('')
    })
  })

  test('custom functional utilities with different types', async () => {
    let input = css`
      @plugin "my-plugin";

      @tailwind utilities;

      @theme reference {
        --breakpoint-lg: 1024px;
      }
    `

    expect(
      await run(
        [
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
        ],
        input,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  { scrollbar: (value) => ({ 'scrollbar-color': value }) },
                  { type: ['color', 'any'], values: { black: 'black' } },
                )

                matchUtilities(
                  { scrollbar: (value) => ({ 'scrollbar-width': value }) },
                  { type: ['length'], values: { 2: '2px' } },
                )
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .scrollbar-2, .scrollbar-\\[2px\\] {
        scrollbar-width: 2px;
      }

      .scrollbar-\\[length\\:var\\(--my-width\\)\\] {
        scrollbar-width: var(--my-width);
      }

      .scrollbar-\\[\\#fff\\] {
        scrollbar-color: #fff;
      }

      .scrollbar-\\[\\#fff\\]\\/50 {
        scrollbar-color: oklab(100% 0 5.96046e-8 / .5);
      }

      .scrollbar-\\[color\\:var\\(--my-color\\)\\], .scrollbar-\\[color\\:var\\(--my-color\\)\\]\\/50 {
        scrollbar-color: var(--my-color);
      }

      @supports (color: color-mix(in lab, red, red)) {
        .scrollbar-\\[color\\:var\\(--my-color\\)\\]\\/50 {
          scrollbar-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        }
      }

      .scrollbar-\\[var\\(--my-color\\)\\], .scrollbar-\\[var\\(--my-color\\)\\]\\/50 {
        scrollbar-color: var(--my-color);
      }

      @supports (color: color-mix(in lab, red, red)) {
        .scrollbar-\\[var\\(--my-color\\)\\]\\/50 {
          scrollbar-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        }
      }

      .scrollbar-black {
        scrollbar-color: black;
      }

      .scrollbar-black\\/50 {
        scrollbar-color: oklab(0% none none / .5);
      }
      "
    `)

    expect(
      await run(
        ['scrollbar-2/50', 'scrollbar-[2px]/50', 'scrollbar-[length:var(--my-width)]/50'],
        input,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  { scrollbar: (value) => ({ 'scrollbar-color': value }) },
                  { type: ['color', 'any'], values: { black: 'black' } },
                )

                matchUtilities(
                  { scrollbar: (value) => ({ 'scrollbar-width': value }) },
                  { type: ['length'], values: { 2: '2px' } },
                )
              },
            }
          },
        },
      ),
    ).toEqual('')
  })

  test('functional utilities with `type: color` automatically support opacity', async () => {
    expect(
      await run(
        [
          'scrollbar-current',
          'scrollbar-current/45',
          'scrollbar-black',
          'scrollbar-black/33',
          'scrollbar-black/[50%]',
          'scrollbar-[var(--my-color)]/[25%]',
        ],
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  { scrollbar: (value) => ({ 'scrollbar-color': value }) },
                  { type: ['color', 'any'], values: { black: 'black' } },
                )
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .scrollbar-\\[var\\(--my-color\\)\\]\\/\\[25\\%\\] {
        scrollbar-color: var(--my-color);
      }

      @supports (color: color-mix(in lab, red, red)) {
        .scrollbar-\\[var\\(--my-color\\)\\]\\/\\[25\\%\\] {
          scrollbar-color: color-mix(in oklab, var(--my-color) 25%, transparent);
        }
      }

      .scrollbar-black {
        scrollbar-color: black;
      }

      .scrollbar-black\\/33 {
        scrollbar-color: oklab(0% none none / .33);
      }

      .scrollbar-black\\/\\[50\\%\\] {
        scrollbar-color: oklab(0% none none / .5);
      }

      .scrollbar-current, .scrollbar-current\\/45 {
        scrollbar-color: currentcolor;
      }

      @supports (color: color-mix(in lab, red, red)) {
        .scrollbar-current\\/45 {
          scrollbar-color: color-mix(in oklab, currentcolor 45%, transparent);
        }
      }
      "
    `)
  })

  test('functional utilities with explicit modifiers', async () => {
    expect(
      await run(
        ['scrollbar-[12px]', 'scrollbar-[12px]/foo', 'scrollbar-[12px]/bar'],
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
            --opacity-my-opacity: 0.5;
          }
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  {
                    scrollbar: (value, { modifier }) => ({
                      '--modifier': modifier ?? 'none',
                      'scrollbar-width': value,
                    }),
                  },
                  { type: ['any'], values: {}, modifiers: { foo: 'foo' } },
                )
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .scrollbar-\\[12px\\] {
        --modifier: none;
        scrollbar-width: 12px;
      }

      .scrollbar-\\[12px\\]\\/foo {
        --modifier: foo;
        scrollbar-width: 12px;
      }
      "
    `)
  })

  test('functional utilities support `@apply`', async () => {
    expect(
      await run(
        ['foo-bar', 'lg:foo-bar', 'foo-[12px]', 'lg:foo-[12px]'],
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
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  { foo: (value) => ({ '--foo': value, [`@apply flex`]: {} }) },
                  { values: { bar: 'bar' } },
                )
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @layer utilities {
        .foo-\\[12px\\] {
          --foo: 12px;
          display: flex;
        }

        .foo-bar {
          --foo: bar;
          display: flex;
        }

        @media (min-width: 1024px) {
          .lg\\:foo-\\[12px\\] {
            --foo: 12px;
            display: flex;
          }

          .lg\\:foo-bar {
            --foo: bar;
            display: flex;
          }
        }
      }
      "
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
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities({
                  '.text-trim > *': () => ({
                    'text-box-trim': 'both',
                    'text-box-edge': 'cap alphabetic',
                  }),
                })
              },
            }
          },
        },
      )
    }).rejects.toThrow(/invalid utility name/)
  })

  test('replaces the class name with variants in nested selectors', async () => {
    expect(
      await run(
        ['foo-red', 'md:foo-red', 'not-hover:md:foo-red'],
        css`
          @plugin "my-plugin";
          @theme {
            --breakpoint-md: 768px;
          }
          @tailwind utilities;
        `,
        {
          async loadModule(base) {
            return {
              path: '',
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  { foo: (value) => ({ ':where(.foo > :first-child)': { color: value } }) },
                  { values: { red: 'red' } },
                )
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .foo-red :where(.foo-red > :first-child) {
        color: red;
      }

      @media (min-width: 768px) {
        .md\\:foo-red :where(.md\\:foo-red > :first-child), .not-hover\\:md\\:foo-red:not(:hover) :where(.not-hover\\:md\\:foo-red > :first-child) {
          color: red;
        }
      }

      @media not all and (hover: hover) {
        @media (min-width: 768px) {
          .not-hover\\:md\\:foo-red :where(.not-hover\\:md\\:foo-red > :first-child) {
            color: red;
          }
        }
      }
      "
    `)
  })
})

describe('addComponents()', () => {
  test('is an alias for addUtilities', async () => {
    expect(
      await run(
        ['btn', 'btn-blue', 'btn-red'],
        css`
          @plugin "my-plugin";
          @tailwind utilities;
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ addComponents }: PluginAPI) => {
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
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .btn {
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
      }
      "
    `)
  })
})

describe('matchComponents()', () => {
  test('is an alias for matchUtilities', async () => {
    expect(
      await run(
        ['prose', 'sm:prose-sm', 'hover:prose-lg'],
        css`
          @plugin "my-plugin";
          @tailwind utilities;
        `,
        {
          async loadModule(_id, base) {
            return {
              path: '',
              base,
              module: ({ matchComponents }: PluginAPI) => {
                matchComponents(
                  { prose: (value) => ({ '--container-size': value }) },
                  { values: { DEFAULT: 'normal', sm: 'sm', lg: 'lg' } },
                )
              },
            }
          },
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .prose {
        --container-size: normal;
      }

      @media (hover: hover) {
        .hover\\:prose-lg:hover {
          --container-size: lg;
        }
      }
      "
    `)
  })
})

describe('prefix()', () => {
  test('is an identity function', async () => {
    using fn = vi.fn()
    await compile(
      css`
        @plugin "my-plugin";
      `,
      {
        async loadModule(_id, base) {
          return {
            path: '',
            base,
            module: ({ prefix }: PluginAPI) => {
              fn(prefix('btn'))
            },
          }
        },
      },
    )

    expect(fn).toHaveBeenCalledWith('btn')
  })
})

describe('config()', () => {
  test('can return the resolved config when passed no arguments', async () => {
    using fn = vi.fn()
    await compile(
      css`
        @plugin "my-plugin";
      `,
      {
        async loadModule(_id, base) {
          return {
            path: '',
            base,
            module: ({ config }: PluginAPI) => {
              fn(config())
            },
          }
        },
      },
    )

    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: expect.objectContaining({
          spacing: expect.any(Object),
        }),
      }),
    )
  })

  test('can return part of the config', async () => {
    using fn = vi.fn()
    await compile(
      css`
        @plugin "my-plugin";
      `,
      {
        async loadModule(_id, base) {
          return {
            path: '',
            base,
            module: ({ config }: PluginAPI) => {
              fn(config('theme'))
            },
          }
        },
      },
    )

    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({
        spacing: expect.any(Object),
      }),
    )
  })

  test('falls back to default value if requested path does not exist', async () => {
    using fn = vi.fn()
    await compile(
      css`
        @plugin "my-plugin";
      `,
      {
        async loadModule(_id, base) {
          return {
            path: '',
            base,
            module: ({ config }: PluginAPI) => {
              fn(config('somekey', 'defaultvalue'))
            },
          }
        },
      },
    )

    expect(fn).toHaveBeenCalledWith('defaultvalue')
  })

  // https://github.com/tailwindlabs/tailwindcss/issues/19721
  test('matchUtilities does not match Object.prototype properties as values', async ({
    expect,
  }) => {
    // These should not crash or produce output
    expect(
      await run(
        [
          'test-constructor',
          'test-hasOwnProperty',
          'test-toString',
          'test-valueOf',
          'test-__proto__',
        ],
        css`
          @tailwind utilities;
          @plugin "my-plugin";
        `,
        {
          loadModule: async (_id, base) => {
            return {
              path: '',
              base,
              module: plugin(function ({ matchUtilities }) {
                matchUtilities(
                  { test: (value) => ({ '--test': value }) },
                  { values: { foo: 'bar' } },
                )
              }),
            }
          },
        },
      ),
    ).toEqual('')
  })
})
