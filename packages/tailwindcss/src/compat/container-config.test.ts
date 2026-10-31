import { expect, test } from 'vitest'
import { run } from '../test-utils/run'

const css = String.raw

test('creates a custom utility to extend the built-in container', async () => {
  expect(
    await run(
      ['container'],
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
              container: {
                center: true,
                padding: '2rem',
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
    .container {
      width: 100%;
    }

    @media (min-width: 40rem) {
      .container {
        max-width: 40rem;
      }
    }

    @media (min-width: 48rem) {
      .container {
        max-width: 48rem;
      }
    }

    @media (min-width: 64rem) {
      .container {
        max-width: 64rem;
      }
    }

    @media (min-width: 80rem) {
      .container {
        max-width: 80rem;
      }
    }

    @media (min-width: 96rem) {
      .container {
        max-width: 96rem;
      }
    }

    .container {
      margin-inline: auto;
      padding-inline: 2rem;
    }
    "
  `)
})

test('allows padding to be defined at custom breakpoints', async () => {
  expect(
    await run(
      ['container'],
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
              container: {
                padding: {
                  // The order here is messed up on purpose
                  '2xl': '3rem',
                  DEFAULT: '1rem',
                  lg: '2rem',
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
    .container {
      width: 100%;
    }

    @media (min-width: 40rem) {
      .container {
        max-width: 40rem;
      }
    }

    @media (min-width: 48rem) {
      .container {
        max-width: 48rem;
      }
    }

    @media (min-width: 64rem) {
      .container {
        max-width: 64rem;
      }
    }

    @media (min-width: 80rem) {
      .container {
        max-width: 80rem;
      }
    }

    @media (min-width: 96rem) {
      .container {
        max-width: 96rem;
      }
    }

    .container {
      padding-inline: 1rem;
    }

    @media (min-width: 64rem) {
      .container {
        padding-inline: 2rem;
      }
    }

    @media (min-width: 96rem) {
      .container {
        padding-inline: 3rem;
      }
    }
    "
  `)
})

test('allows breakpoints to be overwritten', async () => {
  expect(
    await run(
      ['container'],
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
              container: {
                screens: {
                  xl: '1280px',
                  '2xl': '1536px',
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
    .container {
      width: 100%;
    }

    @media (min-width: 40rem) {
      .container {
        max-width: 40rem;
      }
    }

    @media (min-width: 48rem) {
      .container {
        max-width: 48rem;
      }
    }

    @media (min-width: 64rem) {
      .container {
        max-width: 64rem;
      }
    }

    @media (min-width: 80rem) {
      .container {
        max-width: 80rem;
      }
    }

    @media (min-width: 96rem) {
      .container {
        max-width: 96rem;
      }
    }

    @media (min-width: 40rem) {
      .container {
        max-width: none;
      }
    }

    @media (min-width: 1280px) {
      .container {
        max-width: 1280px;
      }
    }

    @media (min-width: 1536px) {
      .container {
        max-width: 1536px;
      }
    }
    "
  `)
})

test('padding applies to custom `container` screens', async () => {
  expect(
    await run(
      ['container'],
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
              container: {
                padding: {
                  sm: '2rem',
                  md: '3rem',
                },
                screens: {
                  md: '48rem',
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
    .container {
      width: 100%;
    }

    @media (min-width: 40rem) {
      .container {
        max-width: 40rem;
      }
    }

    @media (min-width: 48rem) {
      .container {
        max-width: 48rem;
      }
    }

    @media (min-width: 64rem) {
      .container {
        max-width: 64rem;
      }
    }

    @media (min-width: 80rem) {
      .container {
        max-width: 80rem;
      }
    }

    @media (min-width: 96rem) {
      .container {
        max-width: 96rem;
      }
    }

    @media (min-width: 40rem) {
      .container {
        max-width: none;
      }
    }

    @media (min-width: 48rem) {
      .container {
        max-width: 48rem;
        padding-inline: 3rem;
      }
    }
    "
  `)
})

test("an empty `screen` config will undo all custom media screens and won't apply any breakpoint-specific padding", async () => {
  expect(
    await run(
      ['container'],
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
              container: {
                padding: {
                  DEFAULT: '1rem',
                  sm: '2rem',
                  md: '3rem',
                },
                screens: {},
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
    .container {
      width: 100%;
    }

    @media (min-width: 40rem) {
      .container {
        max-width: 40rem;
      }
    }

    @media (min-width: 48rem) {
      .container {
        max-width: 48rem;
      }
    }

    @media (min-width: 64rem) {
      .container {
        max-width: 64rem;
      }
    }

    @media (min-width: 80rem) {
      .container {
        max-width: 80rem;
      }
    }

    @media (min-width: 96rem) {
      .container {
        max-width: 96rem;
      }
    }

    .container {
      padding-inline: 1rem;
    }

    @media (min-width: 40rem) {
      .container {
        max-width: none;
      }
    }
    "
  `)
})

test('legacy container component does not interfere with new --container variables', async () => {
  expect(
    await run(
      ['max-w-sm'],
      css`
        @theme default {
          --container-3xs: 16rem;
          --container-2xs: 18rem;
          --container-xs: 20rem;
          --container-sm: 24rem;
          --container-md: 28rem;
          --container-lg: 32rem;
          --container-xl: 36rem;
          --container-2xl: 42rem;
          --container-3xl: 48rem;
          --container-4xl: 56rem;
          --container-5xl: 64rem;
          --container-6xl: 72rem;
          --container-7xl: 80rem;
          --container-prose: 65ch;
        }
        @config "./config.js";
        @tailwind utilities;
      `,
      {
        loadModule: async () => ({
          module: {
            theme: {
              container: {
                center: true,
                padding: '2rem',
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
    :root, :host {
      --container-sm: 24rem;
    }

    .max-w-sm {
      max-width: var(--container-sm);
    }
    "
  `)
})

test('combines custom padding and screen overwrites', async () => {
  expect(
    await run(
      ['container', '!container'],
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
          },
          base: '/root',
          path: '',
        }),
      },
    ),
  ).toMatchInlineSnapshot(`
    "
    .\\!container {
      width: 100% !important;
    }

    @media (min-width: 40rem) {
      .\\!container {
        max-width: 40rem !important;
      }
    }

    @media (min-width: 48rem) {
      .\\!container {
        max-width: 48rem !important;
      }
    }

    @media (min-width: 64rem) {
      .\\!container {
        max-width: 64rem !important;
      }
    }

    @media (min-width: 80rem) {
      .\\!container {
        max-width: 80rem !important;
      }
    }

    @media (min-width: 96rem) {
      .\\!container {
        max-width: 96rem !important;
      }
    }

    .container {
      width: 100%;
    }

    @media (min-width: 40rem) {
      .container {
        max-width: 40rem;
      }
    }

    @media (min-width: 48rem) {
      .container {
        max-width: 48rem;
      }
    }

    @media (min-width: 64rem) {
      .container {
        max-width: 64rem;
      }
    }

    @media (min-width: 80rem) {
      .container {
        max-width: 80rem;
      }
    }

    @media (min-width: 96rem) {
      .container {
        max-width: 96rem;
      }
    }

    .\\!container {
      margin-inline: auto !important;
      padding-inline: 2rem !important;
    }

    @media (min-width: 40rem) {
      .\\!container {
        max-width: none !important;
      }
    }

    @media (min-width: 48rem) {
      .\\!container {
        max-width: 48rem !important;
      }
    }

    @media (min-width: 1280px) {
      .\\!container {
        max-width: 1280px !important;
      }
    }

    @media (min-width: 1536px) {
      .\\!container {
        max-width: 1536px !important;
        padding-inline: 4rem !important;
      }
    }

    .container {
      margin-inline: auto;
      padding-inline: 2rem;
    }

    @media (min-width: 40rem) {
      .container {
        max-width: none;
      }
    }

    @media (min-width: 48rem) {
      .container {
        max-width: 48rem;
      }
    }

    @media (min-width: 1280px) {
      .container {
        max-width: 1280px;
      }
    }

    @media (min-width: 1536px) {
      .container {
        max-width: 1536px;
        padding-inline: 4rem;
      }
    }
    "
  `)
})

test('filters out complex breakpoints', async () => {
  expect(
    await run(
      ['container'],
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
              container: {
                center: true,
                padding: {
                  DEFAULT: '2rem',
                  '2xl': '4rem',
                },
                screens: {
                  sm: '20px',
                  md: { min: '100px' },
                  lg: { max: '200px' },
                  xl: { min: '300px', max: '400px' },
                  '2xl': { raw: 'print' },
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
    .container {
      width: 100%;
    }

    @media (min-width: 40rem) {
      .container {
        max-width: 40rem;
      }
    }

    @media (min-width: 48rem) {
      .container {
        max-width: 48rem;
      }
    }

    @media (min-width: 64rem) {
      .container {
        max-width: 64rem;
      }
    }

    @media (min-width: 80rem) {
      .container {
        max-width: 80rem;
      }
    }

    @media (min-width: 96rem) {
      .container {
        max-width: 96rem;
      }
    }

    .container {
      margin-inline: auto;
      padding-inline: 2rem;
    }

    @media (min-width: 40rem) {
      .container {
        max-width: none;
      }
    }

    @media (min-width: 20px) {
      .container {
        max-width: 20px;
      }
    }

    @media (min-width: 100px) {
      .container {
        max-width: 100px;
      }
    }

    @media (min-width: 300px) {
      .container {
        max-width: 300px;
      }
    }
    "
  `)
})
