import { test } from 'vitest'
import { compile } from '.'
import plugin from './plugin'

const css = String.raw

test('plugin', async ({ expect }) => {
  let input = css`
    @theme reference {
      --color-red-100: #fee2e2;
      --color-red-300: #fca5a5;
      --color-red-500: #ef4444;
      --color-red-700: #b91c1c;
      --color-red-900: #7f1d1d;
      --color-orange-100: #ffedd5;
      --color-orange-300: #fdba74;
      --color-orange-500: #f97316;
      --color-orange-700: #c2410c;
      --color-orange-900: #7c2d12;
    }
    @tailwind utilities;
    @plugin "my-plugin";
  `

  let compiler = await compile(input, {
    loadPlugin: async () => {
      return plugin(
        function ({ addUtilities, matchUtilities, theme }) {
          addUtilities({
            '@keyframes enter': theme('keyframes.enter'),
            '@keyframes exit': theme('keyframes.exit'),
          })
          matchUtilities(
            {
              scrollbar: (value) => ({ 'scrollbar-color': value }),
            },
            {
              values: theme('backgroundColor'),
            },
          )
        },
        {
          theme: {
            extend: {
              colors: {
                'russet-50': '#faf5ec',
                'russet-100': '#f2e9cf',
                'russet-200': '#e6d1a2',
                'russet-300': '#d8b36c',
                'russet-400': '#cb9744',
                'russet-500': '#bc8236',
                'russet-600': '#a2662c',
                'russet-700': '#7a4724',
                'russet-800': '#6d3f26',
                'russet-900': '#5e3625',
                'russet-950': '#361b12',
              },
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

  expect(compiler.build(['scrollbar-red-500', 'scrollbar-russet-700'])).toMatchInlineSnapshot(`
    ".scrollbar-red-500 {
      scrollbar-color: var(--color-red-500, #ef4444);
    }
    .scrollbar-russet-700 {
      scrollbar-color: #7a4724;
    }
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
    "
  `)
})
