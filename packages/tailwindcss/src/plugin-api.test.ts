import { describe, test } from 'vitest'
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
                animationDuration: ({ theme }: { theme: (path: string) => any }) => ({
                  ...theme('transitionDuration'),
                }),
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
})
