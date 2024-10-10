import { expect } from 'vitest'
import { css, json, test, ts } from '../utils'

test(
  `upgrades a simple JS config file to CSS`,
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
          content: ['./src/**/*.{html,js}'],
          theme: {
            boxShadow: {
              sm: '0 2px 6px rgb(15 23 42 / 0.08)',
            },
            colors: {
              red: {
                500: '#ef4444',
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
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- src/input.css ---
      @import 'tailwindcss';

      @source './**/*.{html,js}';

      @variant dark (&:where(.dark, .dark *));

      @theme {
        --box-shadow-*: initial;
        --box-shadow-sm: 0 2px 6px rgb(15 23 42 / 0.08);

        --color-*: initial;
        --color-red-500: #ef4444;

        --font-size-*: initial;
        --font-size-xs: 0.75rem;
        --font-size-xs--line-height: 1rem;
        --font-size-sm: 0.875rem;
        --font-size-sm--line-height: 1.5rem;
        --font-size-base: 1rem;
        --font-size-base--line-height: 2rem;

        --color-red-600: #dc2626;

        --font-family-sans: Inter, system-ui, sans-serif;
        --font-family-display: Cabinet Grotesk, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

        --border-radius-4xl: 2rem;
      }
      "
    `)

    expect((await fs.dumpFiles('tailwind.config.ts')).trim()).toBe('')
  },
)
