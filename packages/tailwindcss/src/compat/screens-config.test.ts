import { expect, test } from 'vitest'
import { compile } from '..'

const css = String.raw

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

  expect(compiler.build(['sm:flex', 'md:flex', 'lg:flex', 'min-sm:max-md:underline']))
    .toMatchInlineSnapshot(`
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
      .lg\\:flex {
        @media (width >= 64rem) {
          display: flex;
        }
      }
      "
    `)
})
