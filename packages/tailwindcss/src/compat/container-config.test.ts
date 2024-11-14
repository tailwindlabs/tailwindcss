import { expect, test } from 'vitest'
import { compile } from '..'

const css = String.raw

test('creates a custom utility to extend the built-in container', async () => {
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
    }),
  })

  expect(compiler.build(['container'])).toMatchInlineSnapshot(`
    ":root {
      --breakpoint-sm: 40rem;
      --breakpoint-md: 48rem;
      --breakpoint-lg: 64rem;
      --breakpoint-xl: 80rem;
      --breakpoint-2xl: 96rem;
    }
    .container {
      width: 100%;
      @media (width >= 40rem) {
        max-width: 40rem;
      }
      @media (width >= 48rem) {
        max-width: 48rem;
      }
      @media (width >= 64rem) {
        max-width: 64rem;
      }
      @media (width >= 80rem) {
        max-width: 80rem;
      }
      @media (width >= 96rem) {
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
    }),
  })

  expect(compiler.build(['container'])).toMatchInlineSnapshot(`
    ":root {
      --breakpoint-sm: 40rem;
      --breakpoint-md: 48rem;
      --breakpoint-lg: 64rem;
      --breakpoint-xl: 80rem;
      --breakpoint-2xl: 96rem;
    }
    .container {
      width: 100%;
      @media (width >= 40rem) {
        max-width: 40rem;
      }
      @media (width >= 48rem) {
        max-width: 48rem;
      }
      @media (width >= 64rem) {
        max-width: 64rem;
      }
      @media (width >= 80rem) {
        max-width: 80rem;
      }
      @media (width >= 96rem) {
        max-width: 96rem;
      }
    }
    .container {
      padding-inline: 1rem;
      @media (width >= 64rem) {
        padding-inline: 2rem;
      }
      @media (width >= 96rem) {
        padding-inline: 3rem;
      }
    }
    "
  `)
})

test('allows breakpoints to be overwritten', async () => {
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
    }),
  })

  expect(compiler.build(['container'])).toMatchInlineSnapshot(`
    ":root {
      --breakpoint-sm: 40rem;
      --breakpoint-md: 48rem;
      --breakpoint-lg: 64rem;
      --breakpoint-xl: 80rem;
      --breakpoint-2xl: 96rem;
    }
    .container {
      width: 100%;
      @media (width >= 40rem) {
        max-width: 40rem;
      }
      @media (width >= 48rem) {
        max-width: 48rem;
      }
      @media (width >= 64rem) {
        max-width: 64rem;
      }
      @media (width >= 80rem) {
        max-width: 80rem;
      }
      @media (width >= 96rem) {
        max-width: 96rem;
      }
    }
    .container {
      @media (width >= 40rem) {
        max-width: none;
      }
      @media (width >= 48rem) {
        max-width: none;
      }
      @media (width >= 64rem) {
        max-width: none;
      }
      @media (width >= 80rem) {
        max-width: 1280px;
      }
      @media (width >= 96rem) {
        max-width: 1536px;
      }
    }
    "
  `)
})

test('legacy container component does not interfere with new --container variables', async () => {
  let input = css`
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
  `

  let compiler = await compile(input, {
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
    }),
  })

  expect(compiler.build(['max-w-sm'])).toMatchInlineSnapshot(`
    ":root {
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
    .max-w-sm {
      max-width: var(--container-sm);
    }
    "
  `)
})

test('combines custom padding and screen overwrites', async () => {
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
              xl: '1280px',
              '2xl': '1536px',
            },
          },
        },
      },
      base: '/root',
    }),
  })

  expect(compiler.build(['container'])).toMatchInlineSnapshot(`
    ":root {
      --breakpoint-sm: 40rem;
      --breakpoint-md: 48rem;
      --breakpoint-lg: 64rem;
      --breakpoint-xl: 80rem;
      --breakpoint-2xl: 96rem;
    }
    .container {
      width: 100%;
      @media (width >= 40rem) {
        max-width: 40rem;
      }
      @media (width >= 48rem) {
        max-width: 48rem;
      }
      @media (width >= 64rem) {
        max-width: 64rem;
      }
      @media (width >= 80rem) {
        max-width: 80rem;
      }
      @media (width >= 96rem) {
        max-width: 96rem;
      }
    }
    .container {
      margin-inline: auto;
      padding-inline: 2rem;
      @media (width >= 40rem) {
        max-width: none;
      }
      @media (width >= 48rem) {
        max-width: none;
      }
      @media (width >= 64rem) {
        max-width: none;
      }
      @media (width >= 80rem) {
        max-width: 1280px;
      }
      @media (width >= 96rem) {
        max-width: 1536px;
        padding-inline: 4rem;
      }
    }
    "
  `)
})
