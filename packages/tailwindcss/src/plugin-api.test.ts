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

  test('wip about the DEFAULT key', async ({ expect }) => {
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
              animation: (value) => ({ '--animation': value }),
            },
            {
              values: theme('animation'),
            },
          )

          matchUtilities(
            {
              animation2: (value) => ({ '--animation': value }),
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
          --animation: var(--animation, pulse 1s linear infinite);
        }
        .animation-spin {
          --animation: var(--animation-spin, spin 1s linear infinite);
        }
        .animation2 {
          --animation: var(--animation, pulse 1s linear infinite);
        }
        .animation2-twist {
          --animation: var(--animation-spin, spin 1s linear infinite);
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
})
