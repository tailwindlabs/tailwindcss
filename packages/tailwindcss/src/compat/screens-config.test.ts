import { describe, expect, test } from 'vitest'
import { run } from '../test-utils/run'

const css = String.raw

test('CSS `--breakpoint-*` merge with JS config `screens`', async () => {
  expect(
    await run(
      [
        'sm:flex',
        'md:flex',
        'lg:flex',
        'min-sm:max-md:underline',
        'min-md:max-lg:underline',
        'max-w-screen-sm',
        // Ensure other core variants appear at the end
        'print:items-end',
      ],
      css`
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
      `,
      {
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
          path: '',
        }),
      },
    ),
  ).toMatchInlineSnapshot(`
    "
    .max-w-screen-sm {
      max-width: 44rem;
    }

    @media (min-width: 44rem) {
      .sm\\:flex {
        display: flex;
      }

      @media not all and (min-width: 50rem) {
        .min-sm\\:max-md\\:underline {
          text-decoration-line: underline;
        }
      }
    }

    @media (min-width: 50rem) {
      .md\\:flex {
        display: flex;
      }

      @media not all and (min-width: 64rem) {
        .min-md\\:max-lg\\:underline {
          text-decoration-line: underline;
        }
      }
    }

    @media (min-width: 64rem) {
      .lg\\:flex {
        display: flex;
      }
    }

    @media print {
      .print\\:items-end {
        align-items: flex-end;
      }
    }
    "
  `)
})

test('JS config `screens` extend CSS `--breakpoint-*`', async () => {
  expect(
    await run(
      [
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
      ],
      css`
        @theme default {
          --breakpoint-xs: 39rem;
          --breakpoint-md: 49rem;
        }
        @theme {
          --breakpoint-md: 50rem;
        }
        @config "./config.js";
        @tailwind utilities;
      `,
      {
        loadModule: async () => ({
          module: {
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
          },
          base: '/root',
          path: '',
        }),
      },
    ),
  ).toMatchInlineSnapshot(`
    "
    @media (min-width: 30rem) {
      .min-xs\\:flex, .xs\\:flex {
        display: flex;
      }

      @media not all and (min-width: 50rem) {
        .min-xs\\:max-md\\:underline {
          text-decoration-line: underline;
        }
      }
    }

    @media (min-width: 40rem) {
      .sm\\:flex {
        display: flex;
      }

      @media not all and (min-width: 50rem) {
        .min-sm\\:max-md\\:underline {
          text-decoration-line: underline;
        }
      }
    }

    @media (min-width: 50rem) {
      .md\\:flex {
        display: flex;
      }

      @media not all and (min-width: 60rem) {
        .min-md\\:max-lg\\:underline {
          text-decoration-line: underline;
        }
      }
    }

    @media (min-width: 60rem) {
      .lg\\:flex {
        display: flex;
      }
    }

    @media print {
      .print\\:items-end {
        align-items: flex-end;
      }
    }
    "
  `)
})

test('JS config `screens` only setup, even if those match the default-theme export', async () => {
  expect(
    await run(
      [
        // Order is messed up on purpose
        'md:flex',
        'sm:flex',
        'lg:flex',
        'min-md:max-lg:underline',
        'min-sm:max-md:underline',

        // Ensure other core variants appear at the end
        'print:items-end',
      ],
      css`
        @config "./config.js";
        @tailwind utilities;
      `,
      {
        loadModule: async () => ({
          module: {
            theme: {
              screens: {
                sm: '40rem',
                md: '48rem',
                lg: '64rem',
              },
            },
          },
          base: '/root',
          path: '',
        }),
      },
    ),
  ).toMatchInlineSnapshot(`
    "
    @media (min-width: 40rem) {
      .sm\\:flex {
        display: flex;
      }

      @media not all and (min-width: 48rem) {
        .min-sm\\:max-md\\:underline {
          text-decoration-line: underline;
        }
      }
    }

    @media (min-width: 48rem) {
      .md\\:flex {
        display: flex;
      }

      @media not all and (min-width: 64rem) {
        .min-md\\:max-lg\\:underline {
          text-decoration-line: underline;
        }
      }
    }

    @media (min-width: 64rem) {
      .lg\\:flex {
        display: flex;
      }
    }

    @media print {
      .print\\:items-end {
        align-items: flex-end;
      }
    }
    "
  `)
})

test('JS config `screens` overwrite CSS `--breakpoint-*`', async () => {
  expect(
    await run(
      [
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
      ],
      css`
        @theme default {
          --breakpoint-sm: 40rem;
          --breakpoint-md: 48rem;
          --breakpoint-lg: 64rem;
          --breakpoint-xl: 80rem;
          --breakpoint-2xl: 96rem;
        }
        @config "./config.js";
        @tailwind utilities;
      `,
      {
        loadModule: async () => ({
          module: {
            theme: {
              extend: {
                screens: {
                  mini: '40rem',
                  midi: '48rem',
                  maxi: '64rem',
                },
              },
            },
          },
          base: '/root',
          path: '',
        }),
      },
    ),
  ).toMatchInlineSnapshot(`
    "
    @media (min-width: 40rem) {
      .mini\\:flex, .sm\\:flex {
        display: flex;
      }

      @media not all and (min-width: 48rem) {
        .min-mini\\:max-midi\\:underline, .min-sm\\:max-md\\:underline {
          text-decoration-line: underline;
        }
      }
    }

    @media (min-width: 48rem) {
      .md\\:flex, .midi\\:flex {
        display: flex;
      }

      @media not all and (min-width: 64rem) {
        .min-md\\:max-lg\\:underline, .min-midi\\:max-maxi\\:underline {
          text-decoration-line: underline;
        }
      }
    }

    @media (min-width: 64rem) {
      .maxi\\:flex {
        display: flex;
      }
    }

    @media print {
      .print\\:items-end {
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

  expect(
    await run(['sm:flex', 'md:flex', 'min-md:max-lg:underline', 'min-sm:max-md:underline'], input, {
      loadModule: async () => ({
        module: {
          theme: {
            extend: {
              screens: {
                mini: '40rem',
                midi: '48rem',
                maxi: '64rem',
              },
            },
          },
        },
        base: '/root',
        path: '',
      }),
    }),
  ).toBe('')

  expect(
    await run(
      [
        'mini:flex',
        'midi:flex',
        'maxi:flex',
        'min-midi:max-maxi:underline',
        'min-mini:max-midi:underline',

        // Ensure other core variants appear at the end
        'print:items-end',
      ],
      input,
      {
        loadModule: async () => ({
          module: {
            theme: {
              extend: {
                screens: {
                  mini: '40rem',
                  midi: '48rem',
                  maxi: '64rem',
                },
              },
            },
          },
          base: '/root',
          path: '',
        }),
      },
    ),
  ).toMatchInlineSnapshot(`
    "
    @media (min-width: 40rem) {
      .mini\\:flex {
        display: flex;
      }

      @media not all and (min-width: 48rem) {
        .min-mini\\:max-midi\\:underline {
          text-decoration-line: underline;
        }
      }
    }

    @media (min-width: 48rem) {
      .midi\\:flex {
        display: flex;
      }

      @media not all and (min-width: 64rem) {
        .min-midi\\:max-maxi\\:underline {
          text-decoration-line: underline;
        }
      }
    }

    @media (min-width: 64rem) {
      .maxi\\:flex {
        display: flex;
      }
    }

    @media print {
      .print\\:items-end {
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

    expect(
      await run(['min-sm:flex', 'min-md:flex', 'min-xl:flex', 'min-tall:flex'], input, {
        loadModule: async () => ({
          module: {
            theme: {
              extend: {
                screens: {
                  sm: { max: '639px' },
                  md: [
                    //
                    { min: '668px', max: '767px' },
                    '868px',
                  ],
                  lg: { min: '868px' },
                  xl: { min: '1024px', max: '1279px' },
                  tall: { raw: '(min-height: 800px)' },
                },
              },
            },
          },
          base: '/root',
          path: '',
        }),
      }),
    ).toBe('')

    expect(
      await run(
        [
          'sm:flex',
          'md:flex',
          'lg:flex',
          'min-lg:flex',
          'xl:flex',
          'tall:flex',

          // Ensure other core variants appear at the end
          'print:items-end',
        ],
        input,
        {
          loadModule: async () => ({
            module: {
              theme: {
                extend: {
                  screens: {
                    sm: { max: '639px' },
                    md: [
                      //
                      { min: '668px', max: '767px' },
                      '868px',
                    ],
                    lg: { min: '868px' },
                    xl: { min: '1024px', max: '1279px' },
                    tall: { raw: '(min-height: 800px)' },
                  },
                },
              },
            },
            base: '/root',
            path: '',
          }),
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @media (min-width: 868px) {
        .lg\\:flex, .min-lg\\:flex {
          display: flex;
        }
      }

      @media (max-width: 639px) {
        .sm\\:flex {
          display: flex;
        }
      }

      @media (max-width: 767px) and (min-width: 668px), (min-width: 868px) {
        .md\\:flex {
          display: flex;
        }
      }

      @media (max-width: 1279px) and (min-width: 1024px) {
        .xl\\:flex {
          display: flex;
        }
      }

      @media (min-height: 800px) {
        .tall\\:flex {
          display: flex;
        }
      }

      @media print {
        .print\\:items-end {
          align-items: flex-end;
        }
      }
      "
    `)
  })

  test("don't interfere with `min-*` and `max-*` variants of non-complex screen configs", async () => {
    expect(
      await run(
        [
          'sm:flex',
          'md:flex',
          'portrait:flex',
          'min-sm:flex',
          'min-md:flex',
          'min-portrait:flex',
          // Ensure other core variants appear at the end
          'print:items-end',
        ],
        css`
          @theme default {
            --breakpoint-sm: 39rem;
            --breakpoint-md: 48rem;
          }
          @config "./config.js";
          @tailwind utilities;
        `,
        {
          loadModule: async () => ({
            module: {
              theme: {
                extend: {
                  screens: {
                    sm: '40rem',
                    portrait: { raw: 'screen and (orientation: portrait)' },
                  },
                },
              },
            },
            base: '/root',
            path: '',
          }),
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @media (min-width: 40rem) {
        .min-sm\\:flex, .sm\\:flex {
          display: flex;
        }
      }

      @media (min-width: 48rem) {
        .md\\:flex, .min-md\\:flex {
          display: flex;
        }
      }

      @media screen and (orientation: portrait) {
        .portrait\\:flex {
          display: flex;
        }
      }

      @media print {
        .print\\:items-end {
          align-items: flex-end;
        }
      }
      "
    `)
  })
})

test('JS config `screens` can overwrite default CSS `--breakpoint-*`', async () => {
  // Note: The `sm`, `md`, and other variants are still there because they are
  // created before the compat layer can intercept. We do not remove them
  // currently.
  expect(
    await run(
      ['min-sm:flex', 'min-md:flex', 'min-lg:flex', 'min-xl:flex', 'min-2xl:flex'],
      css`
        @theme default {
          --breakpoint-sm: 40rem;
          --breakpoint-md: 48rem;
          --breakpoint-lg: 64rem;
          --breakpoint-xl: 80rem;
          --breakpoint-2xl: 96rem;
        }
        @config "./config.js";
        @tailwind utilities;
      `,
      {
        loadModule: async () => ({
          module: {
            theme: {
              screens: {
                mini: '40rem',
                midi: '48rem',
                maxi: '64rem',
              },
            },
          },
          base: '/root',
          path: '',
        }),
      },
    ),
  ).toEqual('')
})
