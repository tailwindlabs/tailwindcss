import fs from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { compileCss } from './test-utils/run'

const css = String.raw

describe('theme function', () => {
  describe('in declaration values', () => {
    describe('without fallback values', () => {
      test('theme(colors.red.500)', async () => {
        expect(
          await compileCss(css`
            @theme {
              --color-red-500: #f00;
            }
            .red {
              color: theme(colors.red.500);
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --color-red-500: red;
          }

          .red {
            color: red;
          }"
        `)
      })

      test("theme('colors.red.500')", async () => {
        expect(
          await compileCss(css`
            @theme {
              --color-red-500: #f00;
            }
            .red {
              color: theme('colors.red.500');
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --color-red-500: red;
          }

          .red {
            color: red;
          }"
        `)
      })

      test('theme(colors[red]500)', async () => {
        expect(
          await compileCss(css`
            @theme {
              --color-red-500: #f00;
            }
            .red {
              color: theme(colors[red]500);
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --color-red-500: red;
          }

          .red {
            color: red;
          }"
        `)
      })

      test('theme(colors[red].500)', async () => {
        expect(
          await compileCss(css`
            @theme {
              --color-red-500: #f00;
            }
            .red {
              color: theme(colors[red].500);
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --color-red-500: red;
          }

          .red {
            color: red;
          }"
        `)
      })

      test('theme(colors[red][500])', async () => {
        expect(
          await compileCss(css`
            @theme {
              --color-red-500: #f00;
            }
            .red {
              color: theme(colors[red][500]);
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --color-red-500: red;
          }

          .red {
            color: red;
          }"
        `)
      })

      test('theme(colors[red].[500])', async () => {
        expect(
          await compileCss(css`
            @theme {
              --color-red-500: #f00;
            }
            .red {
              color: theme(colors[red].[500]);
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --color-red-500: red;
          }

          .red {
            color: red;
          }"
        `)
      })

      test('theme(colors.red.500 / 75%)', async () => {
        expect(
          await compileCss(css`
            @theme {
              --color-red-500: #f00;
            }
            .red {
              color: theme(colors.red.500 / 75%);
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --color-red-500: red;
          }

          .red {
            color: #ff0000bf;
          }"
        `)
      })

      test("theme('colors.red.500 / 75%')", async () => {
        expect(
          await compileCss(css`
            @theme {
              --color-red-500: #f00;
            }
            .red {
              color: theme('colors.red.500 / 75%');
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --color-red-500: red;
          }

          .red {
            color: #ff0000bf;
          }"
        `)
      })

      test('theme(spacing.12)', async () => {
        expect(
          await compileCss(css`
            @theme {
              --spacing-12: 3rem;
            }
            .space-on-the-left {
              margin-left: theme(spacing.12);
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --spacing-12: 3rem;
          }

          .space-on-the-left {
            margin-left: 3rem;
          }"
        `)
      })

      test('theme(spacing[2.5])', async () => {
        expect(
          await compileCss(css`
            @theme {
              --spacing-2_5: 0.625rem;
            }
            .space-on-the-left {
              margin-left: theme(spacing[2.5]);
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --spacing-2_5: .625rem;
          }

          .space-on-the-left {
            margin-left: .625rem;
          }"
        `)
      })

      test('calc(100vh - theme(spacing[2.5]))', async () => {
        expect(
          await compileCss(css`
            @theme {
              --spacing-2_5: 0.625rem;
            }
            .space-on-the-left {
              margin-left: calc(100vh - theme(spacing[2.5]));
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --spacing-2_5: .625rem;
          }

          .space-on-the-left {
            margin-left: calc(100vh - .625rem);
          }"
        `)
      })

      describe('for v3 compatibility', () => {
        test('theme(blur.DEFAULT)', async () => {
          expect(
            await compileCss(css`
              @theme {
                --blur: 8px;
              }
              .default-blur {
                filter: blur(theme(blur.DEFAULT));
              }
            `),
          ).toMatchInlineSnapshot(`
          ":root {
            --blur: 8px;
          }

          .default-blur {
            filter: blur(8px);
          }"
        `)
        })

        test.skip('theme(fontSize.xs[1].lineHeight)', async () => {
          expect(
            await compileCss(css`
              @theme {
                --font-size-xs: 0.75rem;
                --font-size-xs--line-height: 1rem;
              }
              .text {
                font-size: theme(fontSize.xs);
                line-height: theme(fontSize.xs[1].lineHeight);
              }
            `),
          ).toMatchInlineSnapshot()
        })
      })

      test('theme(colors.unknown.500)', async () =>
        expect(() =>
          compileCss(css`
            .red {
              color: theme(colors.unknown.500);
            }
          `),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `[Error: Could not resolve value for theme function: \`theme(colors.unknown.500)\`]`,
        ))
    })

    describe('with default values', () => {
      test('theme(colors.red.unknown / 50%, #f00)', async () => {
        expect(
          await compileCss(css`
            .red {
              color: theme(colors.red.unknown / 50%, #f00);
            }
          `),
        ).toMatchInlineSnapshot(`
          ".red {
            color: red;
          }"
        `)
      })

      test('theme(colors.red.unknown / 75%, theme(colors.red.500 / 25%))', async () => {
        expect(
          await compileCss(css`
            @theme {
              --color-red-500: #f00;
            }
            .red {
              color: theme(colors.red.unknown / 75%, theme(colors.red.500 / 25%));
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --color-red-500: red;
          }

          .red {
            color: #ff000040;
          }"
        `)
      })

      test('theme(fontFamily.sans, Helvetica Neue, Helvetica, sans-serif)', async () => {
        expect(
          await compileCss(css`
            .fam {
              font-family: theme(fontFamily.sans, Helvetica Neue, Helvetica, sans-serif);
            }
          `),
        ).toMatchInlineSnapshot(`
          ".fam {
            font-family: Neue, Helvetica, sans-serif;
          }"
        `)
      })
    })

    describe('recursive theme()', () => {
      test('can references theme inside @theme', async () => {
        expect(
          await compileCss(css`
            @theme {
              --color-red-500: #f00;
              --color-foo: theme(colors.red.500);
            }
            .red {
              color: theme(colors.foo);
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --color-red-500: red;
            --color-foo: red;
          }

          .red {
            color: red;
          }"
        `)
      })

      test('can references theme inside @theme and stacking opacity', async () => {
        expect(
          await compileCss(css`
            @theme {
              --color-red-500: #f00;
              --color-foo: theme(colors.red.500 / 50%);
            }
            .red {
              color: theme(colors.foo / 50%);
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --color-red-500: red;
            --color-foo: #ff000080;
          }

          .red {
            color: #ff000040;
          }"
        `)
      })
    })

    describe('with CSS variable syntax', () => {
      test('theme(--color-red-500)', async () => {
        expect(
          await compileCss(css`
            @theme {
              --color-red-500: #f00;
            }
            .red {
              color: theme(--color-red-500);
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --color-red-500: red;
          }

          .red {
            color: red;
          }"
        `)
      })
      test('theme("--color-red-500")', async () => {
        expect(
          await compileCss(css`
            @theme {
              --color-red-500: #f00;
            }
            .red {
              color: theme(--color-red-500);
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --color-red-500: red;
          }

          .red {
            color: red;
          }"
        `)
      })
    })

    describe('resolving --default lookups', () => {
      test('theme(font.family)', async () => {
        expect(
          await compileCss(css`
            @theme {
              --default-font-family: Helvetica Neue, Helvetica, sans-serif;
            }
            .sans {
              font-family: theme(font.family);
            }
          `),
        ).toMatchInlineSnapshot(`
          ":root {
            --default-font-family: Helvetica Neue, Helvetica, sans-serif;
          }

          .sans {
            font-family: Helvetica Neue, Helvetica, sans-serif;
          }"
        `)
      })
    })

    describe('with default theme', () => {
      test.each([
        [
          'fontFamily.sans',
          'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        ],
        ['width.xs', '20rem'],
        ['transition.timing.function.in.out', 'cubic-bezier(.4, 0, .2, 1)'],
        ['backgroundColors.red.500', '#ef4444'],
      ])('theme(%s) → %s', async (value, result) => {
        let defaultTheme = await fs.readFile(path.join(__dirname, '..', 'theme.css'), 'utf8')

        let compiled = await compileCss(css`
          ${defaultTheme}
          .custom {
            --custom-value: theme(${value});
          }
        `)

        let startOfCustomClass = compiled.indexOf('.custom {\n')
        let endOfCustomClass = compiled.indexOf('}', startOfCustomClass)

        let customClassRule = compiled
          .slice(startOfCustomClass + '.custom {\n'.length, endOfCustomClass)
          .replace('--custom-value:', '')
          .trim()
          .slice(0, -1)

        expect(customClassRule).toBe(result)
      })
    })
  })

  describe('in candidates', () => {
    test('sm:[--color:theme(colors.red[500])]', async () => {
      expect(
        await compileCss(
          css`
            @tailwind utilities;
            @theme {
              --breakpoint-sm: 40rem;
              --color-red-500: #f00;
            }
          `,
          ['sm:[--color:theme(colors.red[500])]'],
        ),
      ).toMatchInlineSnapshot(`
        "@media (width >= 40rem) {
          .sm\\:\\[--color\\:theme\\(colors\\.red\\[500\\]\\)\\] {
            --color: red;
          }
        }

        :root {
          --breakpoint-sm: 40rem;
          --color-red-500: red;
        }"
      `)
    })
  })

  describe('in @media queries', () => {
    test('@media (min-width: theme(breakpoint.md)) and (max-width: theme(--breakpoint-lg))', async () => {
      expect(
        await compileCss(css`
          @theme {
            --breakpoint-md: 48rem;
            --breakpoint-lg: 64rem;
          }
          @media (min-width: theme(breakpoint.md)) and (max-width: theme(--breakpoint-lg)) {
            .red {
              color: red;
            }
          }
        `),
      ).toMatchInlineSnapshot(`
        ":root {
          --breakpoint-md: 48rem;
          --breakpoint-lg: 64rem;
        }

        @media (width >= 48rem) and (width <= 64rem) {
          .red {
            color: red;
          }
        }"
      `)
    })
  })
})
