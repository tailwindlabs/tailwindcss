import path from 'node:path'
import { describe } from 'vitest'
import { css, html, json, test, ts } from '../utils'

test(
  `upgrade JS config files with flat theme values, darkMode, and content fields`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
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
              steel: 'rgb(70 130 180 / <alpha-value>)',
              smoke: 'rgba(245, 245, 245, var(--smoke-alpha, <alpha-value>))',
            },
            fontSize: {
              xs: ['0.75rem', { lineHeight: '1rem' }],
              sm: ['0.875rem', { lineHeight: '1.5rem' }],
              base: ['1rem', { lineHeight: '2rem' }],
              lg: ['1.125rem', '2.5rem'],
              xl: ['1.5rem', '3rem', 'invalid'],
              '2xl': ['2rem'],
            },
            width: {
              px: '1px',
              auto: 'auto',
              1: '0.25rem',
              1.5: '0.375rem',
              2: '0.5rem',
              2.5: '0.625rem',
              3: '0.75rem',
              3.5: '0.875rem',
              4: '1rem',
              5: '1.25rem',
              6: '1.5rem',
              8: '2rem',
              10: '2.5rem',
              11: '2.75rem',
              12: '3rem',
              16: '4rem',
              24: '6rem',
              32: '8rem',
              40: '10rem',
              48: '12rem',
              64: '16rem',
              80: '20rem',
              96: '24rem',
              128: '32rem',

              full: '100%',
              0: '0%',
              '1/2': '50%',
              '1/3': 'calc(100% / 3)',
              '2/3': 'calc(100% / 3 * 2)',
              '1/4': '25%',
              '3/4': '75%',
              '1/5': '20%',
              '2/5': '40%',
              '3/5': '60%',
              '4/5': '80%',
              '1/6': 'calc(100% / 6)',
              '5/6': 'calc(100% / 6 * 5)',
              '1/7': 'calc(100% / 7)',
              '1/10': 'calc(100% / 10)',
              '3/10': 'calc(100% / 10 * 3)',
              '7/10': 'calc(100% / 10 * 7)',
              '9/10': 'calc(100% / 10 * 9)',
              screen: '100vw',

              'full-minus-80': 'calc(100% - 20rem)',
              'full-minus-96': 'calc(100% - 24rem)',

              '225px': '225px',
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
              letterSpacing: {
                superWide: '0.25em',
              },
              lineHeight: {
                superLoose: '3',
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
      // prettier-ignore
      'src/test.js': ts`
        export default {
          'shouldNotMigrate': !border.test + '',
          'filter': 'drop-shadow(0 0 0.5rem #000)',
        }
      `,
      'src/index.html': html`
       <div
          class="[letter-spacing:theme(letterSpacing.superWide)] [line-height:theme(lineHeight.superLoose)]"
        ></div>
      `,
      'node_modules/my-external-lib/src/template.html': html`
        <div class="text-red-500">
          Hello world!
        </div>
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.{css,js,html}')).toMatchInlineSnapshot(`
      "
      --- src/index.html ---
      <div
         class="[letter-spacing:var(--tracking-super-wide)] [line-height:var(--leading-super-loose)]"
       ></div>

      --- src/input.css ---
      @import 'tailwindcss';

      @source '../node_modules/my-external-lib/**/*.{html}';

      @custom-variant dark (&:where(.dark, .dark *));

      @theme {
        --shadow-*: initial;
        --shadow-sm: 0 2px 6px rgb(15 23 42 / 0.08);

        --color-*: initial;
        --color-red-400: #f87171;
        --color-red-500: #ef4444;
        --color-red-600: #dc2626;

        --color-steel: rgb(70 130 180);
        --color-smoke: rgba(245, 245, 245, var(--smoke-alpha, 1));

        --text-*: initial;
        --text-xs: 0.75rem;
        --text-xs--line-height: 1rem;
        --text-sm: 0.875rem;
        --text-sm--line-height: 1.5rem;
        --text-base: 1rem;
        --text-base--line-height: 2rem;
        --text-lg: 1.125rem;
        --text-lg--line-height: 2.5rem;
        --text-xl: 1.5rem;
        --text-xl--line-height: 3rem;
        --text-2xl: 2rem;

        --width-*: initial;
        --width-0: 0%;
        --width-1: 0.25rem;
        --width-2: 0.5rem;
        --width-3: 0.75rem;
        --width-4: 1rem;
        --width-5: 1.25rem;
        --width-6: 1.5rem;
        --width-8: 2rem;
        --width-10: 2.5rem;
        --width-11: 2.75rem;
        --width-12: 3rem;
        --width-16: 4rem;
        --width-24: 6rem;
        --width-32: 8rem;
        --width-40: 10rem;
        --width-48: 12rem;
        --width-64: 16rem;
        --width-80: 20rem;
        --width-96: 24rem;
        --width-128: 32rem;
        --width-px: 1px;
        --width-auto: auto;
        --width-1_5: 0.375rem;
        --width-2_5: 0.625rem;
        --width-3_5: 0.875rem;
        --width-full: 100%;
        --width-1\\/2: 50%;
        --width-1\\/3: calc(100% / 3);
        --width-2\\/3: calc(100% / 3 * 2);
        --width-1\\/4: 25%;
        --width-3\\/4: 75%;
        --width-1\\/5: 20%;
        --width-2\\/5: 40%;
        --width-3\\/5: 60%;
        --width-4\\/5: 80%;
        --width-1\\/6: calc(100% / 6);
        --width-5\\/6: calc(100% / 6 * 5);
        --width-1\\/7: calc(100% / 7);
        --width-1\\/10: calc(100% / 10);
        --width-3\\/10: calc(100% / 10 * 3);
        --width-7\\/10: calc(100% / 10 * 7);
        --width-9\\/10: calc(100% / 10 * 9);
        --width-screen: 100vw;
        --width-full-minus-80: calc(100% - 20rem);
        --width-full-minus-96: calc(100% - 24rem);
        --width-225px: 225px;

        --font-sans: Inter, system-ui, sans-serif;
        --font-display:
          Cabinet Grotesk, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji',
          'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';

        --radius-4xl: 2rem;

        --animate-spin-clockwise: spin-clockwise 1s linear infinite;
        --animate-spin-counterclockwise: spin-counterclockwise 1s linear infinite;

        --tracking-super-wide: 0.25em;

        --leading-super-loose: 3;

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

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      --- src/test.js ---
      export default {
        'shouldNotMigrate': !border.test + '',
        'filter': 'drop-shadow(0 0 0.5rem #000)',
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
            "tailwindcss": "^3",
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
          darkMode: [
            'variant',
            [
              '@media not print { .dark & }',
              '@media not eink { .dark & }',
              '&:where(.dark, .dark *)',
            ],
          ],
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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

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

      @custom-variant dark {
        @media not print {
          .dark & {
            @slot;
          }
        }
        @media not eink {
          .dark & {
            @slot;
          }
        }
        &:where(.dark, .dark *) {
          @slot;
        }
      }

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
          border-color: var(--color-gray-200, currentcolor);
        }
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
            "tailwindcss": "^3",
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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.{css,ts}')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      @theme {
        --color-gray-50: oklch(98.5% 0 0);
        --color-gray-100: oklch(97% 0 0);
        --color-gray-200: oklch(92.2% 0 0);
        --color-gray-300: oklch(87% 0 0);
        --color-gray-400: oklch(70.8% 0 0);
        --color-gray-500: oklch(55.6% 0 0);
        --color-gray-600: oklch(43.9% 0 0);
        --color-gray-700: oklch(37.1% 0 0);
        --color-gray-800: oklch(26.9% 0 0);
        --color-gray-900: oklch(20.5% 0 0);
        --color-gray-950: oklch(14.5% 0 0);
      }

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
          border-color: var(--color-gray-200, currentcolor);
        }
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
            "tailwindcss": "^3",
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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      @config '../tailwind.config.ts';

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
          border-color: var(--color-gray-200, currentcolor);
        }
      }
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
            "tailwindcss": "^3",
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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      @config '../tailwind.config.ts';

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
          border-color: var(--color-gray-200, currentcolor);
        }
      }
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
            "tailwindcss": "^3",
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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      @config '../tailwind.config.ts';

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
          border-color: var(--color-gray-200, currentcolor);
        }
      }
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

test(
  'multi-root project',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,

      // Project A
      'project-a/tailwind.config.ts': ts`
        export default {
          content: {
            relative: true,
            files: ['./src/**/*.html'],
          },
          theme: {
            extend: {
              colors: {
                primary: 'red',
              },
            },
          },
        }
      `,
      'project-a/src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        @config "../tailwind.config.ts";
      `,
      'project-a/src/index.html': html`<div class="!text-primary"></div>`,

      // Project B
      'project-b/tailwind.config.ts': ts`
        export default {
          content: {
            relative: true,
            files: ['./src/**/*.html'],
          },
          theme: {
            extend: {
              colors: {
                primary: 'blue',
              },
            },
          },
        }
      `,
      'project-b/src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        @config "../tailwind.config.ts";
      `,
      'project-b/src/index.html': html`<div class="!text-primary"></div>`,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('project-{a,b}/**/*.{css,ts}')).toMatchInlineSnapshot(`
      "
      --- project-a/src/input.css ---
      @import 'tailwindcss';

      @theme {
        --color-primary: red;
      }

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      --- project-b/src/input.css ---
      @import 'tailwindcss';

      @theme {
        --color-primary: blue;
      }

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
          border-color: var(--color-gray-200, currentcolor);
        }
      }
      "
    `)
  },
)

test(
  'migrate sources when pointing to folders outside the project root',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,

      'frontend/tailwind.config.ts': ts`
        export default {
          content: {
            relative: true,
            files: ['./src/**/*.html', '../backend/mails/**/*.blade.php'],
          },
          theme: {
            extend: {
              colors: {
                primary: 'red',
              },
            },
          },
        }
      `,
      'frontend/src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        @config "../tailwind.config.ts";
      `,
      'frontend/src/index.html': html`<div class="!text-primary"></div>`,

      'backend/mails/welcome.blade.php': html`<div class="!text-primary"></div>`,
    },
  },
  async ({ root, exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade', {
      cwd: path.join(root, 'frontend'),
    })

    expect(await fs.dumpFiles('frontend/**/*.css')).toMatchInlineSnapshot(`
      "
      --- frontend/src/input.css ---
      @import 'tailwindcss';

      @source '../../backend/mails/**/*.blade.php';

      @theme {
        --color-primary: red;
      }

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
          border-color: var(--color-gray-200, currentcolor);
        }
      }
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
              "tailwindcss": "^3",
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
    async ({ exec, fs, expect }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
        "
        --- src/input.css ---
        @import 'tailwindcss';

        /*
          The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
            border-color: var(--color-gray-200, currentcolor);
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
              "tailwindcss": "^3",
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
    async ({ exec, fs, expect }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
        "
        --- src/input.css ---
        @import 'tailwindcss';

        /*
          The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
            border-color: oklch(62.3% 0.214 259.815);
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
              "tailwindcss": "^3",
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
                  DEFAULT: 'currentcolor',
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
    async ({ exec, fs, expect }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
        "
        --- src/input.css ---
        @import 'tailwindcss';
        "
      `)
    },
  )

  test(
    'migrate border compatibility in the file that uses the `@import "tailwindcss"` import',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "tailwindcss": "^3",
              "@tailwindcss/upgrade": "workspace:^"
            }
          }
        `,
        'tailwind.config.ts': ts`
          import { type Config } from 'tailwindcss'

          export default {
            theme: {},
          } satisfies Config
        `,
        'src/input.css': css`@import './tailwind.css';`,
        'src/tailwind.css': css`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `,
      },
    },
    async ({ exec, fs, expect }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
        "
        --- src/input.css ---
        @import './tailwind.css';

        --- src/tailwind.css ---
        @import 'tailwindcss';

        /*
          The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
            border-color: var(--color-gray-200, currentcolor);
          }
        }
        "
      `)
    },
  )

  test(
    'migrate border compatibility in the file that uses the `@import "tailwindcss/preflight"` import',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "tailwindcss": "^3",
              "@tailwindcss/upgrade": "workspace:^"
            }
          }
        `,
        'tailwind.config.ts': ts`
          import { type Config } from 'tailwindcss'

          export default {
            theme: {},
          } satisfies Config
        `,
        'src/input.css': css`
          @import './base.css';
          @import './my-base.css';
          @import './utilities.css';
        `,
        'src/base.css': css`@tailwind base;`,
        'src/utilities.css': css`
          @tailwind components;
          @tailwind utilities;
        `,
        'src/my-base.css': css`
          @layer base {
            html {
              color: black;
            }
          }
        `,
      },
    },
    async ({ exec, fs, expect }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
        "
        --- src/base.css ---
        @import 'tailwindcss/theme' layer(theme);
        @import 'tailwindcss/preflight' layer(base);

        /*
          The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
            border-color: var(--color-gray-200, currentcolor);
          }
        }

        --- src/input.css ---
        @import './base.css';
        @import './my-base.css';
        @import './utilities.css';

        --- src/my-base.css ---
        @layer base {
          html {
            color: black;
          }
        }

        --- src/utilities.css ---
        @import 'tailwindcss/utilities' layer(utilities);
        "
      `)
    },
  )

  test(
    'migrates extended spacing keys',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "tailwindcss": "^3",
              "@tailwindcss/upgrade": "workspace:^"
            }
          }
        `,
        'tailwind.config.ts': ts`
          import { type Config } from 'tailwindcss'

          export default {
            content: ['./src/**/*.html'],
            theme: {
              extend: {
                spacing: {
                  2: '0.5rem',
                  4.5: '1.125rem',
                  5.5: '1.375em', // Units are different from --spacing scale
                  13: '3.25rem',
                  100: '100px',
                  miami: '1337px',
                },
              },
            },
          } satisfies Config
        `,
        'src/input.css': css`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;

          .container {
            width: theme(spacing.2);
            width: theme(spacing[4.5]);
            width: theme(spacing[5.5]);
            width: theme(spacing[13]);
            width: theme(spacing[100]);
            width: theme(spacing.miami);
          }
        `,
        'src/index.html': html`
          <div
            class="[width:theme(spacing.2)]
              [width:theme(spacing[4.5])]
              [width:theme(spacing[5.5])]
              [width:theme(spacing[13])]
              [width:theme(spacing[100])]
              [width:theme(spacing.miami)]"
          ></div>
        `,
      },
    },
    async ({ exec, fs, expect }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.{css,html}')).toMatchInlineSnapshot(`
        "
        --- src/index.html ---
        <div
          class="[width:--spacing(2)]
            [width:--spacing(4.5)]
            [width:var(--spacing-5_5)]
            [width:--spacing(13)]
            [width:var(--spacing-100)]
            [width:var(--spacing-miami)]"
        ></div>

        --- src/input.css ---
        @import 'tailwindcss';

        @theme {
          --spacing-100: 100px;
          --spacing-5_5: 1.375em;
          --spacing-miami: 1337px;
        }

        /*
          The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
            border-color: var(--color-gray-200, currentcolor);
          }
        }

        .container {
          width: --spacing(2);
          width: --spacing(4.5);
          width: var(--spacing-5_5);
          width: --spacing(13);
          width: var(--spacing-100);
          width: var(--spacing-miami);
        }
        "
      `)
    },
  )

  test(
    'retains overwriting spacing scale',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "tailwindcss": "^3",
              "@tailwindcss/upgrade": "workspace:^"
            }
          }
        `,
        'tailwind.config.ts': ts`
          import { type Config } from 'tailwindcss'

          export default {
            content: ['./src/**/*.html'],
            theme: {
              spacing: {
                2: '0.5rem',
                4.5: '1.125rem',
                5.5: '1.375em',
                13: '3.25rem',
                100: '100px',
                miami: '1337px',
              },
            },
          } satisfies Config
        `,
        'src/input.css': css`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;

          .container {
            width: theme(spacing.2);
            width: theme(spacing[4.5]);
            width: theme(spacing[5.5]);
            width: theme(spacing[13]);
            width: theme(spacing[100]);
            width: theme(spacing.miami);
          }
        `,
        'src/index.html': html`
          <div
            class="[width:theme(spacing.2)]
              [width:theme(spacing[4.5])]
              [width:theme(spacing[5.5])]
              [width:theme(spacing[13])]
              [width:theme(spacing[100])]
              [width:theme(spacing.miami)]"
          ></div>
        `,
      },
    },
    async ({ exec, fs, expect }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.{css,html}')).toMatchInlineSnapshot(`
        "
        --- src/index.html ---
        <div
          class="[width:var(--spacing-2)]
            [width:var(--spacing-4_5)]
            [width:var(--spacing-5_5)]
            [width:var(--spacing-13)]
            [width:var(--spacing-100)]
            [width:var(--spacing-miami)]"
        ></div>

        --- src/input.css ---
        @import 'tailwindcss';

        @theme {
          --spacing-*: initial;
          --spacing-2: 0.5rem;
          --spacing-13: 3.25rem;
          --spacing-100: 100px;
          --spacing-4_5: 1.125rem;
          --spacing-5_5: 1.375em;
          --spacing-miami: 1337px;
        }

        /*
          The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
            border-color: var(--color-gray-200, currentcolor);
          }
        }

        .container {
          width: var(--spacing-2);
          width: var(--spacing-4_5);
          width: var(--spacing-5_5);
          width: var(--spacing-13);
          width: var(--spacing-100);
          width: var(--spacing-miami);
        }
        "
      `)
    },
  )

  test(
    'migrates `container` component configurations',
    {
      fs: {
        'package.json': json`
          {
            "dependencies": {
              "tailwindcss": "^3",
              "@tailwindcss/upgrade": "workspace:^"
            }
          }
        `,
        'tailwind.config.ts': ts`
          import { type Config } from 'tailwindcss'

          export default {
            content: ['./src/**/*.html'],
            theme: {
              container: {
                center: true,
                padding: {
                  DEFAULT: '2rem',
                  '2xl': '4rem',
                },
                screens: {
                  md: '48rem', // Matches a default --breakpoint
                  xl: '1280px',
                  '2xl': '1536px',
                },
              },
            },
          } satisfies Config
        `,
        'src/input.css': css`
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `,
        'src/index.html': html`
          <div class="container"></div>
        `,
      },
    },
    async ({ exec, fs, expect }) => {
      await exec('npx @tailwindcss/upgrade')

      expect(await fs.dumpFiles('src/**/*.{css,html}')).toMatchInlineSnapshot(`
        "
        --- src/index.html ---
        <div class="container"></div>

        --- src/input.css ---
        @import 'tailwindcss';

        @utility container {
          margin-inline: auto;
          padding-inline: 2rem;
          @media (width >= --theme(--breakpoint-sm)) {
            max-width: none;
          }
          @media (width >= 48rem) {
            max-width: 48rem;
          }
          @media (width >= 1280px) {
            max-width: 1280px;
          }
          @media (width >= 1536px) {
            max-width: 1536px;
            padding-inline: 4rem;
          }
        }

        /*
          The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
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
            border-color: var(--color-gray-200, currentcolor);
          }
        }
        "
      `)
    },
  )
})
