import { describe, test } from 'vitest'
import { compile } from '..'
import plugin from '../plugin'
import { flattenColorPalette } from './flatten-color-palette'

const css = String.raw

test('Config files can add content', async ({ expect }) => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadConfig: async () => ({ content: ['./file.txt'] }),
  })

  expect(compiler.globs).toEqual([{ origin: './config.js', pattern: './file.txt' }])
})

test('Config files can change dark mode (media)', async ({ expect }) => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadConfig: async () => ({ darkMode: 'media' }),
  })

  expect(compiler.build(['dark:underline'])).toMatchInlineSnapshot(`
    ".dark\\:underline {
      @media (prefers-color-scheme: dark) {
        text-decoration-line: underline;
      }
    }
    "
  `)
})

test('Config files can change dark mode (selector)', async ({ expect }) => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadConfig: async () => ({ darkMode: 'selector' }),
  })

  expect(compiler.build(['dark:underline'])).toMatchInlineSnapshot(`
    ".dark\\:underline {
      &:where(.dark, .dark *) {
        text-decoration-line: underline;
      }
    }
    "
  `)
})

test('Config files can change dark mode (variant)', async ({ expect }) => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadConfig: async () => ({ darkMode: ['variant', '&:where(:not(.light))'] }),
  })

  expect(compiler.build(['dark:underline'])).toMatchInlineSnapshot(`
    ".dark\\:underline {
      &:where(:not(.light)) {
        text-decoration-line: underline;
      }
    }
    "
  `)
})

test('Config files can add plugins', async ({ expect }) => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadConfig: async () => ({
      plugins: [
        plugin(function ({ addUtilities }) {
          addUtilities({
            '.no-scrollbar': {
              'scrollbar-width': 'none',
            },
          })
        }),
      ],
    }),
  })

  expect(compiler.build(['no-scrollbar'])).toMatchInlineSnapshot(`
    ".no-scrollbar {
      scrollbar-width: none;
    }
    "
  `)
})

test('Plugins loaded from config files can contribute to the config', async ({ expect }) => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadConfig: async () => ({
      plugins: [
        plugin(() => {}, {
          darkMode: ['variant', '&:where(:not(.light))'],
        }),
      ],
    }),
  })

  expect(compiler.build(['dark:underline'])).toMatchInlineSnapshot(`
    ".dark\\:underline {
      &:where(:not(.light)) {
        text-decoration-line: underline;
      }
    }
    "
  `)
})

test('Config file presets can contribute to the config', async ({ expect }) => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadConfig: async () => ({
      presets: [
        {
          darkMode: ['variant', '&:where(:not(.light))'],
        },
      ],
    }),
  })

  expect(compiler.build(['dark:underline'])).toMatchInlineSnapshot(`
    ".dark\\:underline {
      &:where(:not(.light)) {
        text-decoration-line: underline;
      }
    }
    "
  `)
})

test('Config files can affect the theme', async ({ expect }) => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadConfig: async () => ({
      theme: {
        extend: {
          colors: {
            primary: '#c0ffee',
          },
        },
      },

      plugins: [
        plugin(function ({ addUtilities, theme }) {
          addUtilities({
            '.scrollbar-primary': {
              scrollbarColor: theme('colors.primary'),
            },
          })
        }),
      ],
    }),
  })

  expect(compiler.build(['bg-primary', 'scrollbar-primary'])).toMatchInlineSnapshot(`
    ".bg-primary {
      background-color: #c0ffee;
    }
    .scrollbar-primary {
      scrollbar-color: #c0ffee;
    }
    "
  `)
})

test('Variants in CSS overwrite variants from plugins', async ({ expect }) => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
    @variant dark (&:is(.my-dark));
    @variant light (&:is(.my-light));
  `

  let compiler = await compile(input, {
    loadConfig: async () => ({
      darkMode: ['variant', '&:is(.dark)'],
      plugins: [
        plugin(function ({ addVariant }) {
          addVariant('light', '&:is(.light)')
        }),
      ],
    }),
  })

  expect(compiler.build(['dark:underline', 'light:underline'])).toMatchInlineSnapshot(`
    ".dark\\:underline {
      &:is(.my-dark) {
        text-decoration-line: underline;
      }
    }
    .light\\:underline {
      &:is(.my-light) {
        text-decoration-line: underline;
      }
    }
    "
  `)
})

describe('theme callbacks', () => {
  test('tuple values from the config overwrite `@theme default` tuple-ish values from the CSS theme', async ({
    expect,
  }) => {
    let input = css`
      @theme default {
        --font-size-base: 0rem;
        --font-size-base--line-height: 1rem;
        --font-size-md: 0rem;
        --font-size-md--line-height: 1rem;
        --font-size-xl: 0rem;
        --font-size-xl--line-height: 1rem;
      }
      @theme {
        --font-size-base: 100rem;
        --font-size-md--line-height: 101rem;
      }
      @tailwind utilities;
      @config "./config.js";
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          extend: {
            fontSize: {
              base: ['200rem', { lineHeight: '201rem' }],
              md: ['200rem', { lineHeight: '201rem' }],
              xl: ['200rem', { lineHeight: '201rem' }],
            },

            // Direct access
            lineHeight: ({ theme }) => ({
              base: theme('fontSize.base[1].lineHeight'),
              md: theme('fontSize.md[1].lineHeight'),
              xl: theme('fontSize.xl[1].lineHeight'),
            }),

            // Tuple access
            typography: ({ theme }) => ({
              '[class~=lead-base]': {
                fontSize: theme('fontSize.base')[0],
                ...theme('fontSize.base')[1],
              },
              '[class~=lead-md]': {
                fontSize: theme('fontSize.md')[0],
                ...theme('fontSize.md')[1],
              },
              '[class~=lead-xl]': {
                fontSize: theme('fontSize.xl')[0],
                ...theme('fontSize.xl')[1],
              },
            }),
          },
        },

        plugins: [
          plugin(function ({ addUtilities, theme }) {
            addUtilities({
              '.prose': {
                ...theme('typography'),
              },
            })
          }),
        ],
      }),
    })

    expect(compiler.build(['leading-base', 'leading-md', 'leading-xl', 'prose']))
      .toMatchInlineSnapshot(`
      ":root {
        --font-size-base: 100rem;
        --font-size-md--line-height: 101rem;
      }
      .prose {
        [class~=lead-base] {
          font-size: 100rem;
          line-height: 201rem;
        }
        [class~=lead-md] {
          font-size: 200rem;
          line-height: 101rem;
        }
        [class~=lead-xl] {
          font-size: 200rem;
          line-height: 201rem;
        }
      }
      .leading-base {
        line-height: 201rem;
      }
      .leading-md {
        line-height: 101rem;
      }
      .leading-xl {
        line-height: 201rem;
      }
      "
    `)
  })
})

describe('theme overrides order', () => {
  test('user theme > js config > default theme', async ({ expect }) => {
    let input = css`
      @theme default {
        --color-red: red;
      }
      @theme {
        --color-blue: blue;
      }
      @tailwind utilities;
      @config "./config.js";
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          extend: {
            colors: {
              red: 'very-red',
              blue: 'very-blue',
            },
          },
        },
      }),
    })

    expect(compiler.build(['bg-red', 'bg-blue'])).toMatchInlineSnapshot(`
      ":root {
        --color-blue: blue;
      }
      .bg-blue {
        background-color: var(--color-blue, blue);
      }
      .bg-red {
        background-color: very-red;
      }
      "
    `)
  })

  test('user theme > js config > default theme (with nested object)', async ({ expect }) => {
    let input = css`
      @theme default {
        --color-slate-100: #000100;
        --color-slate-200: #000200;
        --color-slate-300: #000300;
      }
      @theme {
        --color-slate-400: #100400;
        --color-slate-500: #100500;
      }
      @tailwind utilities;
      @config "./config.js";
      @plugin "./plugin.js";
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          extend: {
            colors: {
              slate: {
                200: '#200200',
                400: '#200400',
                600: '#200600',
              },
            },
          },
        },
      }),

      loadPlugin: async () => {
        return plugin(({ matchUtilities, theme }) => {
          matchUtilities(
            {
              'hover-bg': (value) => {
                return {
                  '&:hover': {
                    backgroundColor: value,
                  },
                }
              },
            },
            { values: flattenColorPalette(theme('colors')) },
          )
        })
      },
    })

    expect(
      compiler.build([
        'bg-slate-100',
        'bg-slate-200',
        'bg-slate-300',
        'bg-slate-400',
        'bg-slate-500',
        'bg-slate-600',
        'hover-bg-slate-100',
        'hover-bg-slate-200',
        'hover-bg-slate-300',
        'hover-bg-slate-400',
        'hover-bg-slate-500',
        'hover-bg-slate-600',
      ]),
    ).toMatchInlineSnapshot(`
      ":root {
        --color-slate-100: #000100;
        --color-slate-300: #000300;
        --color-slate-400: #100400;
        --color-slate-500: #100500;
      }
      .bg-slate-100 {
        background-color: var(--color-slate-100, #000100);
      }
      .bg-slate-200 {
        background-color: #200200;
      }
      .bg-slate-300 {
        background-color: var(--color-slate-300, #000300);
      }
      .bg-slate-400 {
        background-color: var(--color-slate-400, #100400);
      }
      .bg-slate-500 {
        background-color: var(--color-slate-500, #100500);
      }
      .bg-slate-600 {
        background-color: #200600;
      }
      .hover-bg-slate-100 {
        &:hover {
          background-color: #000100;
        }
      }
      .hover-bg-slate-200 {
        &:hover {
          background-color: #200200;
        }
      }
      .hover-bg-slate-300 {
        &:hover {
          background-color: #000300;
        }
      }
      .hover-bg-slate-400 {
        &:hover {
          background-color: #100400;
        }
      }
      .hover-bg-slate-500 {
        &:hover {
          background-color: #100500;
        }
      }
      .hover-bg-slate-600 {
        &:hover {
          background-color: #200600;
        }
      }
      "
    `)
  })
})

describe('default font family compatibility', () => {
  test('overriding `fontFamily.sans` sets `--default-font-family`', async ({ expect }) => {
    let input = css`
      @theme default {
        --default-font-family: var(--font-family-sans);
        --default-font-feature-settings: var(--font-family-sans--font-feature-settings);
        --default-font-variation-settings: var(--font-family-sans--font-variation-settings);
      }
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          fontFamily: {
            sans: 'Potato Sans',
          },
        },
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`
      ":root {
        --default-font-family: Potato Sans;
        --default-font-feature-settings: normal;
        --default-font-variation-settings: normal;
      }
      .font-sans {
        font-family: Potato Sans;
      }
      "
    `)
  })

  test('overriding `fontFamily.sans[1].fontFeatureSettings` sets `--default-font-feature-settings`', async ({
    expect,
  }) => {
    let input = css`
      @theme default {
        --default-font-family: var(--font-family-sans);
        --default-font-feature-settings: var(--font-family-sans--font-feature-settings);
        --default-font-variation-settings: var(--font-family-sans--font-variation-settings);
      }
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          fontFamily: {
            sans: ['Potato Sans', { fontFeatureSettings: '"cv06"' }],
          },
        },
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`
      ":root {
        --default-font-family: Potato Sans;
        --default-font-feature-settings: "cv06";
        --default-font-variation-settings: normal;
      }
      .font-sans {
        font-family: Potato Sans;
        font-feature-settings: "cv06";
      }
      "
    `)
  })

  test('overriding `fontFamily.sans[1].fontVariationSettings` sets `--default-font-variation-settings`', async ({
    expect,
  }) => {
    let input = css`
      @theme default {
        --default-font-family: var(--font-family-sans);
        --default-font-feature-settings: var(--font-family-sans--font-feature-settings);
        --default-font-variation-settings: var(--font-family-sans--font-variation-settings);
      }
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          fontFamily: {
            sans: ['Potato Sans', { fontVariationSettings: '"XHGT" 0.7' }],
          },
        },
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`
      ":root {
        --default-font-family: Potato Sans;
        --default-font-feature-settings: normal;
        --default-font-variation-settings: "XHGT" 0.7;
      }
      .font-sans {
        font-family: Potato Sans;
        font-variation-settings: "XHGT" 0.7;
      }
      "
    `)
  })

  test('overriding `fontFeatureSettings` and `fontVariationSettings` for `fontFamily.sans` sets `--default-font-feature-settings` and `--default-font-variation-settings`', async ({
    expect,
  }) => {
    let input = css`
      @theme default {
        --default-font-family: var(--font-family-sans);
        --default-font-feature-settings: var(--font-family-sans--font-feature-settings);
        --default-font-variation-settings: var(--font-family-sans--font-variation-settings);
      }
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          fontFamily: {
            sans: [
              'Potato Sans',
              { fontFeatureSettings: '"cv06"', fontVariationSettings: '"XHGT" 0.7' },
            ],
          },
        },
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`
      ":root {
        --default-font-family: Potato Sans;
        --default-font-feature-settings: "cv06";
        --default-font-variation-settings: "XHGT" 0.7;
      }
      .font-sans {
        font-family: Potato Sans;
        font-feature-settings: "cv06";
        font-variation-settings: "XHGT" 0.7;
      }
      "
    `)
  })

  test('overriding `--font-family-sans` in `@theme` without `default` preserves the original `--default-font-*` values', async ({
    expect,
  }) => {
    let input = css`
      @theme default {
        --default-font-family: var(--font-family-sans);
        --default-font-feature-settings: var(--font-family-sans--font-feature-settings);
        --default-font-variation-settings: var(--font-family-sans--font-variation-settings);
      }
      @config "./config.js";
      @theme {
        --font-family-sans: Sandwich Sans;
      }
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          fontFamily: {
            sans: 'Potato Sans',
          },
        },
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`
      ":root {
        --default-font-family: var(--font-family-sans);
        --default-font-feature-settings: var(--font-family-sans--font-feature-settings);
        --default-font-variation-settings: var(--font-family-sans--font-variation-settings);
        --font-family-sans: Sandwich Sans;
      }
      .font-sans {
        font-family: var(--font-family-sans, Sandwich Sans);
      }
      "
    `)
  })

  test('overriding `fontFamily.sans` in a config file with an array sets `--default-font-family`', async ({
    expect,
  }) => {
    let input = css`
      @theme default {
        --default-font-family: var(--font-family-sans);
        --default-font-feature-settings: var(--font-family-sans--font-feature-settings);
        --default-font-variation-settings: var(--font-family-sans--font-variation-settings);
      }
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
          },
        },
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`
      ":root {
        --default-font-family: Inter, system-ui, sans-serif;
        --default-font-feature-settings: normal;
        --default-font-variation-settings: normal;
      }
      .font-sans {
        font-family: Inter, system-ui, sans-serif;
      }
      "
    `)
  })

  test('overriding `fontFamily.sans` in a config file with an unexpected type is ignored', async ({
    expect,
  }) => {
    let input = css`
      @theme default {
        --default-font-family: var(--font-family-sans);
        --default-font-feature-settings: var(--font-family-sans--font-feature-settings);
        --default-font-variation-settings: var(--font-family-sans--font-variation-settings);
      }
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          fontFamily: {
            sans: { foo: 'bar', banana: 'sandwich' },
          },
        },
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`
      ":root {
        --default-font-family: var(--font-family-sans);
        --default-font-feature-settings: var(--font-family-sans--font-feature-settings);
        --default-font-variation-settings: var(--font-family-sans--font-variation-settings);
      }
      "
    `)
  })

  test('overriding `fontFamily.mono` sets `--default-mono-font-family`', async ({ expect }) => {
    let input = css`
      @theme default {
        --default-mono-font-family: var(--font-family-mono);
        --default-mono-font-feature-settings: var(--font-family-mono--font-feature-settings);
        --default-mono-font-variation-settings: var(--font-family-mono--font-variation-settings);
      }
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          fontFamily: {
            mono: 'Potato Mono',
          },
        },
      }),
    })

    expect(compiler.build(['font-mono'])).toMatchInlineSnapshot(`
      ":root {
        --default-mono-font-family: Potato Mono;
        --default-mono-font-feature-settings: normal;
        --default-mono-font-variation-settings: normal;
      }
      .font-mono {
        font-family: Potato Mono;
      }
      "
    `)
  })

  test('overriding `fontFamily.mono[1].fontFeatureSettings` sets `--default-mono-font-feature-settings`', async ({
    expect,
  }) => {
    let input = css`
      @theme default {
        --default-mono-font-family: var(--font-family-mono);
        --default-mono-font-feature-settings: var(--font-family-mono--font-feature-settings);
        --default-mono-font-variation-settings: var(--font-family-mono--font-variation-settings);
      }
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          fontFamily: {
            mono: ['Potato Mono', { fontFeatureSettings: '"cv06"' }],
          },
        },
      }),
    })

    expect(compiler.build(['font-mono'])).toMatchInlineSnapshot(`
      ":root {
        --default-mono-font-family: Potato Mono;
        --default-mono-font-feature-settings: "cv06";
        --default-mono-font-variation-settings: normal;
      }
      .font-mono {
        font-family: Potato Mono;
        font-feature-settings: "cv06";
      }
      "
    `)
  })

  test('overriding `fontFamily.mono[1].fontVariationSettings` sets `--default-mono-font-variation-settings`', async ({
    expect,
  }) => {
    let input = css`
      @theme default {
        --default-mono-font-family: var(--font-family-mono);
        --default-mono-font-feature-settings: var(--font-family-mono--font-feature-settings);
        --default-mono-font-variation-settings: var(--font-family-mono--font-variation-settings);
      }
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          fontFamily: {
            mono: ['Potato Mono', { fontVariationSettings: '"XHGT" 0.7' }],
          },
        },
      }),
    })

    expect(compiler.build(['font-mono'])).toMatchInlineSnapshot(`
      ":root {
        --default-mono-font-family: Potato Mono;
        --default-mono-font-feature-settings: normal;
        --default-mono-font-variation-settings: "XHGT" 0.7;
      }
      .font-mono {
        font-family: Potato Mono;
        font-variation-settings: "XHGT" 0.7;
      }
      "
    `)
  })

  test('overriding `fontFeatureSettings` and `fontVariationSettings` for `fontFamily.mono` sets `--default-mono-font-feature-settings` and `--default-mono-font-variation-settings`', async ({
    expect,
  }) => {
    let input = css`
      @theme default {
        --default-mono-font-family: var(--font-family-mono);
        --default-mono-font-feature-settings: var(--font-family-mono--font-feature-settings);
        --default-mono-font-variation-settings: var(--font-family-mono--font-variation-settings);
      }
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          fontFamily: {
            mono: [
              'Potato Mono',
              { fontFeatureSettings: '"cv06"', fontVariationSettings: '"XHGT" 0.7' },
            ],
          },
        },
      }),
    })

    expect(compiler.build(['font-mono'])).toMatchInlineSnapshot(`
      ":root {
        --default-mono-font-family: Potato Mono;
        --default-mono-font-feature-settings: "cv06";
        --default-mono-font-variation-settings: "XHGT" 0.7;
      }
      .font-mono {
        font-family: Potato Mono;
        font-feature-settings: "cv06";
        font-variation-settings: "XHGT" 0.7;
      }
      "
    `)
  })

  test('overriding `--font-family-mono` in `@theme` without `default` preserves the original `--default-mono-font-*` values', async ({
    expect,
  }) => {
    let input = css`
      @theme default {
        --default-mono-font-family: var(--font-family-mono);
        --default-mono-font-feature-settings: var(--font-family-mono--font-feature-settings);
        --default-mono-font-variation-settings: var(--font-family-mono--font-variation-settings);
      }
      @config "./config.js";
      @theme {
        --font-family-mono: Sandwich Mono;
      }
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          fontFamily: {
            mono: 'Potato Mono',
          },
        },
      }),
    })

    expect(compiler.build(['font-mono'])).toMatchInlineSnapshot(`
      ":root {
        --default-mono-font-family: var(--font-family-mono);
        --default-mono-font-feature-settings: var(--font-family-mono--font-feature-settings);
        --default-mono-font-variation-settings: var(--font-family-mono--font-variation-settings);
        --font-family-mono: Sandwich Mono;
      }
      .font-mono {
        font-family: var(--font-family-mono, Sandwich Mono);
      }
      "
    `)
  })

  test('overriding `fontFamily.mono` in a config file with an unexpected type is ignored', async ({
    expect,
  }) => {
    let input = css`
      @theme default {
        --default-mono-font-family: var(--font-family-mono);
        --default-mono-font-feature-settings: var(--font-family-mono--font-feature-settings);
        --default-mono-font-variation-settings: var(--font-family-mono--font-variation-settings);
      }
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          fontFamily: {
            mono: { foo: 'bar', banana: 'sandwich' },
          },
        },
      }),
    })

    expect(compiler.build(['font-mono'])).toMatchInlineSnapshot(`
      ":root {
        --default-mono-font-family: var(--font-family-mono);
        --default-mono-font-feature-settings: var(--font-family-mono--font-feature-settings);
        --default-mono-font-variation-settings: var(--font-family-mono--font-variation-settings);
      }
      "
    `)
  })
})
