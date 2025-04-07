import { describe, expect, test, vi } from 'vitest'
import { compile, type Config } from '..'
import { default as plugin } from '../plugin'
import flattenColorPalette from './flatten-color-palette'

const css = String.raw

test('Config files can add content', async () => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadModule: async () => ({ module: { content: ['./file.txt'] }, base: '/root' }),
  })

  expect(compiler.sources).toEqual([{ base: '/root', pattern: './file.txt', negated: false }])
})

test('Config files can change dark mode (media)', async () => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadModule: async () => ({ module: { darkMode: 'media' }, base: '/root' }),
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

test('Config files can change dark mode (selector)', async () => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadModule: async () => ({ module: { darkMode: 'selector' }, base: '/root' }),
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

test('Config files can change dark mode (variant)', async () => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadModule: async () => ({
      module: { darkMode: ['variant', '&:where(:not(.light))'] },
      base: '/root',
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

test('Config files can add plugins', async () => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadModule: async () => ({
      module: {
        plugins: [
          plugin(function ({ addUtilities }) {
            addUtilities({
              '.no-scrollbar': {
                'scrollbar-width': 'none',
              },
            })
          }),
        ],
      },
      base: '/root',
    }),
  })

  expect(compiler.build(['no-scrollbar'])).toMatchInlineSnapshot(`
    ".no-scrollbar {
      scrollbar-width: none;
    }
    "
  `)
})

test('Plugins loaded from config files can contribute to the config', async () => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadModule: async () => ({
      module: {
        plugins: [
          plugin(() => {}, {
            darkMode: ['variant', '&:where(:not(.light))'],
          }),
        ],
      },
      base: '/root',
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

test('Config file presets can contribute to the config', async () => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadModule: async () => ({
      module: {
        presets: [
          {
            darkMode: ['variant', '&:where(:not(.light))'],
          },
        ],
      },
      base: '/root',
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

test('Config files can affect the theme', async () => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadModule: async () => ({
      module: {
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
      },
      base: '/root',
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

test('Variants in CSS overwrite variants from plugins', async () => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
    @custom-variant dark (&:is(.my-dark));
    @custom-variant light (&:is(.my-light));
  `

  let compiler = await compile(input, {
    loadModule: async () => ({
      module: {
        darkMode: ['variant', '&:is(.dark)'],
        plugins: [
          plugin(function ({ addVariant }) {
            addVariant('light', '&:is(.light)')
          }),
        ],
      },
      base: '/root',
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
        --text-base: 0rem;
        --text-base--line-height: 1rem;
        --text-md: 0rem;
        --text-md--line-height: 1rem;
        --text-xl: 0rem;
        --text-xl--line-height: 1rem;
      }
      @theme {
        --text-base: 100rem;
        --text-md--line-height: 101rem;
      }
      @tailwind utilities;
      @config "./config.js";
    `

    let compiler = await compile(input, {
      loadModule: async () => ({
        module: {
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
        } satisfies Config,
        base: '/root',
      }),
    })

    expect(compiler.build(['leading-base', 'leading-md', 'leading-xl', 'prose']))
      .toMatchInlineSnapshot(`
        "@layer properties;
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
          --tw-leading: 201rem;
          line-height: 201rem;
        }
        .leading-md {
          --tw-leading: 101rem;
          line-height: 101rem;
        }
        .leading-xl {
          --tw-leading: 201rem;
          line-height: 201rem;
        }
        @property --tw-leading {
          syntax: "*";
          inherits: false;
        }
        @layer properties {
          @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
            *, ::before, ::after, ::backdrop {
              --tw-leading: initial;
            }
          }
        }
        "
      `)
  })
})

describe('theme overrides order', () => {
  test('user theme > js config > default theme', async () => {
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
      loadModule: async () => ({
        module: {
          theme: {
            extend: {
              colors: {
                red: 'very-red',
                blue: 'very-blue',
              },
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['bg-red', 'bg-blue'])).toMatchInlineSnapshot(`
      ":root, :host {
        --color-blue: blue;
      }
      .bg-blue {
        background-color: var(--color-blue);
      }
      .bg-red {
        background-color: very-red;
      }
      "
    `)
  })

  test('user theme > js config > default theme (with nested object)', async () => {
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
      loadModule: async (id) => {
        if (id.includes('config.js')) {
          return {
            module: {
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
            } satisfies Config,
            base: '/root',
          }
        } else {
          return {
            module: plugin(({ matchUtilities, theme }) => {
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
            }),
            base: '/root',
          }
        }
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
      ":root, :host {
        --color-slate-100: #000100;
        --color-slate-300: #000300;
        --color-slate-400: #100400;
        --color-slate-500: #100500;
      }
      .bg-slate-100 {
        background-color: var(--color-slate-100);
      }
      .bg-slate-200 {
        background-color: #200200;
      }
      .bg-slate-300 {
        background-color: var(--color-slate-300);
      }
      .bg-slate-400 {
        background-color: var(--color-slate-400);
      }
      .bg-slate-500 {
        background-color: var(--color-slate-500);
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
  test('overriding `fontFamily.sans` sets `--default-font-family`', async () => {
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
      loadModule: async () => ({
        module: {
          theme: {
            fontFamily: {
              sans: 'Potato Sans',
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`
      ".font-sans {
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
      loadModule: async () => ({
        module: {
          theme: {
            fontFamily: {
              sans: ['Potato Sans', { fontFeatureSettings: '"cv06"' }],
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`
      ".font-sans {
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
      loadModule: async () => ({
        module: {
          theme: {
            fontFamily: {
              sans: ['Potato Sans', { fontVariationSettings: '"XHGT" 0.7' }],
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`
      ".font-sans {
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
      loadModule: async () => ({
        module: {
          theme: {
            fontFamily: {
              sans: [
                'Potato Sans',
                { fontFeatureSettings: '"cv06"', fontVariationSettings: '"XHGT" 0.7' },
              ],
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`
      ".font-sans {
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
        --font-sans: Sandwich Sans;
      }
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadModule: async () => ({
        module: {
          theme: {
            fontFamily: {
              sans: 'Potato Sans',
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`
      ":root, :host {
        --font-sans: Sandwich Sans;
      }
      .font-sans {
        font-family: var(--font-sans);
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
      loadModule: async () => ({
        module: {
          theme: {
            fontFamily: {
              sans: ['Inter', 'system-ui', 'sans-serif'],
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`
      ".font-sans {
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
      loadModule: async () => ({
        module: {
          theme: {
            fontFamily: {
              sans: { foo: 'bar', banana: 'sandwich' },
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['font-sans'])).toMatchInlineSnapshot(`""`)
  })

  test('overriding `fontFamily.mono` sets `--default-mono-font-family`', async () => {
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
      loadModule: async () => ({
        module: {
          theme: {
            fontFamily: {
              mono: 'Potato Mono',
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['font-mono'])).toMatchInlineSnapshot(`
      ".font-mono {
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
      loadModule: async () => ({
        module: {
          theme: {
            fontFamily: {
              mono: ['Potato Mono', { fontFeatureSettings: '"cv06"' }],
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['font-mono'])).toMatchInlineSnapshot(`
      ".font-mono {
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
      loadModule: async () => ({
        module: {
          theme: {
            fontFamily: {
              mono: ['Potato Mono', { fontVariationSettings: '"XHGT" 0.7' }],
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['font-mono'])).toMatchInlineSnapshot(`
      ".font-mono {
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
        --default-mono-font-family: var(--font-mono);
        --default-mono-font-feature-settings: var(--font-mono--font-feature-settings);
        --default-mono-font-variation-settings: var(--font-mono--font-variation-settings);
      }
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadModule: async () => ({
        module: {
          theme: {
            fontFamily: {
              mono: [
                'Potato Mono',
                { fontFeatureSettings: '"cv06"', fontVariationSettings: '"XHGT" 0.7' },
              ],
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['font-mono'])).toMatchInlineSnapshot(`
      ".font-mono {
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
        --default-mono-font-family: var(--font-mono);
        --default-mono-font-feature-settings: var(--font-mono--font-feature-settings);
        --default-mono-font-variation-settings: var(--font-mono--font-variation-settings);
      }
      @config "./config.js";
      @theme {
        --font-mono: Sandwich Mono;
      }
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadModule: async () => ({
        module: {
          theme: {
            fontFamily: {
              mono: 'Potato Mono',
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['font-mono'])).toMatchInlineSnapshot(`
      ":root, :host {
        --font-mono: Sandwich Mono;
      }
      .font-mono {
        font-family: var(--font-mono);
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
      loadModule: async () => ({
        module: {
          theme: {
            fontFamily: {
              mono: { foo: 'bar', banana: 'sandwich' },
            },
          },
        },
        base: '/root',
      }),
    })

    expect(compiler.build(['font-mono'])).toMatchInlineSnapshot(`""`)
  })
})

test('creates variants for `data`, `supports`, and `aria` theme options at the same level as the core utility ', async () => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";
  `

  let compiler = await compile(input, {
    loadModule: async () => ({
      module: {
        theme: {
          extend: {
            aria: {
              polite: 'live="polite"',
            },
            supports: {
              'child-combinator': 'selector(h2 > p)',
              foo: 'bar',
            },
            data: {
              checked: 'ui~="checked"',
            },
          },
        },
      },
      base: '/root',
    }),
  })

  expect(
    compiler.build([
      'aria-polite:underline',
      'supports-child-combinator:underline',
      'supports-foo:underline',
      'data-checked:underline',

      // Ensure core variants still work
      'aria-hidden:flex',
      'supports-grid:flex',
      'data-foo:flex',

      // The `print` variant should still be sorted last, even after registering
      // the other custom variants.
      'print:flex',
    ]),
  ).toMatchInlineSnapshot(`
    ".aria-hidden\\:flex {
      &[aria-hidden="true"] {
        display: flex;
      }
    }
    .aria-polite\\:underline {
      &[aria-live="polite"] {
        text-decoration-line: underline;
      }
    }
    .data-checked\\:underline {
      &[data-ui~="checked"] {
        text-decoration-line: underline;
      }
    }
    .data-foo\\:flex {
      &[data-foo] {
        display: flex;
      }
    }
    .supports-child-combinator\\:underline {
      @supports selector(h2 > p) {
        text-decoration-line: underline;
      }
    }
    .supports-foo\\:underline {
      @supports (bar: var(--tw)) {
        text-decoration-line: underline;
      }
    }
    .supports-grid\\:flex {
      @supports (grid: var(--tw)) {
        display: flex;
      }
    }
    .print\\:flex {
      @media print {
        display: flex;
      }
    }
    "
  `)
})

test('merges css breakpoints with js config screens', async () => {
  let input = css`
    @theme default {
      --breakpoint-sm: 40rem;
      --breakpoint-md: 48rem;
      --breakpoint-lg: 64rem;
      --breakpoint-xl: 80rem;
      --breakpoint-2xl: 96rem;
    }
    @theme {
      --breakpoint-md: 50rem;
    }
    @config "./config.js";
    @tailwind utilities;
  `

  let compiler = await compile(input, {
    loadModule: async () => ({
      module: {
        theme: {
          extend: {
            screens: {
              sm: '44rem',
            },
          },
        },
      },
      base: '/root',
    }),
  })

  expect(compiler.build(['sm:flex', 'md:flex', 'lg:flex', 'min-sm:max-md:underline']))
    .toMatchInlineSnapshot(`
      ".sm\\:flex {
        @media (width >= 44rem) {
          display: flex;
        }
      }
      .min-sm\\:max-md\\:underline {
        @media (width >= 44rem) {
          @media (width < 50rem) {
            text-decoration-line: underline;
          }
        }
      }
      .md\\:flex {
        @media (width >= 50rem) {
          display: flex;
        }
      }
      .lg\\:flex {
        @media (width >= 64rem) {
          display: flex;
        }
      }
      "
    `)
})

test('utilities must be prefixed', async () => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";

    @utility custom {
      color: red;
    }
  `

  let compiler = await compile(input, {
    loadModule: async (id, base) => ({
      base,
      module: { prefix: 'tw' },
    }),
  })

  // Prefixed utilities are generated
  expect(compiler.build(['tw:underline', 'tw:hover:line-through', 'tw:custom']))
    .toMatchInlineSnapshot(`
      ".tw\\:custom {
        color: red;
      }
      .tw\\:underline {
        text-decoration-line: underline;
      }
      .tw\\:hover\\:line-through {
        &:hover {
          @media (hover: hover) {
            text-decoration-line: line-through;
          }
        }
      }
      "
    `)

  // Non-prefixed utilities are ignored
  compiler = await compile(input, {
    loadModule: async (id, base) => ({
      base,
      module: { prefix: 'tw' },
    }),
  })

  expect(compiler.build(['underline', 'hover:line-through', 'custom'])).toEqual('')
})

test('utilities used in @apply must be prefixed', async () => {
  let compiler = await compile(
    css`
      @config "./config.js";

      .my-underline {
        @apply tw:underline;
      }
    `,
    {
      loadModule: async (id, base) => ({
        base,
        module: { prefix: 'tw' },
      }),
    },
  )

  // Prefixed utilities are generated
  expect(compiler.build([])).toMatchInlineSnapshot(`
    ".my-underline {
      text-decoration-line: underline;
    }
    "
  `)

  // Non-prefixed utilities cause an error
  expect(() =>
    compile(
      css`
        @config "./config.js";

        .my-underline {
          @apply underline;
        }
      `,
      {
        loadModule: async (id, base) => ({
          base,
          module: { prefix: 'tw' },
        }),
      },
    ),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `[Error: Cannot apply unknown utility class: underline]`,
  )
})

test('Prefixes configured in CSS take precedence over those defined in JS configs', async () => {
  let compiler = await compile(
    css`
      @theme prefix(wat) {
        --color-red: #f00;
        --color-green: #0f0;
        --breakpoint-sm: 640px;
      }

      @config "./plugin.js";

      @tailwind utilities;

      @utility custom {
        color: red;
      }
    `,
    {
      async loadModule(id, base) {
        return {
          base,
          module: { prefix: 'tw' },
        }
      },
    },
  )

  expect(compiler.build(['wat:custom'])).toMatchInlineSnapshot(`
    ".wat\\:custom {
      color: red;
    }
    "
  `)
})

test('a prefix must be letters only', async () => {
  await expect(() =>
    compile(
      css`
        @config "./plugin.js";
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: { prefix: '__' },
          }
        },
      },
    ),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `[Error: The prefix "__" is invalid. Prefixes must be lowercase ASCII letters (a-z) only.]`,
  )
})

test('important: `#app`', async () => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";

    @utility custom {
      color: red;
    }
  `

  let compiler = await compile(input, {
    loadModule: async (_, base) => ({
      base,
      module: { important: '#app' },
    }),
  })

  expect(compiler.build(['underline', 'hover:line-through', 'custom'])).toMatchInlineSnapshot(`
    "#app {
      .custom {
        color: red;
      }
      .underline {
        text-decoration-line: underline;
      }
      .hover\\:line-through {
        &:hover {
          @media (hover: hover) {
            text-decoration-line: line-through;
          }
        }
      }
    }
    "
  `)
})

test('important: true', async () => {
  let input = css`
    @tailwind utilities;
    @config "./config.js";

    @utility custom {
      color: red;
    }
  `

  let compiler = await compile(input, {
    loadModule: async (_, base) => ({
      base,
      module: { important: true },
    }),
  })

  expect(compiler.build(['underline', 'hover:line-through', 'custom'])).toMatchInlineSnapshot(`
    ".custom {
      color: red !important;
    }
    .underline {
      text-decoration-line: underline !important;
    }
    .hover\\:line-through {
      &:hover {
        @media (hover: hover) {
          text-decoration-line: line-through !important;
        }
      }
    }
    "
  `)
})

test('blocklisted candidates are not generated', async () => {
  let compiler = await compile(
    css`
      @theme reference {
        --color-white: #fff;
        --breakpoint-md: 48rem;
      }
      @tailwind utilities;
      @config "./config.js";
    `,
    {
      async loadModule(id, base) {
        return {
          base,
          module: {
            blocklist: ['bg-white'],
          },
        }
      },
    },
  )

  // bg-white will not get generated
  expect(compiler.build(['bg-white'])).toEqual('')

  // underline will as will md:bg-white
  expect(compiler.build(['underline', 'bg-white', 'md:bg-white'])).toMatchInlineSnapshot(`
    ".underline {
      text-decoration-line: underline;
    }
    .md\\:bg-white {
      @media (width >= 48rem) {
        background-color: var(--color-white, #fff);
      }
    }
    "
  `)
})

test('blocklisted candidates cannot be used with `@apply`', async () => {
  await expect(() =>
    compile(
      css`
        @theme reference {
          --color-white: #fff;
          --breakpoint-md: 48rem;
        }
        @tailwind utilities;
        @config "./config.js";
        .foo {
          @apply bg-white;
        }
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: {
              blocklist: ['bg-white'],
            },
          }
        },
      },
    ),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `[Error: Cannot apply unknown utility class: bg-white]`,
  )
})

test('old theme values are merged with their renamed counterparts in the CSS theme', async () => {
  let didCallPluginFn = vi.fn()

  await compile(
    css`
      @theme reference {
        --breakpoint-a: 1;
        --breakpoint-b: 2;

        --color-a: 1;
        --color-b: 2;

        --radius-a: 1;
        --radius-b: 2;

        --shadow-a: 1;
        --shadow-b: 2;

        --animate-a: 1;
        --animate-b: 2;

        --aspect-a: 1;
        --aspect-b: 2;

        --container-a: 1;
        --container-b: 2;

        --tracking-a: 1;
        --tracking-b: 2;

        --leading-a: 1;
        --leading-b: 2;
      }

      @plugin "./plugin.js";
    `,
    {
      async loadModule(id, base) {
        return {
          base,
          module: plugin(function ({ theme }) {
            didCallPluginFn()

            expect(theme('screens')).toMatchObject({
              a: '1',
              b: '2',
            })

            expect(theme('screens.a')).toEqual('1')
            expect(theme('screens.b')).toEqual('2')

            expect(theme('colors')).toMatchObject({
              a: '1',
              b: '2',
            })

            expect(theme('colors.a')).toEqual('1')
            expect(theme('colors.b')).toEqual('2')

            expect(theme('borderRadius')).toMatchObject({
              a: '1',
              b: '2',
            })

            expect(theme('borderRadius.a')).toEqual('1')
            expect(theme('borderRadius.b')).toEqual('2')

            expect(theme('animation')).toMatchObject({
              a: '1',
              b: '2',
            })

            expect(theme('animation.a')).toEqual('1')
            expect(theme('animation.b')).toEqual('2')

            expect(theme('aspectRatio')).toMatchObject({
              a: '1',
              b: '2',
            })

            expect(theme('aspectRatio.a')).toEqual('1')
            expect(theme('aspectRatio.b')).toEqual('2')

            expect(theme('boxShadow')).toMatchObject({
              a: '1',
              b: '2',
            })

            expect(theme('boxShadow.a')).toEqual('1')
            expect(theme('boxShadow.b')).toEqual('2')

            expect(theme('maxWidth')).toMatchObject({
              a: '1',
              b: '2',
            })

            expect(theme('maxWidth.a')).toEqual('1')
            expect(theme('maxWidth.b')).toEqual('2')

            expect(theme('letterSpacing.a')).toEqual('1')
            expect(theme('letterSpacing.b')).toEqual('2')

            expect(theme('letterSpacing')).toMatchObject({
              a: '1',
              b: '2',
            })

            expect(theme('lineHeight.a')).toEqual('1')
            expect(theme('lineHeight.b')).toEqual('2')

            expect(theme('lineHeight')).toMatchObject({
              a: '1',
              b: '2',
            })
          }),
        }
      },
    },
  )

  expect(didCallPluginFn).toHaveBeenCalled()
})

test('handles setting theme keys to null', async () => {
  let compiler = await compile(
    css`
      @theme default {
        --color-red-50: oklch(0.971 0.013 17.38);
        --color-red-100: oklch(0.936 0.032 17.717);
      }
      @config "./my-config.js";
      @tailwind utilities;
      @theme {
        --color-red-100: oklch(0.936 0.032 17.717);
        --color-red-200: oklch(0.885 0.062 18.334);
      }
    `,
    {
      loadModule: async () => {
        return {
          module: {
            theme: {
              extend: {
                colors: {
                  red: null,
                },
              },
            },
          },
          base: '/root',
        }
      },
    },
  )

  expect(compiler.build(['bg-red-50', 'bg-red-100', 'bg-red-200'])).toMatchInlineSnapshot(`
    ":root, :host {
      --color-red-50: oklch(0.971 0.013 17.38);
      --color-red-100: oklch(0.936 0.032 17.717);
      --color-red-200: oklch(0.885 0.062 18.334);
    }
    .bg-red-50 {
      background-color: var(--color-red-50);
    }
    .bg-red-100 {
      background-color: var(--color-red-100);
    }
    .bg-red-200 {
      background-color: var(--color-red-200);
    }
    "
  `)
})
