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
      --tw-gradient-position: to bottom in oklab;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-bl {
      --tw-gradient-position: to bottom left in oklab;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-br {
      --tw-gradient-position: to bottom right in oklab;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-l {
      --tw-gradient-position: to left in oklab;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-r {
      --tw-gradient-position: to right in oklab;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-t {
      --tw-gradient-position: to top in oklab;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-tl {
      --tw-gradient-position: to top left in oklab;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    .bg-gradient-to-tr {
      --tw-gradient-position: to top right in oklab;
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
    ":root, :host {
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

test('box-decoration', async () => {
  expect(await run(['decoration-slice', 'decoration-clone'])).toMatchInlineSnapshot(`
    ".decoration-clone {
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
    }

    .decoration-slice {
      -webkit-box-decoration-break: slice;
      box-decoration-break: slice;
    }"
  `)
})

test('overflow-ellipsis', async () => {
  expect(await run(['overflow-ellipsis'])).toMatchInlineSnapshot(`
    ".overflow-ellipsis {
      text-overflow: ellipsis;
    }"
  `)
})

test('flex-grow', async () => {
  expect(await run(['flex-grow', 'flex-grow-0', 'flex-grow-[123]'])).toMatchInlineSnapshot(`
    ".flex-grow {
      flex-grow: 1;
    }

    .flex-grow-0 {
      flex-grow: 0;
    }

    .flex-grow-\\[123\\] {
      flex-grow: 123;
    }"
  `)
  expect(
    await run([
      '-flex-grow',
      'flex-grow--1',
      'flex-grow-1.5',
      '-flex-grow-0',
      '-flex-grow-[123]',
      'flex-grow-unknown',
      'flex-grow/foo',
      'flex-grow-0/foo',
      'flex-grow-[123]/foo',
    ]),
  ).toEqual('')
})

test('flex-shrink', async () => {
  expect(await run(['flex-shrink', 'flex-shrink-0', 'flex-shrink-[123]'])).toMatchInlineSnapshot(`
    ".flex-shrink {
      flex-shrink: 1;
    }

    .flex-shrink-0 {
      flex-shrink: 0;
    }

    .flex-shrink-\\[123\\] {
      flex-shrink: 123;
    }"
  `)
  expect(
    await run([
      '-flex-shrink',
      'flex-shrink--1',
      'flex-shrink-1.5',
      '-flex-shrink-0',
      '-flex-shrink-[123]',
      'flex-shrink-unknown',
      'flex-shrink/foo',
      'flex-shrink-0/foo',
      'flex-shrink-[123]/foo',
    ]),
  ).toEqual('')
})

test('rounded', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --radius-sm: 0.125rem;
          --radius: 0.25rem;
        }
        @tailwind utilities;
      `,
      ['rounded', 'rounded-full', 'rounded-none', 'rounded-sm', 'rounded-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded {
      border-radius: var(--radius);
    }

    .rounded-\\[4px\\] {
      border-radius: 4px;
    }

    .rounded-full {
      border-radius: 3.40282e38px;
    }

    .rounded-none {
      border-radius: 0;
    }

    .rounded-sm {
      border-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded',
      '-rounded-full',
      '-rounded-none',
      '-rounded-sm',
      '-rounded-[4px]',
      'rounded/foo',
      'rounded-full/foo',
      'rounded-none/foo',
      'rounded-sm/foo',
      'rounded-[4px]/foo',
    ]),
  ).toEqual('')
})

test('rounded-s', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --radius-none: 0px;
          --radius-full: 9999px;
          --radius-sm: 0.125rem;
          --radius: 0.25rem;
        }
        @tailwind utilities;
      `,
      ['rounded-s', 'rounded-s-full', 'rounded-s-none', 'rounded-s-sm', 'rounded-s-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-s {
      border-start-start-radius: var(--radius);
      border-end-start-radius: var(--radius);
    }

    .rounded-s-\\[4px\\] {
      border-start-start-radius: 4px;
      border-end-start-radius: 4px;
    }

    .rounded-s-full {
      border-start-start-radius: var(--radius-full);
      border-end-start-radius: var(--radius-full);
    }

    .rounded-s-none {
      border-start-start-radius: var(--radius-none);
      border-end-start-radius: var(--radius-none);
    }

    .rounded-s-sm {
      border-start-start-radius: var(--radius-sm);
      border-end-start-radius: var(--radius-sm);
    }"
  `)
})

test('rounded-tl', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --radius-none: 0px;
          --radius-full: 9999px;
          --radius-sm: 0.125rem;
          --radius: 0.25rem;
        }
        @tailwind utilities;
      `,
      ['rounded-tl', 'rounded-tl-full', 'rounded-tl-none', 'rounded-tl-sm', 'rounded-tl-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-tl {
      border-top-left-radius: var(--radius);
    }

    .rounded-tl-\\[4px\\] {
      border-top-left-radius: 4px;
    }

    .rounded-tl-full {
      border-top-left-radius: var(--radius-full);
    }

    .rounded-tl-none {
      border-top-left-radius: var(--radius-none);
    }

    .rounded-tl-sm {
      border-top-left-radius: var(--radius-sm);
    }"
  `)
})
