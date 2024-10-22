import { describe, expect } from 'vitest'
import { css, html, json, test, ts } from '../utils'

test(
  `upgrade JS config files with flat theme values, darkMode, and content fields`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': ts`
        import { type Config } from 'tailwindcss'
        import defaultTheme from 'tailwindcss/defaultTheme'

        module.exports = {
          darkMode: 'selector',
          content: ['./src/**/*.{html,js}', './node_modules/my-external-lib/**/*.{html}'],
          theme: {
            boxShadow: {
              sm: '0 2px 6px rgb(15 23 42 / 0.08)',
            },
            colors: {
              red: {
                400: '#f87171',
                500: 'red',
              },
            },
            fontSize: {
              xs: ['0.75rem', { lineHeight: '1rem' }],
              sm: ['0.875rem', { lineHeight: '1.5rem' }],
              base: ['1rem', { lineHeight: '2rem' }],
            },
            extend: {
              colors: {
                red: {
                  500: '#ef4444',
                  600: '#dc2626',
                },
              },
              fontFamily: {
                sans: 'Inter, system-ui, sans-serif',
                display: ['Cabinet Grotesk', ...defaultTheme.fontFamily.sans],
              },
              borderRadius: {
                '4xl': '2rem',
              },
              keyframes: {
                'spin-clockwise': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
                'spin-counterclockwise': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(-360deg)' },
                },
              },
              animation: {
                'spin-clockwise': 'spin-clockwise 1s linear infinite',
                'spin-counterclockwise': 'spin-counterclockwise 1s linear infinite',
              },
            },
          },
          plugins: [],
        } satisfies Config
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
      'src/test.js': ts`
        export default {
          shouldNotUse: !border.shouldUse,
        }
      `,
      'node_modules/my-external-lib/src/template.html': html`
        <div class="text-red-500">
          Hello world!
        </div>
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.{css,js}')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }

      @source '../node_modules/my-external-lib/**/*.{html}';

      @variant dark (&:where(.dark, .dark *));

      @theme {
        --shadow-*: initial;
        --shadow-sm: 0 2px 6px rgb(15 23 42 / 0.08);

        --color-*: initial;
        --color-red-400: #f87171;
        --color-red-500: #ef4444;
        --color-red-600: #dc2626;

        --font-size-*: initial;
        --font-size-xs: 0.75rem;
        --font-size-xs--line-height: 1rem;
        --font-size-sm: 0.875rem;
        --font-size-sm--line-height: 1.5rem;
        --font-size-base: 1rem;
        --font-size-base--line-height: 2rem;

        --font-family-sans: Inter, system-ui, sans-serif;
        --font-family-display: Cabinet Grotesk, ui-sans-serif, system-ui, sans-serif,
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';

        --radius-4xl: 2rem;

        --animate-spin-clockwise: spin-clockwise 1s linear infinite;
        --animate-spin-counterclockwise: spin-counterclockwise 1s linear infinite;

        @keyframes spin-clockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-counterclockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }
      }

      --- src/test.js ---
      export default {
        shouldNotUse: !border.shouldUse,
      }
      "
    `)

    expect((await fs.dumpFiles('tailwind.config.ts')).trim()).toBe('')
  },
)

test(
  'upgrades JS config files with plugins',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/typography": "^0.5.15",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': ts`
        import { type Config } from 'tailwindcss'
        import typography from '@tailwindcss/typography'
        import customPlugin from './custom-plugin'

        export default {
          plugins: [
            typography,
            customPlugin({
              'is-null': null,
              'is-true': true,
              'is-false': false,
              'is-int': 1234567,
              'is-float': 1.35,
              'is-sci': 1.35e-5,
              'is-str-null': 'null',
              'is-str-true': 'true',
              'is-str-false': 'false',
              'is-str-int': '1234567',
              'is-str-float': '1.35',
              'is-str-sci': '1.35e-5',
              'is-arr': ['foo', 'bar'],
              'is-arr-mixed': [null, true, false, 1234567, 1.35, 'foo', 'bar', 'true'],
            }),
          ],
        } satisfies Config
      `,
      'custom-plugin.js': ts`
        import plugin from 'tailwindcss/plugin'
        export default plugin.withOptions((_options) => ({ addVariant }) => {
          addVariant('inverted', '@media (inverted-colors: inverted)')
          addVariant('hocus', ['&:focus', '&:hover'])
        })
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }

      @plugin '@tailwindcss/typography';
      @plugin '../custom-plugin' {
        is-null: null;
        is-true: true;
        is-false: false;
        is-int: 1234567;
        is-float: 1.35;
        is-sci: 0.0000135;
        is-str-null: 'null';
        is-str-true: 'true';
        is-str-false: 'false';
        is-str-int: '1234567';
        is-str-float: '1.35';
        is-str-sci: '1.35e-5';
        is-arr: 'foo', 'bar';
        is-arr-mixed: null, true, false, 1234567, 1.35, 'foo', 'bar', 'true';
      }
      "
    `)

    expect(await fs.dumpFiles('tailwind.config.ts')).toMatchInlineSnapshot(`
      "

      "
    `)
  },
)

test(
  'upgrades JS config files with functions in the theme config',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': ts`
        import { type Config } from 'tailwindcss'

        export default {
          theme: {
            extend: {
              colors: ({ colors }) => ({
                gray: colors.neutral,
              }),
            },
          },
        } satisfies Config
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.{css,ts}')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }

      @theme {
        --color-gray-50: oklch(0.985 0 0);
        --color-gray-100: oklch(0.97 0 0);
        --color-gray-200: oklch(0.922 0 0);
        --color-gray-300: oklch(0.87 0 0);
        --color-gray-400: oklch(0.708 0 0);
        --color-gray-500: oklch(0.556 0 0);
        --color-gray-600: oklch(0.439 0 0);
        --color-gray-700: oklch(0.371 0 0);
        --color-gray-800: oklch(0.269 0 0);
        --color-gray-900: oklch(0.205 0 0);
        --color-gray-950: oklch(0.145 0 0);
      }
      "
    `)

    expect(await fs.dumpFiles('tailwind.config.ts')).toMatchInlineSnapshot(`
      "

      "
    `)
  },
)

test(
  'does not upgrade JS config files with theme keys contributed to by plugins in the theme config',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': ts`
        import { type Config } from 'tailwindcss'

        export default {
          theme: {
            typography: {
              DEFAULT: {
                css: {
                  '--tw-prose-body': 'red',
                  color: 'var(--tw-prose-body)',
                },
              },
            },
          },
        } satisfies Config
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        @config '../tailwind.config.ts';
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }
      @config '../tailwind.config.ts';
      "
    `)

    expect(await fs.dumpFiles('tailwind.config.ts')).toMatchInlineSnapshot(`
      "
      --- tailwind.config.ts ---
      import { type Config } from 'tailwindcss'

      export default {
        theme: {
          typography: {
            DEFAULT: {
              css: {
                '--tw-prose-body': 'red',
                color: 'var(--tw-prose-body)',
              },
            },
          },
        },
      } satisfies Config
      "
    `)
  },
)

test(
  `does not upgrade JS config files with inline plugins`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': ts`
        import { type Config } from 'tailwindcss'

        export default {
          plugins: [function complexConfig() {}],
        } satisfies Config
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }
      @config '../tailwind.config.ts';
      "
    `)

    expect(await fs.dumpFiles('tailwind.config.ts')).toMatchInlineSnapshot(`
      "
      --- tailwind.config.ts ---
      import { type Config } from 'tailwindcss'

      export default {
        plugins: [function complexConfig() {}],
      } satisfies Config
      "
    `)
  },
)

test(
  `does not upgrade JS config files with non-simple screens object`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': ts`
        import { type Config } from 'tailwindcss'

        export default {
          theme: {
            screens: {
              xl: { min: '1024px', max: '1279px' },
              tall: { raw: '(min-height: 800px)' },
            },
          },
        } satisfies Config
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      /*
        The default border color has changed to \`currentColor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentColor);
        }
      }

      /*
        Form elements have a 1px border by default in Tailwind CSS v4, so we've
        added these compatibility styles to make sure everything still looks the
        same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add \`border-0\` to
        any form elements that shouldn't have a border.
      */
      @layer base {
        input:where(:not([type='button'], [type='reset'], [type='submit'])),
        select,
        textarea {
          border-width: 0;
        }
      }
      @config '../tailwind.config.ts';
      "
    `)

    expect(await fs.dumpFiles('tailwind.config.ts')).toMatchInlineSnapshot(`
      "
      --- tailwind.config.ts ---
      import { type Config } from 'tailwindcss'

      export default {
        theme: {
          screens: {
            xl: { min: '1024px', max: '1279px' },
            tall: { raw: '(min-height: 800px)' },
          },
        },
      } satisfies Config
      "
    `)
  },
)

describe('border compatibility', () => {
  test(
    'migrate border compatibility',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "@tailwindcss/upgrade": "workspace:^"
            }
          }
        `,
        'tailwind.config.ts': ts`
          import { type Config } from 'tailwindcss'

          // Empty / default config
          export default {
            theme: {
              extend: {},
            },
          } satisfies Config
        `,
        'src/input.css': css`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `,
      },
    },
    async ({ exec, fs }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
        "
        --- src/input.css ---
        @import 'tailwindcss';

        /*
          The default border color has changed to \`currentColor\` in Tailwind CSS v4,
          so we've added these compatibility styles to make sure everything still
          looks the same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add an explicit border
          color utility to any element that depends on these defaults.
        */
        @layer base {
          *,
          ::after,
          ::before,
          ::backdrop,
          ::file-selector-button {
            border-color: var(--color-gray-200, currentColor);
          }
        }

        /*
          Form elements have a 1px border by default in Tailwind CSS v4, so we've
          added these compatibility styles to make sure everything still looks the
          same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add \`border-0\` to
          any form elements that shouldn't have a border.
        */
        @layer base {
          input:where(:not([type='button'], [type='reset'], [type='submit'])),
          select,
          textarea {
            border-width: 0;
          }
        }
        "
      `)
    },
  )

  test(
    'migrate border compatibility if a custom border color is used',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "@tailwindcss/upgrade": "workspace:^"
            }
          }
        `,
        'tailwind.config.ts': ts`
          import { type Config } from 'tailwindcss'

          export default {
            theme: {
              extend: {
                borderColor: ({ colors }) => ({
                  DEFAULT: colors.blue[500],
                }),
              },
            },
          } satisfies Config
        `,
        'src/input.css': css`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `,
      },
    },
    async ({ exec, fs }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
        "
        --- src/input.css ---
        @import 'tailwindcss';

        /*
          The default border color has changed to \`currentColor\` in Tailwind CSS v4,
          so we've added these compatibility styles to make sure everything still
          looks the same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add an explicit border
          color utility to any element that depends on these defaults.
        */
        @layer base {
          *,
          ::after,
          ::before,
          ::backdrop,
          ::file-selector-button {
            border-color: oklch(0.623 0.214 259.815);
          }
        }

        /*
          Form elements have a 1px border by default in Tailwind CSS v4, so we've
          added these compatibility styles to make sure everything still looks the
          same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add \`border-0\` to
          any form elements that shouldn't have a border.
        */
        @layer base {
          input:where(:not([type='button'], [type='reset'], [type='submit'])),
          select,
          textarea {
            border-width: 0;
          }
        }
        "
      `)
    },
  )

  test(
    'migrate border compatibility if a custom border color is used, that matches the default v4 border color',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "@tailwindcss/upgrade": "workspace:^"
            }
          }
        `,
        'tailwind.config.ts': ts`
          import { type Config } from 'tailwindcss'

          export default {
            theme: {
              extend: {
                borderColor: ({ colors }) => ({
                  DEFAULT: 'currentColor',
                }),
              },
            },
          } satisfies Config
        `,
        'src/input.css': css`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `,
      },
    },
    async ({ exec, fs }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
        "
        --- src/input.css ---
        @import 'tailwindcss';

        /*
          Form elements have a 1px border by default in Tailwind CSS v4, so we've
          added these compatibility styles to make sure everything still looks the
          same as it did with Tailwind CSS v3.

          If we ever want to remove these styles, we need to add \`border-0\` to
          any form elements that shouldn't have a border.
        */
        @layer base {
          input:where(:not([type='button'], [type='reset'], [type='submit'])),
          select,
          textarea {
            border-width: 0;
          }
        }
        "
      `)
    },
  )
})
