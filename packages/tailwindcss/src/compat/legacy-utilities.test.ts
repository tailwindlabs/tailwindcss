import { expect, test } from 'vitest'
import { compileCss, run } from '../test-utils/run'

const css = String.raw

test('bg-gradient-*', async () => {
  expect(
    await compileCss(
      css`
        @tailwind utilities;
      `,
      [
        'bg-gradient-to-t',
        'bg-gradient-to-tr',
        'bg-gradient-to-r',
        'bg-gradient-to-br',
        'bg-gradient-to-b',
        'bg-gradient-to-bl',
        'bg-gradient-to-l',
        'bg-gradient-to-tl',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ".bg-gradient-to-b {
      --tw-gradient-position: to bottom in oklch, ;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-bl {
      --tw-gradient-position: to bottom left in oklch, ;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-br {
      --tw-gradient-position: to bottom right in oklch, ;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-l {
      --tw-gradient-position: to left in oklch, ;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-r {
      --tw-gradient-position: to right in oklch, ;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-t {
      --tw-gradient-position: to top in oklch, ;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-tl {
      --tw-gradient-position: to top left in oklch, ;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-tr {
      --tw-gradient-position: to top right in oklch, ;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }"
  `)
})

test('max-w-screen', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --breakpoint-sm: 40rem;
          --breakpoint-md: 48rem;
          --breakpoint-lg: 64rem;
          --breakpoint-xl: 80rem;
          --breakpoint-2xl: 96rem;
        }
        @tailwind utilities;
      `,
      [
        'max-w-screen-sm',
        'max-w-screen-md',
        'max-w-screen-lg',
        'max-w-screen-xl',
        'max-w-screen-2xl',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --breakpoint-sm: 40rem;
      --breakpoint-md: 48rem;
      --breakpoint-lg: 64rem;
      --breakpoint-xl: 80rem;
      --breakpoint-2xl: 96rem;
    }

    .max-w-screen-2xl {
      max-width: var(--breakpoint-2xl);
    }

    .max-w-screen-lg {
      max-width: var(--breakpoint-lg);
    }

    .max-w-screen-md {
      max-width: var(--breakpoint-md);
    }

    .max-w-screen-sm {
      max-width: var(--breakpoint-sm);
    }

    .max-w-screen-xl {
      max-width: var(--breakpoint-xl);
    }"
  `)
  expect(
    await run([
      'max-w-screen-oh',
      'max-w-screen-4',
      'max-w-screen-[4px]',
      '-max-w-screen-sm',
      '-max-w-screen-[4px]',
      'max-w-screen-none/foo',
      'max-w-screen-full/foo',
      'max-w-screen-max/foo',
      'max-w-screen-max/foo',
      'max-w-screen-fit/foo',
      'max-w-screen-4/foo',
      'max-w-screen-xl/foo',
      'max-w-screen-[4px]/foo',
    ]),
  ).toEqual('')
})
