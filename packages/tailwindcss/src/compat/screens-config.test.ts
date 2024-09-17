import { describe, expect, test } from 'vitest'
import { compile } from '..'

const css = String.raw

test('CSS `--breakpoint-*` merge with JS config `screens`', async () => {
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
    loadConfig: async () => ({
      theme: {
        extend: {
          screens: {
            sm: '44rem',
          },
        },
      },
    }),
  })

  expect(
    compiler.build([
      'sm:flex',
      'md:flex',
      'lg:flex',
      'min-sm:max-md:underline',
      'min-md:max-lg:underline',
      // Ensure other core variants appear at the end
      'print:items-end',
    ]),
  ).toMatchInlineSnapshot(`
    ":root {
      --breakpoint-md: 50rem;
      --breakpoint-lg: 64rem;
      --breakpoint-xl: 80rem;
      --breakpoint-2xl: 96rem;
    }
    .min-sm\\:max-md\\:underline {
      @media (width >= 44rem) {
        @media (width < 50rem) {
          text-decoration-line: underline;
        }
      }
    }
    .sm\\:flex {
      @media (width >= 44rem) {
        display: flex;
      }
    }
    .md\\:flex {
      @media (width >= 50rem) {
        display: flex;
      }
    }
    .min-md\\:max-lg\\:underline {
      @media (width >= 50rem) {
        @media (width < 64rem) {
          text-decoration-line: underline;
        }
      }
    }
    .lg\\:flex {
      @media (width >= 64rem) {
        display: flex;
      }
    }
    .print\\:items-end {
      @media print {
        align-items: flex-end;
      }
    }
    "
  `)
})

test('JS config `screens` extend CSS `--breakpoint-*`', async () => {
  let input = css`
    @theme default {
      --breakpoint-xs: 39rem;
      --breakpoint-md: 49rem;
    }
    @theme {
      --breakpoint-md: 50rem;
    }
    @config "./config.js";
    @tailwind utilities;
  `

  let compiler = await compile(input, {
    loadConfig: async () => ({
      theme: {
        extend: {
          screens: {
            xs: '30rem',
            sm: '40rem',
            md: '48rem',
            lg: '60rem',
          },
        },
      },
    }),
  })

  expect(
    compiler.build([
      // Order is messed up on purpose
      'md:flex',
      'sm:flex',
      'lg:flex',
      'xs:flex',
      'min-md:max-lg:underline',
      'min-sm:max-md:underline',
      'min-xs:flex',
      'min-xs:max-md:underline',

      // Ensure other core variants appear at the end
      'print:items-end',
    ]),
  ).toMatchInlineSnapshot(`
    ":root {
      --breakpoint-md: 50rem;
    }
    .min-xs\\:flex {
      @media (width >= 30rem) {
        display: flex;
      }
    }
    .min-xs\\:max-md\\:underline {
      @media (width >= 30rem) {
        @media (width < 50rem) {
          text-decoration-line: underline;
        }
      }
    }
    .xs\\:flex {
      @media (width >= 30rem) {
        display: flex;
      }
    }
    .min-sm\\:max-md\\:underline {
      @media (width >= 40rem) {
        @media (width < 50rem) {
          text-decoration-line: underline;
        }
      }
    }
    .sm\\:flex {
      @media (width >= 40rem) {
        display: flex;
      }
    }
    .md\\:flex {
      @media (width >= 50rem) {
        display: flex;
      }
    }
    .min-md\\:max-lg\\:underline {
      @media (width >= 50rem) {
        @media (width < 60rem) {
          text-decoration-line: underline;
        }
      }
    }
    .lg\\:flex {
      @media (width >= 60rem) {
        display: flex;
      }
    }
    .print\\:items-end {
      @media print {
        align-items: flex-end;
      }
    }
    "
  `)
})

test('JS config `screens` only setup, even if those match the default-theme export', async () => {
  let input = css`
    @config "./config.js";
    @tailwind utilities;
  `

  let compiler = await compile(input, {
    loadConfig: async () => ({
      theme: {
        screens: {
          sm: '40rem',
          md: '48rem',
          lg: '64rem',
        },
      },
    }),
  })

  expect(
    compiler.build([
      // Order is messed up on purpose
      'md:flex',
      'sm:flex',
      'lg:flex',
      'min-md:max-lg:underline',
      'min-sm:max-md:underline',

      // Ensure other core variants appear at the end
      'print:items-end',
    ]),
  ).toMatchInlineSnapshot(`
    ".min-sm\\:max-md\\:underline {
      @media (width >= 40rem) {
        @media (width < 48rem) {
          text-decoration-line: underline;
        }
      }
    }
    .sm\\:flex {
      @media (width >= 40rem) {
        display: flex;
      }
    }
    .md\\:flex {
      @media (width >= 48rem) {
        display: flex;
      }
    }
    .min-md\\:max-lg\\:underline {
      @media (width >= 48rem) {
        @media (width < 64rem) {
          text-decoration-line: underline;
        }
      }
    }
    .lg\\:flex {
      @media (width >= 64rem) {
        display: flex;
      }
    }
    .print\\:items-end {
      @media print {
        align-items: flex-end;
      }
    }
    "
  `)
})

test('JS config `screens` overwrite CSS `--breakpoint-*`', async () => {
  let input = css`
    @theme default {
      --breakpoint-sm: 40rem;
      --breakpoint-md: 48rem;
      --breakpoint-lg: 64rem;
      --breakpoint-xl: 80rem;
      --breakpoint-2xl: 96rem;
    }
    @config "./config.js";
    @tailwind utilities;
  `

  let compiler = await compile(input, {
    loadConfig: async () => ({
      theme: {
        screens: {
          mini: '40rem',
          midi: '48rem',
          maxi: '64rem',
        },
      },
    }),
  })

  expect(
    compiler.build([
      'sm:flex',
      'md:flex',
      'mini:flex',
      'midi:flex',
      'maxi:flex',
      'min-md:max-lg:underline',
      'min-sm:max-md:underline',
      'min-midi:max-maxi:underline',
      'min-mini:max-midi:underline',

      // Ensure other core variants appear at the end
      'print:items-end',
    ]),
  ).toMatchInlineSnapshot(`
    ":root {
      --breakpoint-sm: 40rem;
      --breakpoint-md: 48rem;
      --breakpoint-lg: 64rem;
      --breakpoint-xl: 80rem;
      --breakpoint-2xl: 96rem;
    }
    .min-sm\\:max-md\\:underline {
      @media (width >= 40rem) {
        @media (width < 48rem) {
          text-decoration-line: underline;
        }
      }
    }
    .min-mini\\:max-midi\\:underline {
      @media (width >= 40rem) {
        @media (width < 48rem) {
          text-decoration-line: underline;
        }
      }
    }
    .mini\\:flex {
      @media (width >= 40rem) {
        display: flex;
      }
    }
    .sm\\:flex {
      @media (width >= 40rem) {
        display: flex;
      }
    }
    .md\\:flex {
      @media (width >= 48rem) {
        display: flex;
      }
    }
    .midi\\:flex {
      @media (width >= 48rem) {
        display: flex;
      }
    }
    .min-md\\:max-lg\\:underline {
      @media (width >= 48rem) {
        @media (width < 64rem) {
          text-decoration-line: underline;
        }
      }
    }
    .min-midi\\:max-maxi\\:underline {
      @media (width >= 48rem) {
        @media (width < 64rem) {
          text-decoration-line: underline;
        }
      }
    }
    .maxi\\:flex {
      @media (width >= 64rem) {
        display: flex;
      }
    }
    .print\\:items-end {
      @media print {
        align-items: flex-end;
      }
    }
    "
  `)
})

test('JS config with `theme: { extends }` should not include the `default-config` values', async () => {
  let input = css`
    @config "./config.js";
    @tailwind utilities;
  `

  let compiler = await compile(input, {
    loadConfig: async () => ({
      theme: {
        extend: {
          screens: {
            mini: '40rem',
            midi: '48rem',
            maxi: '64rem',
          },
        },
      },
    }),
  })

  expect(
    compiler.build([
      'sm:flex',
      'md:flex',
      'mini:flex',
      'midi:flex',
      'maxi:flex',
      'min-md:max-lg:underline',
      'min-sm:max-md:underline',
      'min-midi:max-maxi:underline',
      'min-mini:max-midi:underline',

      // Ensure other core variants appear at the end
      'print:items-end',
    ]),
  ).toMatchInlineSnapshot(`
    ".min-mini\\:max-midi\\:underline {
      @media (width >= 40rem) {
        @media (width < 48rem) {
          text-decoration-line: underline;
        }
      }
    }
    .mini\\:flex {
      @media (width >= 40rem) {
        display: flex;
      }
    }
    .midi\\:flex {
      @media (width >= 48rem) {
        display: flex;
      }
    }
    .min-midi\\:max-maxi\\:underline {
      @media (width >= 48rem) {
        @media (width < 64rem) {
          text-decoration-line: underline;
        }
      }
    }
    .maxi\\:flex {
      @media (width >= 64rem) {
        display: flex;
      }
    }
    .print\\:items-end {
      @media print {
        align-items: flex-end;
      }
    }
    "
  `)
})

describe('complex screen configs', () => {
  test('generates utilities', async () => {
    let input = css`
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          extend: {
            screens: {
              sm: { max: '639px' },
              md: [
                //
                { min: '668px', max: '767px' },
                { min: '868px' },
              ],
              lg: { min: '868px' },
              xl: { min: '1024px', max: '1279px' },
              tall: { raw: '(min-height: 800px)' },
            },
          },
        },
      }),
    })

    expect(
      compiler.build([
        'sm:flex',
        'md:flex',
        'lg:flex',
        'xl:flex',
        'tall:flex',
        'min-sm:flex',
        'min-md:flex',
        'min-lg:flex',
        'min-xl:flex',
        'min-tall:flex',
        // Ensure other core variants appear at the end
        'print:items-end',
      ]),
    ).toMatchInlineSnapshot(`
      ".lg\\:flex {
        @media (min-width: 868px) {
          display: flex;
        }
      }
      .tall\\:flex {
        @media (min-height: 800px) {
          display: flex;
        }
      }
      .xl\\:flex {
        @media (min-width: 1024px and max-width: 1279px) {
          display: flex;
        }
      }
      .md\\:flex {
        @media (min-width: 668px and max-width: 767px), (min-width: 868px) {
          display: flex;
        }
      }
      .sm\\:flex {
        @media (max-width: 639px) {
          display: flex;
        }
      }
      .print\\:items-end {
        @media print {
          align-items: flex-end;
        }
      }
      "
    `)
  })

  test("don't interfere with `min-*` and `max-*` variants of non-complex screen configs", async () => {
    let input = css`
      @theme default {
        --breakpoint-sm: 39rem;
        --breakpoint-md: 48rem;
      }
      @config "./config.js";
      @tailwind utilities;
    `

    let compiler = await compile(input, {
      loadConfig: async () => ({
        theme: {
          extend: {
            screens: {
              sm: '40rem',
              portrait: { raw: 'screen and (orientation: portrait)' },
            },
          },
        },
      }),
    })

    expect(
      compiler.build([
        'sm:flex',
        'md:flex',
        'portrait:flex',
        'min-sm:flex',
        'min-md:flex',
        'min-portrait:flex',
        // Ensure other core variants appear at the end
        'print:items-end',
      ]),
    ).toMatchInlineSnapshot(`
      ":root {
        --breakpoint-md: 48rem;
      }
      .min-sm\\:flex {
        @media (width >= 40rem) {
          display: flex;
        }
      }
      .sm\\:flex {
        @media (width >= 40rem) {
          display: flex;
        }
      }
      .md\\:flex {
        @media (width >= 48rem) {
          display: flex;
        }
      }
      .min-md\\:flex {
        @media (width >= 48rem) {
          display: flex;
        }
      }
      .portrait\\:flex {
        @media screen and (orientation: portrait) {
          display: flex;
        }
      }
      .print\\:items-end {
        @media print {
          align-items: flex-end;
        }
      }
      "
    `)
  })
})
