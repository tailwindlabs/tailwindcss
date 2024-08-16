import { describe, test, vi } from 'vitest'
import { compile } from '.'
import plugin from './plugin'

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
})
