import { expect, test } from 'vitest'
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
    .sm\\:flex {
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
      --breakpoint-sm: 40rem;
      --breakpoint-md: 48rem;
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
            sm: '44rem',
            md: '49rem',
            lg: '64rem',
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
      'min-xs:max-md:underline',

      // Ensure other core variants appear at the end
      'print:items-end',
    ]),
  ).toMatchInlineSnapshot(`
    ":root {
      --breakpoint-md: 50rem;
    }
    .xs\\:flex {
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
    .sm\\:flex {
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
    .min-md\\:max-lg\\:underline {
      @media (width >= 50rem) {
        @media (width < 64rem) {
          text-decoration-line: underline;
        }
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

test('JS config `screens` only setup')
test('JS config `screens` overwrite CSS `--breakpoint-*`')
