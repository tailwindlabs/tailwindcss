import { describe, expect, test, vi } from 'vitest'
import { compile } from '.'
import { compileCss, optimizeCss, run } from './test-utils/run'

const css = String.raw

test('sr-only', async () => {
  expect(await run(['sr-only'])).toMatchInlineSnapshot(`
    ".sr-only {
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      position: absolute;
      overflow: hidden;
    }"
  `)
  expect(await run(['-sr-only', 'sr-only-[var(--value)]', 'sr-only/foo'])).toEqual('')
})

test('not-sr-only', async () => {
  expect(await run(['not-sr-only'])).toMatchInlineSnapshot(`
    ".not-sr-only {
      clip: auto;
      white-space: normal;
      width: auto;
      height: auto;
      margin: 0;
      padding: 0;
      position: static;
      overflow: visible;
    }"
  `)
  expect(await run(['-not-sr-only', 'not-sr-only-[var(--value)]', 'not-sr-only/foo'])).toEqual('')
})

test('pointer-events', async () => {
  expect(await run(['pointer-events-none', 'pointer-events-auto'])).toMatchInlineSnapshot(`
    ".pointer-events-auto {
      pointer-events: auto;
    }

    .pointer-events-none {
      pointer-events: none;
    }"
  `)
  expect(
    await run([
      '-pointer-events-none',
      '-pointer-events-auto',
      'pointer-events-[var(--value)]',
      'pointer-events-none/foo',
    ]),
  ).toEqual('')
})

test('visibility', async () => {
  expect(await run(['visible', 'invisible', 'collapse'])).toMatchInlineSnapshot(`
    ".collapse {
      visibility: collapse;
    }

    .invisible {
      visibility: hidden;
    }

    .visible {
      visibility: visible;
    }"
  `)
  expect(
    await run([
      '-visible',
      '-invisible',
      '-collapse',
      'visible/foo',
      'invisible/foo',
      'collapse/foo',
    ]),
  ).toEqual('')
})

test('position', async () => {
  expect(await run(['static', 'fixed', 'absolute', 'relative', 'sticky'])).toMatchInlineSnapshot(`
    ".absolute {
      position: absolute;
    }

    .fixed {
      position: fixed;
    }

    .relative {
      position: relative;
    }

    .static {
      position: static;
    }

    .sticky {
      position: sticky;
    }"
  `)
  expect(
    await run([
      '-static',
      '-fixed',
      '-absolute',
      '-relative',
      '-sticky',
      'static/foo',
      'fixed/foo',
      'absolute/foo',
      'relative/foo',
      'sticky/foo',
    ]),
  ).toEqual('')
})

test('inset', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --inset-shadow-sm: inset 0 1px 1px rgb(0 0 0 / 0.05);
          --inset-shadowned: 1940px;
        }
        @tailwind utilities;
      `,
      [
        'inset-auto',
        'inset-shadow-sm',
        'inset-shadowned',
        '-inset-full',
        'inset-full',
        'inset-3/4',
        'inset-4',
        '-inset-4',
        'inset-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-shadow: 0 0 #0000;
          --tw-shadow-color: initial;
          --tw-shadow-alpha: 100%;
          --tw-inset-shadow: 0 0 #0000;
          --tw-inset-shadow-color: initial;
          --tw-inset-shadow-alpha: 100%;
          --tw-ring-color: initial;
          --tw-ring-shadow: 0 0 #0000;
          --tw-inset-ring-color: initial;
          --tw-inset-ring-shadow: 0 0 #0000;
          --tw-ring-inset: initial;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-offset-shadow: 0 0 #0000;
        }
      }
    }

    :root, :host {
      --spacing-4: 1rem;
      --inset-shadowned: 1940px;
    }

    .-inset-4 {
      inset: calc(var(--spacing-4) * -1);
    }

    .-inset-full {
      inset: -100%;
    }

    .inset-3\\/4 {
      inset: 75%;
    }

    .inset-4 {
      inset: var(--spacing-4);
    }

    .inset-\\[4px\\] {
      inset: 4px;
    }

    .inset-auto {
      inset: auto;
    }

    .inset-full {
      inset: 100%;
    }

    .inset-shadowned {
      inset: var(--inset-shadowned);
    }

    .inset-shadow-sm {
      --tw-inset-shadow: inset 0 1px 1px var(--tw-inset-shadow-color, #0000000d);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    @property --tw-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-inset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-inset-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-ring-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-ring-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-ring-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-inset-ring-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-ring-inset {
      syntax: "*";
      inherits: false
    }

    @property --tw-ring-offset-width {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-ring-offset-color {
      syntax: "*";
      inherits: false;
      initial-value: #fff;
    }

    @property --tw-ring-offset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }"
  `)
  expect(
    await run([
      'inset',
      'inset--1',
      'inset--1/2',
      'inset--1/-2',
      'inset-1/-2',
      'inset-auto/foo',
      '-inset-full/foo',
      'inset-full/foo',
      'inset-3/4/foo',
      'inset-4/foo',
      '-inset-4/foo',
      'inset-[4px]/foo',
    ]),
  ).toEqual('')
})

test('inset-x', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --inset-shadowned: 1940px;
        }
        @tailwind utilities;
      `,
      [
        'inset-x-shadowned',
        'inset-x-auto',
        'inset-x-full',
        '-inset-x-full',
        'inset-x-3/4',
        'inset-x-4',
        '-inset-x-4',
        'inset-x-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
      --inset-shadowned: 1940px;
    }

    .-inset-x-4 {
      inset-inline: calc(var(--spacing-4) * -1);
    }

    .-inset-x-full {
      inset-inline: -100%;
    }

    .inset-x-3\\/4 {
      inset-inline: 75%;
    }

    .inset-x-4 {
      inset-inline: var(--spacing-4);
    }

    .inset-x-\\[4px\\] {
      inset-inline: 4px;
    }

    .inset-x-auto {
      inset-inline: auto;
    }

    .inset-x-full {
      inset-inline: 100%;
    }

    .inset-x-shadowned {
      inset-inline: var(--inset-shadowned);
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme reference {
          --spacing-4: 1rem;
          --inset-shadow-sm: inset 0 1px 1px #0000000d;
        }
        @tailwind utilities;
      `,
      [
        'inset-x-shadow-sm',
        'inset-x',
        'inset-x--1',
        'inset-x--1/2',
        'inset-x--1/-2',
        'inset-x-1/-2',
        'inset-x-auto/foo',
        'inset-x-full/foo',
        '-inset-x-full/foo',
        'inset-x-3/4/foo',
        'inset-x-4/foo',
        '-inset-x-4/foo',
        'inset-x-[4px]/foo',
      ],
    ),
  ).toEqual('')
})

test('inset-y', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --inset-shadowned: 1940px;
        }
        @tailwind utilities;
      `,
      [
        'inset-y-shadowned',
        'inset-y-auto',
        'inset-y-full',
        '-inset-y-full',
        'inset-y-3/4',
        'inset-y-4',
        '-inset-y-4',
        'inset-y-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
      --inset-shadowned: 1940px;
    }

    .-inset-y-4 {
      inset-block: calc(var(--spacing-4) * -1);
    }

    .-inset-y-full {
      inset-block: -100%;
    }

    .inset-y-3\\/4 {
      inset-block: 75%;
    }

    .inset-y-4 {
      inset-block: var(--spacing-4);
    }

    .inset-y-\\[4px\\] {
      inset-block: 4px;
    }

    .inset-y-auto {
      inset-block: auto;
    }

    .inset-y-full {
      inset-block: 100%;
    }

    .inset-y-shadowned {
      inset-block: var(--inset-shadowned);
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme reference {
          --spacing-4: 1rem;
          --inset-shadow-sm: inset 0 1px 1px rgb(0 0 0 / 0.05);
        }
        @tailwind utilities;
      `,
      [
        'inset-y-shadow-sm',
        'inset-y',
        'inset-y--1',
        'inset-y--1/2',
        'inset-y--1/-2',
        'inset-1/-2',
        'inset-y-auto/foo',
        'inset-y-full/foo',
        '-inset-y-full/foo',
        'inset-y-3/4/foo',
        'inset-y-4/foo',
        '-inset-y-4/foo',
        'inset-y-[4px]/foo',
      ],
    ),
  ).toEqual('')
})

test('start', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --inset-shadowned: 1940px;
        }
        @tailwind utilities;
      `,
      [
        'start-shadowned',
        'start-auto',
        '-start-full',
        'start-full',
        'start-3/4',
        'start-4',
        '-start-4',
        'start-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
      --inset-shadowned: 1940px;
    }

    .-start-4 {
      inset-inline-start: calc(var(--spacing-4) * -1);
    }

    .-start-full {
      inset-inline-start: -100%;
    }

    .start-3\\/4 {
      inset-inline-start: 75%;
    }

    .start-4 {
      inset-inline-start: var(--spacing-4);
    }

    .start-\\[4px\\] {
      inset-inline-start: 4px;
    }

    .start-auto {
      inset-inline-start: auto;
    }

    .start-full {
      inset-inline-start: 100%;
    }

    .start-shadowned {
      inset-inline-start: var(--inset-shadowned);
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme reference {
          --spacing-4: 1rem;
          --inset-shadow-sm: inset 0 1px 1px rgb(0 0 0 / 0.05);
        }
        @tailwind utilities;
      `,
      [
        'start-shadow-sm',
        'start',
        'start--1',
        'start--1/2',
        'start--1/-2',
        'start-1/-2',
        'start-auto/foo',
        '-start-full/foo',
        'start-full/foo',
        'start-3/4/foo',
        'start-4/foo',
        '-start-4/foo',
        'start-[4px]/foo',
      ],
    ),
  ).toEqual('')
})

test('end', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --inset-shadowned: 1940px;
        }
        @tailwind utilities;
      `,
      [
        'end-shadowned',
        'end-auto',
        '-end-full',
        'end-full',
        'end-3/4',
        'end-4',
        '-end-4',
        'end-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
      --inset-shadowned: 1940px;
    }

    .-end-4 {
      inset-inline-end: calc(var(--spacing-4) * -1);
    }

    .-end-full {
      inset-inline-end: -100%;
    }

    .end-3\\/4 {
      inset-inline-end: 75%;
    }

    .end-4 {
      inset-inline-end: var(--spacing-4);
    }

    .end-\\[4px\\] {
      inset-inline-end: 4px;
    }

    .end-auto {
      inset-inline-end: auto;
    }

    .end-full {
      inset-inline-end: 100%;
    }

    .end-shadowned {
      inset-inline-end: var(--inset-shadowned);
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme reference {
          --spacing-4: 1rem;
          --inset-shadow-sm: inset 0 1px 1px rgb(0 0 0 / 0.05);
        }
        @tailwind utilities;
      `,
      [
        'end-shadow-sm',
        'end',
        'end--1',
        'end--1/2',
        'end--1/-2',
        'end-1/-2',
        'end-auto/foo',
        '-end-full/foo',
        'end-full/foo',
        'end-3/4/foo',
        'end-4/foo',
        '-end-4/foo',
        'end-[4px]/foo',
      ],
    ),
  ).toEqual('')
})

test('top', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --inset-shadowned: 1940px;
        }
        @tailwind utilities;
      `,

      [
        'top-shadowned',
        'top-auto',
        '-top-full',
        'top-full',
        'top-3/4',
        'top-4',
        '-top-4',
        'top-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
      --inset-shadowned: 1940px;
    }

    .-top-4 {
      top: calc(var(--spacing-4) * -1);
    }

    .-top-full {
      top: -100%;
    }

    .top-3\\/4 {
      top: 75%;
    }

    .top-4 {
      top: var(--spacing-4);
    }

    .top-\\[4px\\] {
      top: 4px;
    }

    .top-auto {
      top: auto;
    }

    .top-full {
      top: 100%;
    }

    .top-shadowned {
      top: var(--inset-shadowned);
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme reference {
          --spacing-4: 1rem;
          --inset-shadow-sm: inset 0 1px 1px rgb(0 0 0 / 0.05);
        }
        @tailwind utilities;
      `,
      [
        'top-shadow-sm',
        'top',
        'top--1',
        'top--1/2',
        'top--1/-2',
        'top-1/-2',
        'top-auto/foo',
        '-top-full/foo',
        'top-full/foo',
        'top-3/4/foo',
        'top-4/foo',
        '-top-4/foo',
        'top-[4px]/foo',
      ],
    ),
  ).toEqual('')
})

test('right', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --inset-shadowned: 1940px;
        }
        @tailwind utilities;
      `,
      [
        'right-shadowned',
        'right-auto',
        '-right-full',
        'right-full',
        'right-3/4',
        'right-4',
        '-right-4',
        'right-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
      --inset-shadowned: 1940px;
    }

    .-right-4 {
      right: calc(var(--spacing-4) * -1);
    }

    .-right-full {
      right: -100%;
    }

    .right-3\\/4 {
      right: 75%;
    }

    .right-4 {
      right: var(--spacing-4);
    }

    .right-\\[4px\\] {
      right: 4px;
    }

    .right-auto {
      right: auto;
    }

    .right-full {
      right: 100%;
    }

    .right-shadowned {
      right: var(--inset-shadowned);
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme reference {
          --spacing-4: 1rem;
          --inset-shadow-sm: inset 0 1px 1px rgb(0 0 0 / 0.05);
        }
        @tailwind utilities;
      `,
      [
        'right-shadow-sm',
        'right',
        'right--1',
        'right--1/2',
        'right--1/-2',
        'right-1/-2',
        'right-auto/foo',
        '-right-full/foo',
        'right-full/foo',
        'right-3/4/foo',
        'right-4/foo',
        '-right-4/foo',
        'right-[4px]/foo',
      ],
    ),
  ).toEqual('')
})

test('bottom', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --inset-shadowned: 1940px;
        }
        @tailwind utilities;
      `,
      [
        'bottom-shadowned',
        'bottom-auto',
        '-bottom-full',
        'bottom-full',
        'bottom-3/4',
        'bottom-4',
        '-bottom-4',
        'bottom-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
      --inset-shadowned: 1940px;
    }

    .-bottom-4 {
      bottom: calc(var(--spacing-4) * -1);
    }

    .-bottom-full {
      bottom: -100%;
    }

    .bottom-3\\/4 {
      bottom: 75%;
    }

    .bottom-4 {
      bottom: var(--spacing-4);
    }

    .bottom-\\[4px\\] {
      bottom: 4px;
    }

    .bottom-auto {
      bottom: auto;
    }

    .bottom-full {
      bottom: 100%;
    }

    .bottom-shadowned {
      bottom: var(--inset-shadowned);
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme reference {
          --spacing-4: 1rem;
          --inset-shadow-sm: inset 0 1px 1px rgb(0 0 0 / 0.05);
        }
        @tailwind utilities;
      `,
      [
        'bottom-shadow-sm',
        'bottom',
        'bottom--1',
        'bottom--1/2',
        'bottom--1/-2',
        'bottom-1/-2',
        'bottom-auto/foo',
        '-bottom-full/foo',
        'bottom-full/foo',
        'bottom-3/4/foo',
        'bottom-4/foo',
        '-bottom-4/foo',
        'bottom-[4px]/foo',
      ],
    ),
  ).toEqual('')
})

test('left', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --inset-shadowned: 1940px;
        }
        @tailwind utilities;
      `,
      [
        'left-shadowned',
        'left-auto',
        '-left-full',
        'left-full',
        'left-3/4',
        'left-4',
        '-left-4',
        'left-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
      --inset-shadowned: 1940px;
    }

    .-left-4 {
      left: calc(var(--spacing-4) * -1);
    }

    .-left-full {
      left: -100%;
    }

    .left-3\\/4 {
      left: 75%;
    }

    .left-4 {
      left: var(--spacing-4);
    }

    .left-\\[4px\\] {
      left: 4px;
    }

    .left-auto {
      left: auto;
    }

    .left-full {
      left: 100%;
    }

    .left-shadowned {
      left: var(--inset-shadowned);
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme reference {
          --spacing-4: 1rem;
          --inset-shadow-sm: inset 0 1px 1px rgb(0 0 0 / 0.05);
        }
        @tailwind utilities;
      `,
      [
        'left-shadow-sm',
        'left',
        'left--1',
        'left--1/2',
        'left--1/-2',
        'left-1/-2',
        'left-auto/foo',
        '-left-full/foo',
        'left-full/foo',
        'left-3/4/foo',
        'left-4/foo',
        '-left-4/foo',
        'left-[4px]/foo',
      ],
    ),
  ).toEqual('')
})

test('isolation', async () => {
  expect(await run(['isolate', 'isolation-auto'])).toMatchInlineSnapshot(`
    ".isolate {
      isolation: isolate;
    }

    .isolation-auto {
      isolation: auto;
    }"
  `)
  expect(await run(['-isolate', '-isolation-auto', 'isolate/foo', 'isolation-auto/foo'])).toEqual(
    '',
  )
})

test('z-index', async () => {
  expect(await run(['z-auto', 'z-10', '-z-10', 'z-[123]', '-z-[var(--value)]']))
    .toMatchInlineSnapshot(`
      ".-z-10 {
        z-index: calc(10 * -1);
      }

      .-z-\\[var\\(--value\\)\\] {
        z-index: calc(var(--value) * -1);
      }

      .z-10 {
        z-index: 10;
      }

      .z-\\[123\\] {
        z-index: 123;
      }

      .z-auto {
        z-index: auto;
      }"
    `)
  expect(
    await run([
      'z',
      'z--1',
      '-z-auto',
      'z-unknown',
      'z-123.5',
      'z-auto/foo',
      'z-10/foo',
      '-z-10/foo',
      'z-[123]/foo',
      '-z-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('order', async () => {
  expect(
    await run([
      'order-4',
      '-order-4',
      'order-[123]',
      '-order-[var(--value)]',
      'order-first',
      'order-last',
      'order-none',
    ]),
  ).toMatchInlineSnapshot(`
    ".-order-4 {
      order: calc(4 * -1);
    }

    .-order-\\[var\\(--value\\)\\] {
      order: calc(var(--value) * -1);
    }

    .order-4 {
      order: 4;
    }

    .order-\\[123\\] {
      order: 123;
    }

    .order-first {
      order: -9999;
    }

    .order-last {
      order: 9999;
    }

    .order-none {
      order: 0;
    }"
  `)
  expect(
    await run([
      'order',
      'order--4',
      '-order-first',
      '-order-last',
      '-order-none',
      'order-unknown',
      'order-123.5',
      'order-4/foo',
      '-order-4/foo',
      'order-[123]/foo',
      '-order-[var(--value)]/foo',
      'order-first/foo',
      'order-last/foo',
      'order-none/foo',
    ]),
  ).toEqual('')
})

test('col', async () => {
  expect(
    await run([
      'col-11',
      '-col-12',
      'col-auto',
      'col-span-4',
      'col-span-17',
      'col-span-full',
      'col-[span_123/span_123]',
      'col-span-[var(--my-variable)]',
    ]),
  ).toMatchInlineSnapshot(`
    ".-col-12 {
      grid-column: calc(12 * -1);
    }

    .col-11 {
      grid-column: 11;
    }

    .col-\\[span_123\\/span_123\\] {
      grid-column: span 123 / span 123;
    }

    .col-auto {
      grid-column: auto;
    }

    .col-span-4 {
      grid-column: span 4 / span 4;
    }

    .col-span-17 {
      grid-column: span 17 / span 17;
    }

    .col-span-\\[var\\(--my-variable\\)\\] {
      grid-column: span var(--my-variable) / span var(--my-variable);
    }

    .col-span-full {
      grid-column: 1 / -1;
    }"
  `)
  expect(
    await run([
      'col',
      'col-span',
      'col-span--1',
      '-col-span-4',
      'col-span-unknown',
      'col-auto/foo',
      'col-span-4/foo',
      'col-span-17/foo',
      'col-span-full/foo',
      'col-[span_123/span_123]/foo',
      'col-span-[var(--my-variable)]/foo',
    ]),
  ).toEqual('')
})

test('col-start', async () => {
  expect(
    await run(['col-start-auto', 'col-start-4', 'col-start-99', 'col-start-[123]', '-col-start-4']),
  ).toMatchInlineSnapshot(`
    ".-col-start-4 {
      grid-column-start: calc(4 * -1);
    }

    .col-start-4 {
      grid-column-start: 4;
    }

    .col-start-99 {
      grid-column-start: 99;
    }

    .col-start-\\[123\\] {
      grid-column-start: 123;
    }

    .col-start-auto {
      grid-column-start: auto;
    }"
  `)
  expect(
    await run([
      'col-start',
      'col-start--1',
      'col-start-unknown',
      'col-start-auto/foo',
      'col-start-4/foo',
      'col-start-99/foo',
      'col-start-[123]/foo',
      '-col-start-4/foo',
    ]),
  ).toEqual('')
})

test('col-end', async () => {
  expect(await run(['col-end-auto', 'col-end-4', 'col-end-99', 'col-end-[123]', '-col-end-4']))
    .toMatchInlineSnapshot(`
      ".-col-end-4 {
        grid-column-end: calc(4 * -1);
      }

      .col-end-4 {
        grid-column-end: 4;
      }

      .col-end-99 {
        grid-column-end: 99;
      }

      .col-end-\\[123\\] {
        grid-column-end: 123;
      }

      .col-end-auto {
        grid-column-end: auto;
      }"
    `)
  expect(
    await run([
      'col-end',
      'col-end--1',
      'col-end-unknown',
      'col-end-auto/foo',
      'col-end-4/foo',
      'col-end-99/foo',
      'col-end-[123]/foo',
      '-col-end-4/foo',
    ]),
  ).toEqual('')
})

test('row', async () => {
  expect(
    await run([
      'row-11',
      '-row-12',
      'row-auto',
      'row-span-4',
      'row-span-17',
      'row-span-full',
      'row-[span_123/span_123]',
      'row-span-[var(--my-variable)]',
    ]),
  ).toMatchInlineSnapshot(`
    ".-row-12 {
      grid-row: calc(12 * -1);
    }

    .row-11 {
      grid-row: 11;
    }

    .row-\\[span_123\\/span_123\\] {
      grid-row: span 123 / span 123;
    }

    .row-auto {
      grid-row: auto;
    }

    .row-span-4 {
      grid-row: span 4 / span 4;
    }

    .row-span-17 {
      grid-row: span 17 / span 17;
    }

    .row-span-\\[var\\(--my-variable\\)\\] {
      grid-row: span var(--my-variable) / span var(--my-variable);
    }

    .row-span-full {
      grid-row: 1 / -1;
    }"
  `)
  expect(
    await run([
      'row',
      'row-span',
      'row-span--1',
      '-row-span-4',
      'row-span-unknown',
      'row-auto/foo',
      'row-span-4/foo',
      'row-span-17/foo',
      'row-span-full/foo',
      'row-[span_123/span_123]/foo',
      'row-span-[var(--my-variable)]/foo',
    ]),
  ).toEqual('')
})

test('row-start', async () => {
  expect(
    await run(['row-start-auto', 'row-start-4', 'row-start-99', 'row-start-[123]', '-row-start-4']),
  ).toMatchInlineSnapshot(`
    ".-row-start-4 {
      grid-row-start: calc(4 * -1);
    }

    .row-start-4 {
      grid-row-start: 4;
    }

    .row-start-99 {
      grid-row-start: 99;
    }

    .row-start-\\[123\\] {
      grid-row-start: 123;
    }

    .row-start-auto {
      grid-row-start: auto;
    }"
  `)
  expect(
    await run([
      'row-start',
      'row-start--1',
      'row-start-unknown',
      'row-start-auto/foo',
      'row-start-4/foo',
      'row-start-99/foo',
      'row-start-[123]/foo',
      '-row-start-4/foo',
    ]),
  ).toEqual('')
})

test('row-end', async () => {
  expect(await run(['row-end-auto', 'row-end-4', 'row-end-99', 'row-end-[123]', '-row-end-4']))
    .toMatchInlineSnapshot(`
      ".-row-end-4 {
        grid-row-end: calc(4 * -1);
      }

      .row-end-4 {
        grid-row-end: 4;
      }

      .row-end-99 {
        grid-row-end: 99;
      }

      .row-end-\\[123\\] {
        grid-row-end: 123;
      }

      .row-end-auto {
        grid-row-end: auto;
      }"
    `)
  expect(
    await run([
      'row-end',
      'row-end--1',
      'row-end-unknown',
      'row-end-auto/foo',
      'row-end-4/foo',
      'row-end-99/foo',
      'row-end-[123]/foo',
      '-row-end-4/foo',
    ]),
  ).toEqual('')
})

test('float', async () => {
  expect(await run(['float-start', 'float-end', 'float-right', 'float-left', 'float-none']))
    .toMatchInlineSnapshot(`
      ".float-end {
        float: inline-end;
      }

      .float-left {
        float: left;
      }

      .float-none {
        float: none;
      }

      .float-right {
        float: right;
      }

      .float-start {
        float: inline-start;
      }"
    `)
  expect(
    await run([
      'float',
      '-float-start',
      '-float-end',
      '-float-right',
      '-float-left',
      '-float-none',
      'float-start/foo',
      'float-end/foo',
      'float-right/foo',
      'float-left/foo',
      'float-none/foo',
    ]),
  ).toEqual('')
})

test('clear', async () => {
  expect(
    await run([
      'clear-start',
      'clear-end',
      'clear-right',
      'clear-left',
      'clear-both',
      'clear-none',
    ]),
  ).toMatchInlineSnapshot(`
    ".clear-both {
      clear: both;
    }

    .clear-end {
      clear: inline-end;
    }

    .clear-left {
      clear: left;
    }

    .clear-none {
      clear: none;
    }

    .clear-right {
      clear: right;
    }

    .clear-start {
      clear: inline-start;
    }"
  `)
  expect(
    await run([
      'clear',
      '-clear-start',
      '-clear-end',
      '-clear-right',
      '-clear-left',
      '-clear-both',
      '-clear-none',
      'clear-start/foo',
      'clear-end/foo',
      'clear-right/foo',
      'clear-left/foo',
      'clear-both/foo',
      'clear-none/foo',
    ]),
  ).toEqual('')
})

test('margin', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['m-auto', 'm-4', 'm-[4px]', '-m-4', '-m-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .-m-4 {
      margin: calc(var(--spacing-4) * -1);
    }

    .-m-\\[var\\(--value\\)\\] {
      margin: calc(var(--value) * -1);
    }

    .m-4 {
      margin: var(--spacing-4);
    }

    .m-\\[4px\\] {
      margin: 4px;
    }

    .m-auto {
      margin: auto;
    }"
  `)
  expect(
    await run(['m', 'm-auto/foo', 'm-4/foo', 'm-[4px]/foo', '-m-4/foo', '-m-[var(--value)]/foo']),
  ).toEqual('')
})

test('mx', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      [
        'mx-auto',
        'mx-1',
        'mx-4',
        'mx-99',
        'mx-big',
        'mx-[4px]',
        '-mx-4',
        '-mx-big',
        '-mx-[4px]',
        'mx-[var(--my-var)]',
        '-mx-[var(--my-var)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .-mx-4 {
      margin-inline: calc(var(--spacing) * -4);
    }

    .-mx-\\[4px\\] {
      margin-inline: -4px;
    }

    .-mx-\\[var\\(--my-var\\)\\] {
      margin-inline: calc(var(--my-var) * -1);
    }

    .-mx-big {
      margin-inline: calc(var(--spacing-big) * -1);
    }

    .mx-1 {
      margin-inline: calc(var(--spacing) * 1);
    }

    .mx-4 {
      margin-inline: calc(var(--spacing) * 4);
    }

    .mx-99 {
      margin-inline: calc(var(--spacing) * 99);
    }

    .mx-\\[4px\\] {
      margin-inline: 4px;
    }

    .mx-\\[var\\(--my-var\\)\\] {
      margin-inline: var(--my-var);
    }

    .mx-auto {
      margin-inline: auto;
    }

    .mx-big {
      margin-inline: var(--spacing-big);
    }"
  `)
  expect(
    await run([
      'mx',
      'mx-auto/foo',
      'mx-4/foo',
      'mx-[4px]/foo',
      '-mx-4/foo',
      '-mx-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('my', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      [
        'my-1',
        'my-99',
        'my-2.5',
        'my-big',
        'my-[4px]',
        '-my-4',
        '-my-2.5',
        '-my-big',
        '-my-[4px]',
        'my-[var(--my-var)]',
        '-my-[var(--my-var)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .-my-2\\.5 {
      margin-block: calc(var(--spacing) * -2.5);
    }

    .-my-4 {
      margin-block: calc(var(--spacing) * -4);
    }

    .-my-\\[4px\\] {
      margin-block: -4px;
    }

    .-my-\\[var\\(--my-var\\)\\] {
      margin-block: calc(var(--my-var) * -1);
    }

    .-my-big {
      margin-block: calc(var(--spacing-big) * -1);
    }

    .my-1 {
      margin-block: calc(var(--spacing) * 1);
    }

    .my-2\\.5 {
      margin-block: calc(var(--spacing) * 2.5);
    }

    .my-99 {
      margin-block: calc(var(--spacing) * 99);
    }

    .my-\\[4px\\] {
      margin-block: 4px;
    }

    .my-\\[var\\(--my-var\\)\\] {
      margin-block: var(--my-var);
    }

    .my-big {
      margin-block: var(--spacing-big);
    }"
  `)
  expect(
    await run([
      'my',
      'my-auto/foo',
      'my-4/foo',
      'my-[4px]/foo',
      '-my-4/foo',
      '-my-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('mt', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      [
        'mt-1',
        'mt-99',
        'mt-2.5',
        'mt-big',
        'mt-[4px]',
        '-mt-4',
        '-mt-2.5',
        '-mt-big',
        '-mt-[4px]',
        'mt-[var(--my-var)]',
        '-mt-[var(--my-var)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .-mt-2\\.5 {
      margin-top: calc(var(--spacing) * -2.5);
    }

    .-mt-4 {
      margin-top: calc(var(--spacing) * -4);
    }

    .-mt-\\[4px\\] {
      margin-top: -4px;
    }

    .-mt-\\[var\\(--my-var\\)\\] {
      margin-top: calc(var(--my-var) * -1);
    }

    .-mt-big {
      margin-top: calc(var(--spacing-big) * -1);
    }

    .mt-1 {
      margin-top: calc(var(--spacing) * 1);
    }

    .mt-2\\.5 {
      margin-top: calc(var(--spacing) * 2.5);
    }

    .mt-99 {
      margin-top: calc(var(--spacing) * 99);
    }

    .mt-\\[4px\\] {
      margin-top: 4px;
    }

    .mt-\\[var\\(--my-var\\)\\] {
      margin-top: var(--my-var);
    }

    .mt-big {
      margin-top: var(--spacing-big);
    }"
  `)
  expect(
    await run([
      'mt',
      'mt-auto/foo',
      'mt-4/foo',
      'mt-[4px]/foo',
      '-mt-4/foo',
      '-mt-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('ms', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      [
        'ms-1',
        'ms-99',
        'ms-2.5',
        'ms-big',
        'ms-[4px]',
        '-ms-4',
        '-ms-2.5',
        '-ms-big',
        '-ms-[4px]',
        'ms-[var(--my-var)]',
        '-ms-[var(--my-var)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .-ms-2\\.5 {
      margin-inline-start: calc(var(--spacing) * -2.5);
    }

    .-ms-4 {
      margin-inline-start: calc(var(--spacing) * -4);
    }

    .-ms-\\[4px\\] {
      margin-inline-start: -4px;
    }

    .-ms-\\[var\\(--my-var\\)\\] {
      margin-inline-start: calc(var(--my-var) * -1);
    }

    .-ms-big {
      margin-inline-start: calc(var(--spacing-big) * -1);
    }

    .ms-1 {
      margin-inline-start: calc(var(--spacing) * 1);
    }

    .ms-2\\.5 {
      margin-inline-start: calc(var(--spacing) * 2.5);
    }

    .ms-99 {
      margin-inline-start: calc(var(--spacing) * 99);
    }

    .ms-\\[4px\\] {
      margin-inline-start: 4px;
    }

    .ms-\\[var\\(--my-var\\)\\] {
      margin-inline-start: var(--my-var);
    }

    .ms-big {
      margin-inline-start: var(--spacing-big);
    }"
  `)
  expect(
    await run([
      'ms',
      'ms-auto/foo',
      'ms-4/foo',
      'ms-[4px]/foo',
      '-ms-4/foo',
      '-ms-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('me', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      [
        'me-1',
        'me-99',
        'me-2.5',
        'me-big',
        'me-[4px]',
        '-me-4',
        '-me-2.5',
        '-me-big',
        '-me-[4px]',
        'me-[var(--my-var)]',
        '-me-[var(--my-var)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .-me-2\\.5 {
      margin-inline-end: calc(var(--spacing) * -2.5);
    }

    .-me-4 {
      margin-inline-end: calc(var(--spacing) * -4);
    }

    .-me-\\[4px\\] {
      margin-inline-end: -4px;
    }

    .-me-\\[var\\(--my-var\\)\\] {
      margin-inline-end: calc(var(--my-var) * -1);
    }

    .-me-big {
      margin-inline-end: calc(var(--spacing-big) * -1);
    }

    .me-1 {
      margin-inline-end: calc(var(--spacing) * 1);
    }

    .me-2\\.5 {
      margin-inline-end: calc(var(--spacing) * 2.5);
    }

    .me-99 {
      margin-inline-end: calc(var(--spacing) * 99);
    }

    .me-\\[4px\\] {
      margin-inline-end: 4px;
    }

    .me-\\[var\\(--my-var\\)\\] {
      margin-inline-end: var(--my-var);
    }

    .me-big {
      margin-inline-end: var(--spacing-big);
    }"
  `)
  expect(
    await run([
      'me',
      'me-auto/foo',
      'me-4/foo',
      'me-[4px]/foo',
      '-me-4/foo',
      '-me-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('mr', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      [
        'mr-1',
        'mr-99',
        'mr-2.5',
        'mr-big',
        'mr-[4px]',
        '-mr-4',
        '-mr-2.5',
        '-mr-big',
        '-mr-[4px]',
        'mr-[var(--my-var)]',
        '-mr-[var(--my-var)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .-mr-2\\.5 {
      margin-right: calc(var(--spacing) * -2.5);
    }

    .-mr-4 {
      margin-right: calc(var(--spacing) * -4);
    }

    .-mr-\\[4px\\] {
      margin-right: -4px;
    }

    .-mr-\\[var\\(--my-var\\)\\] {
      margin-right: calc(var(--my-var) * -1);
    }

    .-mr-big {
      margin-right: calc(var(--spacing-big) * -1);
    }

    .mr-1 {
      margin-right: calc(var(--spacing) * 1);
    }

    .mr-2\\.5 {
      margin-right: calc(var(--spacing) * 2.5);
    }

    .mr-99 {
      margin-right: calc(var(--spacing) * 99);
    }

    .mr-\\[4px\\] {
      margin-right: 4px;
    }

    .mr-\\[var\\(--my-var\\)\\] {
      margin-right: var(--my-var);
    }

    .mr-big {
      margin-right: var(--spacing-big);
    }"
  `)
  expect(
    await run([
      'mr',
      'mr-auto/foo',
      'mr-4/foo',
      'mr-[4px]/foo',
      '-mr-4/foo',
      '-mr-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('mb', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      [
        'mb-1',
        'mb-99',
        'mb-2.5',
        'mb-big',
        'mb-[4px]',
        '-mb-4',
        '-mb-2.5',
        '-mb-big',
        '-mb-[4px]',
        'mb-[var(--my-var)]',
        '-mb-[var(--my-var)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .-mb-2\\.5 {
      margin-bottom: calc(var(--spacing) * -2.5);
    }

    .-mb-4 {
      margin-bottom: calc(var(--spacing) * -4);
    }

    .-mb-\\[4px\\] {
      margin-bottom: -4px;
    }

    .-mb-\\[var\\(--my-var\\)\\] {
      margin-bottom: calc(var(--my-var) * -1);
    }

    .-mb-big {
      margin-bottom: calc(var(--spacing-big) * -1);
    }

    .mb-1 {
      margin-bottom: calc(var(--spacing) * 1);
    }

    .mb-2\\.5 {
      margin-bottom: calc(var(--spacing) * 2.5);
    }

    .mb-99 {
      margin-bottom: calc(var(--spacing) * 99);
    }

    .mb-\\[4px\\] {
      margin-bottom: 4px;
    }

    .mb-\\[var\\(--my-var\\)\\] {
      margin-bottom: var(--my-var);
    }

    .mb-big {
      margin-bottom: var(--spacing-big);
    }"
  `)
  expect(
    await run([
      'mb',
      'mb-auto/foo',
      'mb-4/foo',
      'mb-[4px]/foo',
      '-mb-4/foo',
      '-mb-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('ml', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      [
        'ml-1',
        'ml-99',
        'ml-2.5',
        'ml-big',
        'ml-[4px]',
        '-ml-4',
        '-ml-2.5',
        '-ml-big',
        '-ml-[4px]',
        'ml-[var(--my-var)]',
        '-ml-[var(--my-var)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .-ml-2\\.5 {
      margin-left: calc(var(--spacing) * -2.5);
    }

    .-ml-4 {
      margin-left: calc(var(--spacing) * -4);
    }

    .-ml-\\[4px\\] {
      margin-left: -4px;
    }

    .-ml-\\[var\\(--my-var\\)\\] {
      margin-left: calc(var(--my-var) * -1);
    }

    .-ml-big {
      margin-left: calc(var(--spacing-big) * -1);
    }

    .ml-1 {
      margin-left: calc(var(--spacing) * 1);
    }

    .ml-2\\.5 {
      margin-left: calc(var(--spacing) * 2.5);
    }

    .ml-99 {
      margin-left: calc(var(--spacing) * 99);
    }

    .ml-\\[4px\\] {
      margin-left: 4px;
    }

    .ml-\\[var\\(--my-var\\)\\] {
      margin-left: var(--my-var);
    }

    .ml-big {
      margin-left: var(--spacing-big);
    }"
  `)
  expect(
    await run([
      'ml',
      'ml-auto/foo',
      'ml-4/foo',
      'ml-[4px]/foo',
      '-ml-4/foo',
      '-ml-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('margin sort order', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['mb-4', 'me-4', 'mx-4', 'ml-4', 'ms-4', 'm-4', 'mr-4', 'mt-4', 'my-4'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .m-4 {
      margin: var(--spacing-4);
    }

    .mx-4 {
      margin-inline: var(--spacing-4);
    }

    .my-4 {
      margin-block: var(--spacing-4);
    }

    .ms-4 {
      margin-inline-start: var(--spacing-4);
    }

    .me-4 {
      margin-inline-end: var(--spacing-4);
    }

    .mt-4 {
      margin-top: var(--spacing-4);
    }

    .mr-4 {
      margin-right: var(--spacing-4);
    }

    .mb-4 {
      margin-bottom: var(--spacing-4);
    }

    .ml-4 {
      margin-left: var(--spacing-4);
    }"
  `)
  expect(
    await run([
      'm',
      'mb-4/foo',
      'me-4/foo',
      'mx-4/foo',
      'ml-4/foo',
      'ms-4/foo',
      'm-4/foo',
      'mr-4/foo',
      'mt-4/foo',
      'my-4/foo',
    ]),
  ).toEqual('')
})

test('box-sizing', async () => {
  expect(await run(['box-border', 'box-content'])).toMatchInlineSnapshot(`
    ".box-border {
      box-sizing: border-box;
    }

    .box-content {
      box-sizing: content-box;
    }"
  `)
  expect(
    await run(['box', '-box-border', '-box-content', 'box-border/foo', 'box-content/foo']),
  ).toEqual('')
})

test('line-clamp', async () => {
  expect(await run(['line-clamp-4', 'line-clamp-99', 'line-clamp-[123]', 'line-clamp-none']))
    .toMatchInlineSnapshot(`
      ".line-clamp-4 {
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        overflow: hidden;
      }

      .line-clamp-99 {
        -webkit-line-clamp: 99;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        overflow: hidden;
      }

      .line-clamp-\\[123\\] {
        -webkit-line-clamp: 123;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        overflow: hidden;
      }

      .line-clamp-none {
        -webkit-line-clamp: unset;
        -webkit-box-orient: horizontal;
        display: block;
        overflow: visible;
      }"
    `)
  expect(
    await run([
      'line-clamp',
      'line-clamp--4',
      '-line-clamp-4',
      '-line-clamp-[123]',
      '-line-clamp-none',
      'line-clamp-unknown',
      'line-clamp-123.5',
      'line-clamp-4/foo',
      'line-clamp-99/foo',
      'line-clamp-[123]/foo',
      'line-clamp-none/foo',
    ]),
  ).toEqual('')
})

test('display', async () => {
  expect(
    await run([
      'block',
      'inline-block',
      'inline',
      'flex',
      'inline-flex',
      'table',
      'inline-table',
      'table-caption',
      'table-cell',
      'table-column',
      'table-column-group',
      'table-footer-group',
      'table-header-group',
      'table-row-group',
      'table-row',
      'flow-root',
      'grid',
      'inline-grid',
      'contents',
      'list-item',
      'hidden',
    ]),
  ).toMatchInlineSnapshot(`
    ".block {
      display: block;
    }

    .contents {
      display: contents;
    }

    .flex {
      display: flex;
    }

    .flow-root {
      display: flow-root;
    }

    .grid {
      display: grid;
    }

    .hidden {
      display: none;
    }

    .inline {
      display: inline;
    }

    .inline-block {
      display: inline-block;
    }

    .inline-flex {
      display: inline-flex;
    }

    .inline-grid {
      display: inline-grid;
    }

    .inline-table {
      display: inline-table;
    }

    .list-item {
      display: list-item;
    }

    .table {
      display: table;
    }

    .table-caption {
      display: table-caption;
    }

    .table-cell {
      display: table-cell;
    }

    .table-column {
      display: table-column;
    }

    .table-column-group {
      display: table-column-group;
    }

    .table-footer-group {
      display: table-footer-group;
    }

    .table-header-group {
      display: table-header-group;
    }

    .table-row {
      display: table-row;
    }

    .table-row-group {
      display: table-row-group;
    }"
  `)
  expect(
    await run([
      '-block',
      '-inline-block',
      '-inline',
      '-flex',
      '-inline-flex',
      '-table',
      '-inline-table',
      '-table-caption',
      '-table-cell',
      '-table-column',
      '-table-column-group',
      '-table-footer-group',
      '-table-header-group',
      '-table-row-group',
      '-table-row',
      '-flow-root',
      '-grid',
      '-inline-grid',
      '-contents',
      '-list-item',
      '-hidden',
      'block/foo',
      'inline-block/foo',
      'inline/foo',
      'flex/foo',
      'inline-flex/foo',
      'table/foo',
      'inline-table/foo',
      'table-caption/foo',
      'table-cell/foo',
      'table-column/foo',
      'table-column-group/foo',
      'table-footer-group/foo',
      'table-header-group/foo',
      'table-row-group/foo',
      'table-row/foo',
      'flow-root/foo',
      'grid/foo',
      'inline-grid/foo',
      'contents/foo',
      'list-item/foo',
      'hidden/foo',
    ]),
  ).toEqual('')
})

test('field-sizing', async () => {
  expect(await run(['field-sizing-content', 'field-sizing-fixed'])).toMatchInlineSnapshot(`
    ".field-sizing-content {
      field-sizing: content;
    }

    .field-sizing-fixed {
      field-sizing: fixed;
    }"
  `)
  expect(
    await run(['field-sizing-[other]', '-field-sizing-content', '-field-sizing-fixed']),
  ).toEqual('')
})

test('aspect-ratio', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --aspect-video: 16 / 9;
        }
        @tailwind utilities;
      `,
      ['aspect-video', 'aspect-[10/9]', 'aspect-4/3'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --aspect-video: 16 / 9;
    }

    .aspect-4\\/3 {
      aspect-ratio: 4 / 3;
    }

    .aspect-\\[10\\/9\\] {
      aspect-ratio: 10 / 9;
    }

    .aspect-video {
      aspect-ratio: var(--aspect-video);
    }"
  `)
  expect(
    await run([
      'aspect',
      'aspect-potato',
      '-aspect-video',
      '-aspect-[10/9]',
      'aspect-foo/bar',
      'aspect-video/foo',
      'aspect-[10/9]/foo',
      'aspect-4/3/foo',
      'aspect--4/3',
      'aspect--4/-3',
      'aspect-4/-3',
    ]),
  ).toEqual('')
})

test('size', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      [
        'size-auto',
        'size-full',
        'size-min',
        'size-max',
        'size-fit',
        'size-4',
        'size-1/2',
        'size-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .size-1\\/2 {
      width: 50%;
      height: 50%;
    }

    .size-4 {
      width: var(--spacing-4);
      height: var(--spacing-4);
    }

    .size-\\[4px\\] {
      width: 4px;
      height: 4px;
    }

    .size-auto {
      width: auto;
      height: auto;
    }

    .size-fit {
      width: fit-content;
      height: fit-content;
    }

    .size-full {
      width: 100%;
      height: 100%;
    }

    .size-max {
      width: max-content;
      height: max-content;
    }

    .size-min {
      width: min-content;
      height: min-content;
    }"
  `)
  expect(
    await run([
      'size',
      'size--1',
      'size--1/2',
      'size--1/-2',
      'size-1/-2',
      '-size-4',
      '-size-1/2',
      '-size-[4px]',
      'size-auto/foo',
      'size-full/foo',
      'size-min/foo',
      'size-max/foo',
      'size-fit/foo',
      'size-4/foo',
      'size-1/2/foo',
      'size-[4px]/foo',
    ]),
  ).toEqual('')
})

test('width', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --width-xl: 36rem;
        }
        @tailwind utilities;
      `,
      [
        'w-full',
        'w-auto',
        'w-screen',
        'w-svw',
        'w-lvw',
        'w-dvw',
        'w-min',
        'w-max',
        'w-fit',
        'w-4',
        'w-xl',
        'w-1/2',
        'w-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
      --width-xl: 36rem;
    }

    .w-1\\/2 {
      width: 50%;
    }

    .w-4 {
      width: var(--spacing-4);
    }

    .w-\\[4px\\] {
      width: 4px;
    }

    .w-auto {
      width: auto;
    }

    .w-dvw {
      width: 100dvw;
    }

    .w-fit {
      width: fit-content;
    }

    .w-full {
      width: 100%;
    }

    .w-lvw {
      width: 100lvw;
    }

    .w-max {
      width: max-content;
    }

    .w-min {
      width: min-content;
    }

    .w-screen {
      width: 100vw;
    }

    .w-svw {
      width: 100svw;
    }

    .w-xl {
      width: var(--width-xl);
    }"
  `)
  expect(
    await run([
      'w',
      'w--1',
      'w--1/2',
      'w--1/-2',
      'w-1/-2',
      '-w-4',
      '-w-1/2',
      '-w-[4px]',
      'w-full/foo',
      'w-auto/foo',
      'w-screen/foo',
      'w-svw/foo',
      'w-lvw/foo',
      'w-dvw/foo',
      'w-min/foo',
      'w-max/foo',
      'w-fit/foo',
      'w-4/foo',
      'w-xl/foo',
      'w-1/2/foo',
      'w-[4px]/foo',
    ]),
  ).toEqual('')
})

test('min-width', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --container-xl: 36rem;
        }
        @tailwind utilities;
      `,
      [
        'min-w-full',
        'min-w-auto',
        'min-w-min',
        'min-w-max',
        'min-w-fit',
        'min-w-4',
        'min-w-xl',
        'min-w-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
      --container-xl: 36rem;
    }

    .min-w-4 {
      min-width: var(--spacing-4);
    }

    .min-w-\\[4px\\] {
      min-width: 4px;
    }

    .min-w-auto {
      min-width: auto;
    }

    .min-w-fit {
      min-width: fit-content;
    }

    .min-w-full {
      min-width: 100%;
    }

    .min-w-max {
      min-width: max-content;
    }

    .min-w-min {
      min-width: min-content;
    }

    .min-w-xl {
      min-width: var(--container-xl);
    }"
  `)
  expect(
    await run([
      'min-w',
      '-min-w-4',
      '-min-w-[4px]',
      'min-w-auto/foo',
      'min-w-full/foo',
      'min-w-min/foo',
      'min-w-max/foo',
      'min-w-fit/foo',
      'min-w-4/foo',
      'min-w-xl/foo',
      'min-w-[4px]/foo',
    ]),
  ).toEqual('')
})

test('max-width', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --container-xl: 36rem;
        }
        @tailwind utilities;
      `,
      ['max-w-none', 'max-w-full', 'max-w-max', 'max-w-fit', 'max-w-4', 'max-w-xl', 'max-w-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
      --container-xl: 36rem;
    }

    .max-w-4 {
      max-width: var(--spacing-4);
    }

    .max-w-\\[4px\\] {
      max-width: 4px;
    }

    .max-w-fit {
      max-width: fit-content;
    }

    .max-w-full {
      max-width: 100%;
    }

    .max-w-max {
      max-width: max-content;
    }

    .max-w-none {
      max-width: none;
    }

    .max-w-xl {
      max-width: var(--container-xl);
    }"
  `)
  expect(
    await run([
      'max-w',
      'max-w-auto',
      '-max-w-4',
      '-max-w-[4px]',
      'max-w-none/foo',
      'max-w-full/foo',
      'max-w-max/foo',
      'max-w-max/foo',
      'max-w-fit/foo',
      'max-w-4/foo',
      'max-w-xl/foo',
      'max-w-[4px]/foo',
    ]),
  ).toEqual('')
})

test('height', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      [
        'h-full',
        'h-auto',
        'h-screen',
        'h-svh',
        'h-lvh',
        'h-dvh',
        'h-min',
        'h-max',
        'h-fit',
        'h-4',
        'h-1/2',
        'h-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .h-1\\/2 {
      height: 50%;
    }

    .h-4 {
      height: var(--spacing-4);
    }

    .h-\\[4px\\] {
      height: 4px;
    }

    .h-auto {
      height: auto;
    }

    .h-dvh {
      height: 100dvh;
    }

    .h-fit {
      height: fit-content;
    }

    .h-full {
      height: 100%;
    }

    .h-lvh {
      height: 100lvh;
    }

    .h-max {
      height: max-content;
    }

    .h-min {
      height: min-content;
    }

    .h-screen {
      height: 100vh;
    }

    .h-svh {
      height: 100svh;
    }"
  `)
  expect(
    await run([
      'h',
      '-h-4',
      'h--1',
      'h--1/2',
      'h--1/-2',
      'h-1/-2',
      '-h-1/2',
      '-h-[4px]',
      'h-full/foo',
      'h-auto/foo',
      'h-screen/foo',
      'h-svh/foo',
      'h-lvh/foo',
      'h-dvh/foo',
      'h-min/foo',
      'h-max/foo',
      'h-fit/foo',
      'h-4/foo',
      'h-1/2/foo',
      'h-[4px]/foo',
    ]),
  ).toEqual('')
})

test('min-height', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      [
        'min-h-full',
        'min-h-auto',
        'min-h-screen',
        'min-h-svh',
        'min-h-lvh',
        'min-h-dvh',
        'min-h-min',
        'min-h-max',
        'min-h-fit',
        'min-h-4',
        'min-h-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .min-h-4 {
      min-height: var(--spacing-4);
    }

    .min-h-\\[4px\\] {
      min-height: 4px;
    }

    .min-h-auto {
      min-height: auto;
    }

    .min-h-dvh {
      min-height: 100dvh;
    }

    .min-h-fit {
      min-height: fit-content;
    }

    .min-h-full {
      min-height: 100%;
    }

    .min-h-lvh {
      min-height: 100lvh;
    }

    .min-h-max {
      min-height: max-content;
    }

    .min-h-min {
      min-height: min-content;
    }

    .min-h-screen {
      min-height: 100vh;
    }

    .min-h-svh {
      min-height: 100svh;
    }"
  `)
  expect(
    await run([
      'min-h',
      '-min-h-4',
      '-min-h-[4px]',
      'min-h-auto/foo',
      'min-h-full/foo',
      'min-h-screen/foo',
      'min-h-svh/foo',
      'min-h-lvh/foo',
      'min-h-dvh/foo',
      'min-h-min/foo',
      'min-h-max/foo',
      'min-h-fit/foo',
      'min-h-4/foo',
      'min-h-[4px]/foo',
    ]),
  ).toEqual('')
})

test('max-height', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      [
        'max-h-none',
        'max-h-full',
        'max-h-screen',
        'max-h-svh',
        'max-h-lvh',
        'max-h-dvh',
        'max-h-min',
        'max-h-max',
        'max-h-fit',
        'max-h-4',
        'max-h-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .max-h-4 {
      max-height: var(--spacing-4);
    }

    .max-h-\\[4px\\] {
      max-height: 4px;
    }

    .max-h-dvh {
      max-height: 100dvh;
    }

    .max-h-fit {
      max-height: fit-content;
    }

    .max-h-full {
      max-height: 100%;
    }

    .max-h-lvh {
      max-height: 100lvh;
    }

    .max-h-max {
      max-height: max-content;
    }

    .max-h-min {
      max-height: min-content;
    }

    .max-h-none {
      max-height: none;
    }

    .max-h-screen {
      max-height: 100vh;
    }

    .max-h-svh {
      max-height: 100svh;
    }"
  `)
  expect(
    await run([
      'max-h',
      'max-h-auto',
      '-max-h-4',
      '-max-h-[4px]',
      'max-h-none/foo',
      'max-h-full/foo',
      'max-h-screen/foo',
      'max-h-svh/foo',
      'max-h-lvh/foo',
      'max-h-dvh/foo',
      'max-h-min/foo',
      'max-h-max/foo',
      'max-h-fit/foo',
      'max-h-4/foo',
      'max-h-[4px]/foo',
    ]),
  ).toEqual('')
})

describe('container', () => {
  test('creates the right media queries and sorts it before width', async () => {
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
        ['w-1/2', 'container', 'max-w-[var(--breakpoint-sm)]'],
      ),
    ).toMatchInlineSnapshot(`
      ":root, :host {
        --breakpoint-sm: 40rem;
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

      .w-1\\/2 {
        width: 50%;
      }

      .max-w-\\[var\\(--breakpoint-sm\\)\\] {
        max-width: var(--breakpoint-sm);
      }"
    `)
  })

  test('sorts breakpoints based on unit and then in ascending aOrder', async () => {
    expect(
      await compileCss(
        css`
          @theme reference {
            --breakpoint-lg: 64rem;
            --breakpoint-xl: 80rem;
            --breakpoint-3xl: 1600px;
            --breakpoint-sm: 40em;
            --breakpoint-2xl: 96rem;
            --breakpoint-xs: 30px;
            --breakpoint-md: 48em;
          }
          @tailwind utilities;
        `,
        ['container'],
      ),
    ).toMatchInlineSnapshot(`
      ".container {
        width: 100%;
      }

      @media (min-width: 40em) {
        .container {
          max-width: 40em;
        }
      }

      @media (min-width: 48em) {
        .container {
          max-width: 48em;
        }
      }

      @media (min-width: 30px) {
        .container {
          max-width: 30px;
        }
      }

      @media (min-width: 1600px) {
        .container {
          max-width: 1600px;
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
      }"
    `)
  })

  test('custom `@utility container` always follow the core utility ', async () => {
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

          @utility container {
            margin-inline: auto;
            padding-inline: 1rem;

            @media (width >= theme(--breakpoint-sm)) {
              padding-inline: 2rem;
            }
          }
        `,
        ['w-1/2', 'container', 'max-w-[var(--breakpoint-sm)]'],
      ),
    ).toMatchInlineSnapshot(`
      ":root, :host {
        --breakpoint-sm: 40rem;
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

      .container {
        margin-inline: auto;
        padding-inline: 1rem;
      }

      @media (min-width: 40rem) {
        .container {
          padding-inline: 2rem;
        }
      }

      .w-1\\/2 {
        width: 50%;
      }

      .max-w-\\[var\\(--breakpoint-sm\\)\\] {
        max-width: var(--breakpoint-sm);
      }"
    `)
  })
})

test('flex', async () => {
  expect(
    await run([
      'flex-1',
      'flex-99',
      'flex-1/2',
      'flex-auto',
      'flex-initial',
      'flex-none',
      'flex-[123]',
    ]),
  ).toMatchInlineSnapshot(`
    ".flex-1 {
      flex: 1;
    }

    .flex-1\\/2 {
      flex: 50%;
    }

    .flex-99 {
      flex: 99;
    }

    .flex-\\[123\\] {
      flex: 123;
    }

    .flex-auto {
      flex: auto;
    }

    .flex-initial {
      flex: 0 auto;
    }

    .flex-none {
      flex: none;
    }"
  `)
  expect(
    await run([
      '-flex-1',
      'flex--1',
      '-flex-auto',
      '-flex-initial',
      '-flex-none',
      '-flex-[123]',
      'flex-unknown',
      'flex-1/foo',
      'flex-99/foo',
      'flex--1/2',
      'flex--1/-2',
      'flex-1/-2',
      'flex-1/2/foo',
      'flex-auto/foo',
      'flex-initial/foo',
      'flex-none/foo',
      'flex-[123]/foo',
    ]),
  ).toEqual('')
})

test('flex-shrink', async () => {
  expect(await run(['shrink', 'shrink-0', 'shrink-[123]'])).toMatchInlineSnapshot(`
    ".shrink {
      flex-shrink: 1;
    }

    .shrink-0 {
      flex-shrink: 0;
    }

    .shrink-\\[123\\] {
      flex-shrink: 123;
    }"
  `)
  expect(
    await run([
      '-shrink',
      'shrink--1',
      'shrink-1.5',
      '-shrink-0',
      '-shrink-[123]',
      'shrink-unknown',
      'shrink/foo',
      'shrink-0/foo',
      'shrink-[123]/foo',
    ]),
  ).toEqual('')
})

test('flex-grow', async () => {
  expect(await run(['grow', 'grow-0', 'grow-[123]'])).toMatchInlineSnapshot(`
    ".grow {
      flex-grow: 1;
    }

    .grow-0 {
      flex-grow: 0;
    }

    .grow-\\[123\\] {
      flex-grow: 123;
    }"
  `)
  expect(
    await run([
      '-grow',
      'grow--1',
      'grow-1.5',
      '-grow-0',
      '-grow-[123]',
      'grow-unknown',
      'grow/foo',
      'grow-0/foo',
      'grow-[123]/foo',
    ]),
  ).toEqual('')
})

test('flex-basis', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --container-xl: 36rem;
        }
        @tailwind utilities;
      `,
      ['basis-auto', 'basis-full', 'basis-xl', 'basis-11/12', 'basis-[123px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --container-xl: 36rem;
    }

    .basis-11\\/12 {
      flex-basis: 91.6667%;
    }

    .basis-\\[123px\\] {
      flex-basis: 123px;
    }

    .basis-auto {
      flex-basis: auto;
    }

    .basis-full {
      flex-basis: 100%;
    }

    .basis-xl {
      flex-basis: var(--container-xl);
    }"
  `)
  expect(
    await run([
      'basis',
      'basis--1',
      'basis--1/2',
      'basis--1/-2',
      'basis-1/-2',
      '-basis-full',
      '-basis-[123px]',
      'basis-auto/foo',
      'basis-full/foo',
      'basis-xl/foo',
      'basis-11/12/foo',
      'basis-[123px]/foo',
    ]),
  ).toEqual('')
})

test('table-layout', async () => {
  expect(await run(['table-auto', 'table-fixed'])).toMatchInlineSnapshot(`
    ".table-auto {
      table-layout: auto;
    }

    .table-fixed {
      table-layout: fixed;
    }"
  `)
  expect(await run(['-table-auto', '-table-fixed', 'table-auto/foo', 'table-fixed/foo'])).toEqual(
    '',
  )
})

test('caption-side', async () => {
  expect(await run(['caption-top', 'caption-bottom'])).toMatchInlineSnapshot(`
    ".caption-bottom {
      caption-side: bottom;
    }

    .caption-top {
      caption-side: top;
    }"
  `)
  expect(
    await run(['-caption-top', '-caption-bottom', 'caption-top/foo', 'caption-bottom/foo']),
  ).toEqual('')
})

test('border-collapse', async () => {
  expect(await run(['border-collapse', 'border-separate'])).toMatchInlineSnapshot(`
    ".border-collapse {
      border-collapse: collapse;
    }

    .border-separate {
      border-collapse: separate;
    }"
  `)
  expect(
    await run([
      '-border-collapse',
      '-border-separate',
      'border-collapse/foo',
      'border-separate/foo',
    ]),
  ).toEqual('')
})

test('border-spacing', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-1: 0.25rem;
        }
        @tailwind utilities;
      `,
      ['border-spacing-1', 'border-spacing-[123px]'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-border-spacing-x: 0;
          --tw-border-spacing-y: 0;
        }
      }
    }

    :root, :host {
      --spacing-1: .25rem;
    }

    .border-spacing-1 {
      --tw-border-spacing-x: var(--spacing-1);
      --tw-border-spacing-y: var(--spacing-1);
      border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
    }

    .border-spacing-\\[123px\\] {
      --tw-border-spacing-x: 123px;
      --tw-border-spacing-y: 123px;
      border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
    }

    @property --tw-border-spacing-x {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-border-spacing-y {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(
    await run([
      'border-spacing',
      '-border-spacing-1',
      '-border-spacing-[123px]',
      'border-spacing-1/foo',
      'border-spacing-[123px]/foo',
    ]),
  ).toEqual('')
})

test('border-spacing-x', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-1: 0.25rem;
        }
        @tailwind utilities;
      `,
      ['border-spacing-x-1', 'border-spacing-x-[123px]'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-border-spacing-x: 0;
          --tw-border-spacing-y: 0;
        }
      }
    }

    :root, :host {
      --spacing-1: .25rem;
    }

    .border-spacing-x-1 {
      --tw-border-spacing-x: var(--spacing-1);
      border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
    }

    .border-spacing-x-\\[123px\\] {
      --tw-border-spacing-x: 123px;
      border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
    }

    @property --tw-border-spacing-x {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-border-spacing-y {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(
    await run([
      'border-spacing-x',
      '-border-spacing-x-1',
      '-border-spacing-x-[123px]',
      'border-spacing-x-1/foo',
      'border-spacing-x-[123px]/foo',
    ]),
  ).toEqual('')
})

test('border-spacing-y', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-1: 0.25rem;
        }
        @tailwind utilities;
      `,
      ['border-spacing-y-1', 'border-spacing-y-[123px]'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-border-spacing-x: 0;
          --tw-border-spacing-y: 0;
        }
      }
    }

    :root, :host {
      --spacing-1: .25rem;
    }

    .border-spacing-y-1 {
      --tw-border-spacing-y: var(--spacing-1);
      border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
    }

    .border-spacing-y-\\[123px\\] {
      --tw-border-spacing-y: 123px;
      border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
    }

    @property --tw-border-spacing-x {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-border-spacing-y {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(
    await run([
      'border-spacing-x',
      '-border-spacing-y-1',
      '-border-spacing-y-[123px]',
      'border-spacing-y-1/foo',
      'border-spacing-y-[123px]/foo',
    ]),
  ).toEqual('')
})

test('origin', async () => {
  expect(
    await run([
      'origin-center',
      'origin-top',
      'origin-top-right',
      'origin-right',
      'origin-bottom-right',
      'origin-bottom',
      'origin-bottom-left',
      'origin-left',
      'origin-top-left',
      'origin-[50px_100px]',
      'origin-[var(--value)]',
    ]),
  ).toMatchInlineSnapshot(`
    ".origin-\\[50px_100px\\] {
      transform-origin: 50px 100px;
    }

    .origin-\\[var\\(--value\\)\\] {
      transform-origin: var(--value);
    }

    .origin-bottom {
      transform-origin: bottom;
    }

    .origin-bottom-left {
      transform-origin: 0 100%;
    }

    .origin-bottom-right {
      transform-origin: 100% 100%;
    }

    .origin-center {
      transform-origin: center;
    }

    .origin-left {
      transform-origin: 0;
    }

    .origin-right {
      transform-origin: 100%;
    }

    .origin-top {
      transform-origin: top;
    }

    .origin-top-left {
      transform-origin: 0 0;
    }

    .origin-top-right {
      transform-origin: 100% 0;
    }"
  `)
  expect(
    await run([
      '-origin-center',
      '-origin-[var(--value)]',
      'origin-center/foo',
      'origin-top/foo',
      'origin-top-right/foo',
      'origin-right/foo',
      'origin-bottom-right/foo',
      'origin-bottom/foo',
      'origin-bottom-left/foo',
      'origin-left/foo',
      'origin-top-left/foo',
      'origin-[50px_100px]/foo',
      'origin-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('perspective-origin', async () => {
  expect(
    await run([
      'perspective-origin-center',
      'perspective-origin-top',
      'perspective-origin-top-right',
      'perspective-origin-right',
      'perspective-origin-bottom-right',
      'perspective-origin-bottom',
      'perspective-origin-bottom-left',
      'perspective-origin-left',
      'perspective-origin-top-left',
      'perspective-origin-[50px_100px]',
      'perspective-origin-[var(--value)]',
    ]),
  ).toMatchInlineSnapshot(`
    ".perspective-origin-\\[50px_100px\\] {
      perspective-origin: 50px 100px;
    }

    .perspective-origin-\\[var\\(--value\\)\\] {
      perspective-origin: var(--value);
    }

    .perspective-origin-bottom {
      perspective-origin: bottom;
    }

    .perspective-origin-bottom-left {
      perspective-origin: 0 100%;
    }

    .perspective-origin-bottom-right {
      perspective-origin: 100% 100%;
    }

    .perspective-origin-center {
      perspective-origin: center;
    }

    .perspective-origin-left {
      perspective-origin: 0;
    }

    .perspective-origin-right {
      perspective-origin: 100%;
    }

    .perspective-origin-top {
      perspective-origin: top;
    }

    .perspective-origin-top-left {
      perspective-origin: 0 0;
    }

    .perspective-origin-top-right {
      perspective-origin: 100% 0;
    }"
  `)
  expect(
    await run([
      '-perspective-origin-center',
      '-perspective-origin-[var(--value)]',
      'perspective-origin-center/foo',
      'perspective-origin-top/foo',
      'perspective-origin-top-right/foo',
      'perspective-origin-right/foo',
      'perspective-origin-bottom-right/foo',
      'perspective-origin-bottom/foo',
      'perspective-origin-bottom-left/foo',
      'perspective-origin-left/foo',
      'perspective-origin-top-left/foo',
      'perspective-origin-[50px_100px]/foo',
      'perspective-origin-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('translate', async () => {
  expect(
    await run([
      'translate-1/2',
      'translate-full',
      '-translate-full',
      'translate-[123px]',
      '-translate-[var(--value)]',
    ]),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-translate-z: 0;
        }
      }
    }

    .-translate-\\[var\\(--value\\)\\] {
      --tw-translate-x: calc(var(--value) * -1);
      --tw-translate-y: calc(var(--value) * -1);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .-translate-full {
      --tw-translate-x: -100%;
      --tw-translate-y: -100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-1\\/2 {
      --tw-translate-x: calc(1 / 2 * 100%);
      --tw-translate-y: calc(1 / 2 * 100%);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-\\[123px\\] {
      --tw-translate-x: 123px;
      --tw-translate-y: 123px;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-full {
      --tw-translate-x: 100%;
      --tw-translate-y: 100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    @property --tw-translate-x {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-y {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-z {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(
    await run([
      'translate',
      'translate--1',
      'translate--1/2',
      'translate--1/-2',
      'translate-1/-2',
      'translate-1/2/foo',
      'translate-full/foo',
      '-translate-full/foo',
      'translate-[123px]/foo',
      '-translate-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('translate-x', async () => {
  expect(
    await run([
      'translate-x-full',
      '-translate-x-full',
      'translate-x-px',
      '-translate-x-[var(--value)]',
    ]),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-translate-z: 0;
        }
      }
    }

    .-translate-x-\\[var\\(--value\\)\\] {
      --tw-translate-x: calc(var(--value) * -1);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .-translate-x-full {
      --tw-translate-x: -100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-x-full {
      --tw-translate-x: 100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-x-px {
      --tw-translate-x: 1px;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    @property --tw-translate-x {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-y {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-z {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(
    await run([
      'translate-x',
      'translate-x--1',
      'translate-x--1/2',
      'translate-x--1/-2',
      'translate-x-1/-2',
      'translate-x-full/foo',
      '-translate-x-full/foo',
      'translate-x-px/foo',
      '-translate-x-[var(--value)]/foo',
    ]),
  ).toEqual('')

  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      ['translate-x-full', '-translate-x-full', 'translate-x-px', '-translate-x-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-translate-z: 0;
        }
      }
    }

    .-translate-x-\\[var\\(--value\\)\\] {
      --tw-translate-x: calc(var(--value) * -1);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .-translate-x-full {
      --tw-translate-x: -100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-x-full {
      --tw-translate-x: 100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-x-px {
      --tw-translate-x: 1px;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    @property --tw-translate-x {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-y {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-z {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(
    await run([
      'perspective',
      '-perspective',
      'perspective-potato',
      'perspective-123',
      'perspective-normal/foo',
      'perspective-dramatic/foo',
      'perspective-none/foo',
      'perspective-[456px]/foo',
    ]),
  ).toEqual('')
})

test('translate-y', async () => {
  expect(
    await run([
      'translate-y-full',
      '-translate-y-full',
      'translate-y-px',
      '-translate-y-[var(--value)]',
    ]),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-translate-z: 0;
        }
      }
    }

    .-translate-y-\\[var\\(--value\\)\\] {
      --tw-translate-y: calc(var(--value) * -1);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .-translate-y-full {
      --tw-translate-y: -100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-y-full {
      --tw-translate-y: 100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-y-px {
      --tw-translate-y: 1px;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    @property --tw-translate-x {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-y {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-z {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(
    await run([
      'translate-y',
      'translate-y--1',
      'translate-y--1/2',
      'translate-y--1/-2',
      'translate-y-1/-2',
      'translate-y-full/foo',
      '-translate-y-full/foo',
      'translate-y-px/foo',
      '-translate-y-[var(--value)]/foo',
    ]),
  ).toEqual('')

  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      ['translate-y-full', '-translate-y-full', 'translate-y-px', '-translate-y-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-translate-z: 0;
        }
      }
    }

    .-translate-y-\\[var\\(--value\\)\\] {
      --tw-translate-y: calc(var(--value) * -1);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .-translate-y-full {
      --tw-translate-y: -100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-y-full {
      --tw-translate-y: 100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-y-px {
      --tw-translate-y: 1px;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    @property --tw-translate-x {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-y {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-z {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(
    await run([
      'perspective',
      '-perspective',
      'perspective-potato',
      'perspective-123',
      'perspective-normal/foo',
      'perspective-dramatic/foo',
      'perspective-none/foo',
      'perspective-[456px]/foo',
    ]),
  ).toEqual('')
})

test('translate-z', async () => {
  expect(await run(['-translate-z-px', 'translate-z-px', '-translate-z-[var(--value)]']))
    .toMatchInlineSnapshot(`
      "@layer properties {
        @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
          *, :before, :after, ::backdrop {
            --tw-translate-x: 0;
            --tw-translate-y: 0;
            --tw-translate-z: 0;
          }
        }
      }

      .-translate-z-\\[var\\(--value\\)\\] {
        --tw-translate-z: calc(var(--value) * -1);
        translate: var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z);
      }

      .-translate-z-px {
        --tw-translate-z: -1px;
        translate: var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z);
      }

      .translate-z-px {
        --tw-translate-z: 1px;
        translate: var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z);
      }

      @property --tw-translate-x {
        syntax: "*";
        inherits: false;
        initial-value: 0;
      }

      @property --tw-translate-y {
        syntax: "*";
        inherits: false;
        initial-value: 0;
      }

      @property --tw-translate-z {
        syntax: "*";
        inherits: false;
        initial-value: 0;
      }"
    `)
  expect(
    await run([
      'translate-z',
      'translate-z--1',
      'translate-z--1/2',
      'translate-z--1/-2',
      'translate-z-1/-2',
      'translate-z-full',
      '-translate-z-full',
      'translate-z-1/2',
      'translate-y-px/foo',
      '-translate-z-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('translate-3d', async () => {
  expect(await run(['translate-3d'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-translate-z: 0;
        }
      }
    }

    .translate-3d {
      translate: var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z);
    }

    @property --tw-translate-x {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-y {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-z {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(await run(['-translate-3d', 'translate-3d/foo'])).toEqual('')
})

test('rotate', async () => {
  expect(await run(['rotate-45', '-rotate-45', 'rotate-[123deg]', 'rotate-[0.3_0.7_1_45deg]']))
    .toMatchInlineSnapshot(`
      ".-rotate-45 {
        rotate: -45deg;
      }

      .rotate-45 {
        rotate: 45deg;
      }

      .rotate-\\[0\\.3_0\\.7_1_45deg\\] {
        rotate: .3 .7 1 45deg;
      }

      .rotate-\\[123deg\\] {
        rotate: 123deg;
      }"
    `)
  expect(
    await run([
      'rotate',
      'rotate-z',
      'rotate--2',
      'rotate-unknown',
      'rotate-45/foo',
      '-rotate-45/foo',
      'rotate-[123deg]/foo',
      'rotate-[0.3_0.7_1_45deg]/foo',
    ]),
  ).toEqual('')
})

test('rotate-x', async () => {
  expect(await run(['rotate-x-45', '-rotate-x-45', 'rotate-x-[123deg]'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-rotate-x: initial;
          --tw-rotate-y: initial;
          --tw-rotate-z: initial;
          --tw-skew-x: initial;
          --tw-skew-y: initial;
        }
      }
    }

    .-rotate-x-45 {
      --tw-rotate-x: rotateX(calc(45deg * -1));
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    .rotate-x-45 {
      --tw-rotate-x: rotateX(45deg);
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    .rotate-x-\\[123deg\\] {
      --tw-rotate-x: rotateX(123deg);
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    @property --tw-rotate-x {
      syntax: "*";
      inherits: false
    }

    @property --tw-rotate-y {
      syntax: "*";
      inherits: false
    }

    @property --tw-rotate-z {
      syntax: "*";
      inherits: false
    }

    @property --tw-skew-x {
      syntax: "*";
      inherits: false
    }

    @property --tw-skew-y {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      'rotate-x',
      'rotate-x--1',
      '-rotate-x',
      'rotate-x-potato',
      'rotate-x-45/foo',
      '-rotate-x-45/foo',
      'rotate-x-[123deg]/foo',
    ]),
  ).toEqual('')
})

test('rotate-y', async () => {
  expect(await run(['rotate-y-45', '-rotate-y-45', 'rotate-y-[123deg]', '-rotate-y-[123deg]']))
    .toMatchInlineSnapshot(`
      "@layer properties {
        @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
          *, :before, :after, ::backdrop {
            --tw-rotate-x: initial;
            --tw-rotate-y: initial;
            --tw-rotate-z: initial;
            --tw-skew-x: initial;
            --tw-skew-y: initial;
          }
        }
      }

      .-rotate-y-45 {
        --tw-rotate-y: rotateY(calc(45deg * -1));
        transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
      }

      .-rotate-y-\\[123deg\\] {
        --tw-rotate-y: rotateY(calc(123deg * -1));
        transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
      }

      .rotate-y-45 {
        --tw-rotate-y: rotateY(45deg);
        transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
      }

      .rotate-y-\\[123deg\\] {
        --tw-rotate-y: rotateY(123deg);
        transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
      }

      @property --tw-rotate-x {
        syntax: "*";
        inherits: false
      }

      @property --tw-rotate-y {
        syntax: "*";
        inherits: false
      }

      @property --tw-rotate-z {
        syntax: "*";
        inherits: false
      }

      @property --tw-skew-x {
        syntax: "*";
        inherits: false
      }

      @property --tw-skew-y {
        syntax: "*";
        inherits: false
      }"
    `)
  expect(
    await run([
      'rotate-y',
      'rotate-y--1',
      '-rotate-y',
      'rotate-y-potato',
      'rotate-y-45/foo',
      '-rotate-y-45/foo',
      'rotate-y-[123deg]/foo',
    ]),
  ).toEqual('')
})

test('rotate-z', async () => {
  expect(await run(['rotate-z-45', '-rotate-z-45', 'rotate-z-[123deg]', '-rotate-z-[123deg]']))
    .toMatchInlineSnapshot(`
      "@layer properties {
        @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
          *, :before, :after, ::backdrop {
            --tw-rotate-x: initial;
            --tw-rotate-y: initial;
            --tw-rotate-z: initial;
            --tw-skew-x: initial;
            --tw-skew-y: initial;
          }
        }
      }

      .-rotate-z-45 {
        --tw-rotate-z: rotateZ(calc(45deg * -1));
        transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
      }

      .-rotate-z-\\[123deg\\] {
        --tw-rotate-z: rotateZ(calc(123deg * -1));
        transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
      }

      .rotate-z-45 {
        --tw-rotate-z: rotateZ(45deg);
        transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
      }

      .rotate-z-\\[123deg\\] {
        --tw-rotate-z: rotateZ(123deg);
        transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
      }

      @property --tw-rotate-x {
        syntax: "*";
        inherits: false
      }

      @property --tw-rotate-y {
        syntax: "*";
        inherits: false
      }

      @property --tw-rotate-z {
        syntax: "*";
        inherits: false
      }

      @property --tw-skew-x {
        syntax: "*";
        inherits: false
      }

      @property --tw-skew-y {
        syntax: "*";
        inherits: false
      }"
    `)
  expect(
    await run([
      'rotate-z',
      'rotate-z--1',
      '-rotate-z',
      'rotate-z-potato',
      'rotate-z-45/foo',
      '-rotate-z-45/foo',
      'rotate-z-[123deg]/foo',
    ]),
  ).toEqual('')
})

test('skew', async () => {
  expect(await run(['skew-6', '-skew-6', 'skew-[123deg]'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-rotate-x: initial;
          --tw-rotate-y: initial;
          --tw-rotate-z: initial;
          --tw-skew-x: initial;
          --tw-skew-y: initial;
        }
      }
    }

    .-skew-6 {
      --tw-skew-x: skewX(calc(6deg * -1));
      --tw-skew-y: skewY(calc(6deg * -1));
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    .skew-6 {
      --tw-skew-x: skewX(6deg);
      --tw-skew-y: skewY(6deg);
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    .skew-\\[123deg\\] {
      --tw-skew-x: skewX(123deg);
      --tw-skew-y: skewY(123deg);
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    @property --tw-rotate-x {
      syntax: "*";
      inherits: false
    }

    @property --tw-rotate-y {
      syntax: "*";
      inherits: false
    }

    @property --tw-rotate-z {
      syntax: "*";
      inherits: false
    }

    @property --tw-skew-x {
      syntax: "*";
      inherits: false
    }

    @property --tw-skew-y {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      'skew',
      'skew--1',
      'skew-unknown',
      'skew-6/foo',
      '-skew-6/foo',
      'skew-[123deg]/foo',
    ]),
  ).toEqual('')
})

test('skew-x', async () => {
  expect(await run(['skew-x-6', '-skew-x-6', 'skew-x-[123deg]'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-rotate-x: initial;
          --tw-rotate-y: initial;
          --tw-rotate-z: initial;
          --tw-skew-x: initial;
          --tw-skew-y: initial;
        }
      }
    }

    .-skew-x-6 {
      --tw-skew-x: skewX(calc(6deg * -1));
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    .skew-x-6 {
      --tw-skew-x: skewX(6deg);
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    .skew-x-\\[123deg\\] {
      --tw-skew-x: skewX(123deg);
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    @property --tw-rotate-x {
      syntax: "*";
      inherits: false
    }

    @property --tw-rotate-y {
      syntax: "*";
      inherits: false
    }

    @property --tw-rotate-z {
      syntax: "*";
      inherits: false
    }

    @property --tw-skew-x {
      syntax: "*";
      inherits: false
    }

    @property --tw-skew-y {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      'skew-x',
      'skew-x--1',
      'skew-x-unknown',
      'skew-x-6/foo',
      '-skew-x-6/foo',
      'skew-x-[123deg]/foo',
    ]),
  ).toEqual('')
})

test('skew-y', async () => {
  expect(await run(['skew-y-6', '-skew-y-6', 'skew-y-[123deg]'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-rotate-x: initial;
          --tw-rotate-y: initial;
          --tw-rotate-z: initial;
          --tw-skew-x: initial;
          --tw-skew-y: initial;
        }
      }
    }

    .-skew-y-6 {
      --tw-skew-y: skewY(calc(6deg * -1));
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    .skew-y-6 {
      --tw-skew-y: skewY(6deg);
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    .skew-y-\\[123deg\\] {
      --tw-skew-y: skewY(123deg);
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    @property --tw-rotate-x {
      syntax: "*";
      inherits: false
    }

    @property --tw-rotate-y {
      syntax: "*";
      inherits: false
    }

    @property --tw-rotate-z {
      syntax: "*";
      inherits: false
    }

    @property --tw-skew-x {
      syntax: "*";
      inherits: false
    }

    @property --tw-skew-y {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      'skew-y',
      'skew-y--1',
      'skew-y-unknown',
      'skew-y-6/foo',
      '-skew-y-6/foo',
      'skew-y-[123deg]/foo',
    ]),
  ).toEqual('')
})

test('scale', async () => {
  expect(await run(['scale-50', '-scale-50', 'scale-[2]', 'scale-[2_1.5_3]']))
    .toMatchInlineSnapshot(`
      "@layer properties {
        @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
          *, :before, :after, ::backdrop {
            --tw-scale-x: 1;
            --tw-scale-y: 1;
            --tw-scale-z: 1;
          }
        }
      }

      .-scale-50 {
        --tw-scale-x: calc(50% * -1);
        --tw-scale-y: calc(50% * -1);
        --tw-scale-z: calc(50% * -1);
        scale: var(--tw-scale-x) var(--tw-scale-y);
      }

      .scale-50 {
        --tw-scale-x: 50%;
        --tw-scale-y: 50%;
        --tw-scale-z: 50%;
        scale: var(--tw-scale-x) var(--tw-scale-y);
      }

      .scale-\\[2\\] {
        scale: 2;
      }

      .scale-\\[2_1\\.5_3\\] {
        scale: 2 1.5 3;
      }

      @property --tw-scale-x {
        syntax: "*";
        inherits: false;
        initial-value: 1;
      }

      @property --tw-scale-y {
        syntax: "*";
        inherits: false;
        initial-value: 1;
      }

      @property --tw-scale-z {
        syntax: "*";
        inherits: false;
        initial-value: 1;
      }"
    `)
  expect(
    await run([
      'scale',
      'scale--50',
      'scale-1.5',
      'scale-unknown',
      'scale-50/foo',
      '-scale-50/foo',
      'scale-[2]/foo',
      'scale-[2_1.5_3]/foo',
    ]),
  ).toEqual('')
})

test('scale-3d', async () => {
  expect(await run(['scale-3d'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-scale-z: 1;
        }
      }
    }

    .scale-3d {
      scale: var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z);
    }

    @property --tw-scale-x {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-y {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-z {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }"
  `)
  expect(await run(['-scale-3d', 'scale-3d/foo'])).toEqual('')
})

test('scale-x', async () => {
  expect(await run(['scale-x-50', '-scale-x-50', 'scale-x-[2]'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-scale-z: 1;
        }
      }
    }

    .-scale-x-50 {
      --tw-scale-x: calc(50% * -1);
      scale: var(--tw-scale-x) var(--tw-scale-y);
    }

    .scale-x-50 {
      --tw-scale-x: 50%;
      scale: var(--tw-scale-x) var(--tw-scale-y);
    }

    .scale-x-\\[2\\] {
      --tw-scale-x: 2;
      scale: var(--tw-scale-x) var(--tw-scale-y);
    }

    @property --tw-scale-x {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-y {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-z {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }"
  `)
  expect(await run(['scale-200', 'scale-x-400'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-scale-z: 1;
        }
      }
    }

    .scale-200 {
      --tw-scale-x: 200%;
      --tw-scale-y: 200%;
      --tw-scale-z: 200%;
      scale: var(--tw-scale-x) var(--tw-scale-y);
    }

    .scale-x-400 {
      --tw-scale-x: 400%;
      scale: var(--tw-scale-x) var(--tw-scale-y);
    }

    @property --tw-scale-x {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-y {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-z {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }"
  `)
  expect(
    await run([
      'scale-x',
      'scale-x--1',
      'scale-x-1.5',
      'scale-x-unknown',
      'scale-200/foo',
      'scale-x-400/foo',
      'scale-x-50/foo',
      '-scale-x-50/foo',
      'scale-x-[2]/foo',
    ]),
  ).toEqual('')
})

test('scale-y', async () => {
  expect(await run(['scale-y-50', '-scale-y-50', 'scale-y-[2]'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-scale-z: 1;
        }
      }
    }

    .-scale-y-50 {
      --tw-scale-y: calc(50% * -1);
      scale: var(--tw-scale-x) var(--tw-scale-y);
    }

    .scale-y-50 {
      --tw-scale-y: 50%;
      scale: var(--tw-scale-x) var(--tw-scale-y);
    }

    .scale-y-\\[2\\] {
      --tw-scale-y: 2;
      scale: var(--tw-scale-x) var(--tw-scale-y);
    }

    @property --tw-scale-x {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-y {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-z {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }"
  `)
  expect(
    await run([
      'scale-y',
      'scale-y--1',
      'scale-y-1.5',
      'scale-y-unknown',
      'scale-y-50/foo',
      '-scale-y-50/foo',
      'scale-y-[2]/foo',
    ]),
  ).toEqual('')
})

test('scale-z', async () => {
  expect(await run(['scale-z-50', '-scale-z-50', 'scale-z-[123deg]'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-scale-z: 1;
        }
      }
    }

    .-scale-z-50 {
      --tw-scale-z: calc(50% * -1);
      scale: var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z);
    }

    .scale-z-50 {
      --tw-scale-z: 50%;
      scale: var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z);
    }

    .scale-z-\\[123deg\\] {
      --tw-scale-z: 123deg;
      scale: var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z);
    }

    @property --tw-scale-x {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-y {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-z {
      syntax: "*";
      inherits: false;
      initial-value: 1;
    }"
  `)
  expect(
    await run([
      'scale-z',
      'scale-z--1',
      'scale-z-1.5',
      'scale-z-50/foo',
      '-scale-z-50/foo',
      'scale-z-[123deg]/foo',
    ]),
  ).toEqual('')
})

test('transform', async () => {
  expect(
    await run([
      'transform',
      'transform-cpu',
      'transform-gpu',
      'transform-none',
      'transform-[scaleZ(2)_rotateY(45deg)]',
    ]),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-rotate-x: initial;
          --tw-rotate-y: initial;
          --tw-rotate-z: initial;
          --tw-skew-x: initial;
          --tw-skew-y: initial;
        }
      }
    }

    .transform {
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    .transform-\\[scaleZ\\(2\\)_rotateY\\(45deg\\)\\] {
      transform: scaleZ(2)rotateY(45deg);
    }

    .transform-cpu {
      transform: var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    .transform-gpu {
      transform: translateZ(0) var(--tw-rotate-x, ) var(--tw-rotate-y, ) var(--tw-rotate-z, ) var(--tw-skew-x, ) var(--tw-skew-y, );
    }

    .transform-none {
      transform: none;
    }

    @property --tw-rotate-x {
      syntax: "*";
      inherits: false
    }

    @property --tw-rotate-y {
      syntax: "*";
      inherits: false
    }

    @property --tw-rotate-z {
      syntax: "*";
      inherits: false
    }

    @property --tw-skew-x {
      syntax: "*";
      inherits: false
    }

    @property --tw-skew-y {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      'transform-flat',
      'transform-3d',
      'transform-content',
      'transform-border',
      'transform-fill',
      'transform-stroke',
      'transform-view',
      'backface-visible',
      'backface-hidden',
    ]),
  ).toMatchInlineSnapshot(`
    ".backface-hidden {
      backface-visibility: hidden;
    }

    .backface-visible {
      backface-visibility: visible;
    }

    .transform-3d {
      transform-style: preserve-3d;
    }

    .transform-border {
      transform-box: border-box;
    }

    .transform-content {
      transform-box: content-box;
    }

    .transform-fill {
      transform-box: fill-box;
    }

    .transform-flat {
      transform-style: flat;
    }

    .transform-stroke {
      transform-box: stroke-box;
    }

    .transform-view {
      transform-box: view-box;
    }"
  `)
  expect(
    await run([
      '-transform',
      '-transform-cpu',
      '-transform-gpu',
      '-transform-none',
      'transform/foo',
      'transform-cpu/foo',
      'transform-gpu/foo',
      'transform-none/foo',
      'transform-[scaleZ(2)_rotateY(45deg)]/foo',
      'transform-flat/foo',
      'transform-3d/foo',
      'transform-content/foo',
      'transform-border/foo',
      'transform-fill/foo',
      'transform-stroke/foo',
      'transform-view/foo',
      'backface-visible/foo',
      'backface-hidden/foo',
    ]),
  ).toEqual('')
})

test('perspective', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --perspective-dramatic: 100px;
          --perspective-normal: 500px;
        }
        @tailwind utilities;
      `,
      ['perspective-normal', 'perspective-dramatic', 'perspective-none', 'perspective-[456px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --perspective-dramatic: 100px;
      --perspective-normal: 500px;
    }

    .perspective-\\[456px\\] {
      perspective: 456px;
    }

    .perspective-dramatic {
      perspective: var(--perspective-dramatic);
    }

    .perspective-none {
      perspective: none;
    }

    .perspective-normal {
      perspective: var(--perspective-normal);
    }"
  `)
  expect(
    await run([
      'perspective',
      '-perspective',
      'perspective-potato',
      'perspective-123',
      'perspective-normal/foo',
      'perspective-dramatic/foo',
      'perspective-none/foo',
      'perspective-[456px]/foo',
    ]),
  ).toEqual('')
})

test('cursor', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --cursor-custom: url(/my-cursor.png);
        }
        @tailwind utilities;
      `,
      [
        'cursor-auto',
        'cursor-default',
        'cursor-pointer',
        'cursor-wait',
        'cursor-text',
        'cursor-move',
        'cursor-help',
        'cursor-not-allowed',
        'cursor-none',
        'cursor-context-menu',
        'cursor-progress',
        'cursor-cell',
        'cursor-crosshair',
        'cursor-vertical-text',
        'cursor-alias',
        'cursor-copy',
        'cursor-no-drop',
        'cursor-grab',
        'cursor-grabbing',
        'cursor-all-scroll',
        'cursor-col-resize',
        'cursor-row-resize',
        'cursor-n-resize',
        'cursor-e-resize',
        'cursor-s-resize',
        'cursor-w-resize',
        'cursor-ne-resize',
        'cursor-nw-resize',
        'cursor-se-resize',
        'cursor-sw-resize',
        'cursor-ew-resize',
        'cursor-ns-resize',
        'cursor-nesw-resize',
        'cursor-nwse-resize',
        'cursor-zoom-in',
        'cursor-zoom-out',
        'cursor-[var(--value)]',
        'cursor-custom',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --cursor-custom: url("/my-cursor.png");
    }

    .cursor-\\[var\\(--value\\)\\] {
      cursor: var(--value);
    }

    .cursor-alias {
      cursor: alias;
    }

    .cursor-all-scroll {
      cursor: all-scroll;
    }

    .cursor-auto {
      cursor: auto;
    }

    .cursor-cell {
      cursor: cell;
    }

    .cursor-col-resize {
      cursor: col-resize;
    }

    .cursor-context-menu {
      cursor: context-menu;
    }

    .cursor-copy {
      cursor: copy;
    }

    .cursor-crosshair {
      cursor: crosshair;
    }

    .cursor-custom {
      cursor: var(--cursor-custom);
    }

    .cursor-default {
      cursor: default;
    }

    .cursor-e-resize {
      cursor: e-resize;
    }

    .cursor-ew-resize {
      cursor: ew-resize;
    }

    .cursor-grab {
      cursor: grab;
    }

    .cursor-grabbing {
      cursor: grabbing;
    }

    .cursor-help {
      cursor: help;
    }

    .cursor-move {
      cursor: move;
    }

    .cursor-n-resize {
      cursor: n-resize;
    }

    .cursor-ne-resize {
      cursor: ne-resize;
    }

    .cursor-nesw-resize {
      cursor: nesw-resize;
    }

    .cursor-no-drop {
      cursor: no-drop;
    }

    .cursor-none {
      cursor: none;
    }

    .cursor-not-allowed {
      cursor: not-allowed;
    }

    .cursor-ns-resize {
      cursor: ns-resize;
    }

    .cursor-nw-resize {
      cursor: nw-resize;
    }

    .cursor-nwse-resize {
      cursor: nwse-resize;
    }

    .cursor-pointer {
      cursor: pointer;
    }

    .cursor-progress {
      cursor: progress;
    }

    .cursor-row-resize {
      cursor: row-resize;
    }

    .cursor-s-resize {
      cursor: s-resize;
    }

    .cursor-se-resize {
      cursor: se-resize;
    }

    .cursor-sw-resize {
      cursor: sw-resize;
    }

    .cursor-text {
      cursor: text;
    }

    .cursor-vertical-text {
      cursor: vertical-text;
    }

    .cursor-w-resize {
      cursor: w-resize;
    }

    .cursor-wait {
      cursor: wait;
    }

    .cursor-zoom-in {
      cursor: zoom-in;
    }

    .cursor-zoom-out {
      cursor: zoom-out;
    }"
  `)
  expect(
    await run([
      'cursor',
      '-cursor-auto',
      '-cursor-default',
      '-cursor-pointer',
      '-cursor-wait',
      '-cursor-text',
      '-cursor-move',
      '-cursor-help',
      '-cursor-not-allowed',
      '-cursor-none',
      '-cursor-context-menu',
      '-cursor-progress',
      '-cursor-cell',
      '-cursor-crosshair',
      '-cursor-vertical-text',
      '-cursor-alias',
      '-cursor-copy',
      '-cursor-no-drop',
      '-cursor-grab',
      '-cursor-grabbing',
      '-cursor-all-scroll',
      '-cursor-col-resize',
      '-cursor-row-resize',
      '-cursor-n-resize',
      '-cursor-e-resize',
      '-cursor-s-resize',
      '-cursor-w-resize',
      '-cursor-ne-resize',
      '-cursor-nw-resize',
      '-cursor-se-resize',
      '-cursor-sw-resize',
      '-cursor-ew-resize',
      '-cursor-ns-resize',
      '-cursor-nesw-resize',
      '-cursor-nwse-resize',
      '-cursor-zoom-in',
      '-cursor-zoom-out',
      '-cursor-[var(--value)]',
      '-cursor-custom',
      'cursor-auto/foo',
      'cursor-default/foo',
      'cursor-pointer/foo',
      'cursor-wait/foo',
      'cursor-text/foo',
      'cursor-move/foo',
      'cursor-help/foo',
      'cursor-not-allowed/foo',
      'cursor-none/foo',
      'cursor-context-menu/foo',
      'cursor-progress/foo',
      'cursor-cell/foo',
      'cursor-crosshair/foo',
      'cursor-vertical-text/foo',
      'cursor-alias/foo',
      'cursor-copy/foo',
      'cursor-no-drop/foo',
      'cursor-grab/foo',
      'cursor-grabbing/foo',
      'cursor-all-scroll/foo',
      'cursor-col-resize/foo',
      'cursor-row-resize/foo',
      'cursor-n-resize/foo',
      'cursor-e-resize/foo',
      'cursor-s-resize/foo',
      'cursor-w-resize/foo',
      'cursor-ne-resize/foo',
      'cursor-nw-resize/foo',
      'cursor-se-resize/foo',
      'cursor-sw-resize/foo',
      'cursor-ew-resize/foo',
      'cursor-ns-resize/foo',
      'cursor-nesw-resize/foo',
      'cursor-nwse-resize/foo',
      'cursor-zoom-in/foo',
      'cursor-zoom-out/foo',
      'cursor-[var(--value)]/foo',
      'cursor-custom/foo',
    ]),
  ).toEqual('')
})

test('touch-action', async () => {
  expect(await run(['touch-auto', 'touch-none', 'touch-manipulation'])).toMatchInlineSnapshot(`
    ".touch-auto {
      touch-action: auto;
    }

    .touch-manipulation {
      touch-action: manipulation;
    }

    .touch-none {
      touch-action: none;
    }"
  `)
  expect(
    await run([
      '-touch-auto',
      '-touch-none',
      '-touch-manipulation',
      'touch-auto/foo',
      'touch-none/foo',
      'touch-manipulation/foo',
    ]),
  ).toEqual('')
})

test('touch-pan', async () => {
  expect(
    await run([
      'touch-pan-x',
      'touch-pan-left',
      'touch-pan-right',
      'touch-pan-y',
      'touch-pan-up',
      'touch-pan-down',
    ]),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-pan-x: initial;
          --tw-pan-y: initial;
          --tw-pinch-zoom: initial;
        }
      }
    }

    .touch-pan-left {
      --tw-pan-x: pan-left;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    .touch-pan-right {
      --tw-pan-x: pan-right;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    .touch-pan-x {
      --tw-pan-x: pan-x;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    .touch-pan-down {
      --tw-pan-y: pan-down;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    .touch-pan-up {
      --tw-pan-y: pan-up;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    .touch-pan-y {
      --tw-pan-y: pan-y;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    @property --tw-pan-x {
      syntax: "*";
      inherits: false
    }

    @property --tw-pan-y {
      syntax: "*";
      inherits: false
    }

    @property --tw-pinch-zoom {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      '-touch-pan-x',
      '-touch-pan-left',
      '-touch-pan-right',
      '-touch-pan-y',
      '-touch-pan-up',
      '-touch-pan-down',
      'touch-pan-x/foo',
      'touch-pan-left/foo',
      'touch-pan-right/foo',
      'touch-pan-y/foo',
      'touch-pan-up/foo',
      'touch-pan-down/foo',
    ]),
  ).toEqual('')
})

test('touch-pinch-zoom', async () => {
  expect(await run(['touch-pinch-zoom'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-pan-x: initial;
          --tw-pan-y: initial;
          --tw-pinch-zoom: initial;
        }
      }
    }

    .touch-pinch-zoom {
      --tw-pinch-zoom: pinch-zoom;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    @property --tw-pan-x {
      syntax: "*";
      inherits: false
    }

    @property --tw-pan-y {
      syntax: "*";
      inherits: false
    }

    @property --tw-pinch-zoom {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(await run(['-touch-pinch-zoom', 'touch-pinch-zoom/foo'])).toEqual('')
})

test('select', async () => {
  expect(await run(['select-none', 'select-text', 'select-all', 'select-auto']))
    .toMatchInlineSnapshot(`
      ".select-all {
        -webkit-user-select: all;
        user-select: all;
      }

      .select-auto {
        -webkit-user-select: auto;
        user-select: auto;
      }

      .select-none {
        -webkit-user-select: none;
        user-select: none;
      }

      .select-text {
        -webkit-user-select: text;
        user-select: text;
      }"
    `)
  expect(
    await run([
      '-select-none',
      '-select-text',
      '-select-all',
      '-select-auto',
      'select-none/foo',
      'select-text/foo',
      'select-all/foo',
      'select-auto/foo',
    ]),
  ).toEqual('')
})

test('resize', async () => {
  expect(await run(['resize-none', 'resize', 'resize-x', 'resize-y'])).toMatchInlineSnapshot(`
    ".resize {
      resize: both;
    }

    .resize-none {
      resize: none;
    }

    .resize-x {
      resize: horizontal;
    }

    .resize-y {
      resize: vertical;
    }"
  `)
  expect(
    await run([
      '-resize-none',
      '-resize',
      '-resize-x',
      '-resize-y',
      'resize-none/foo',
      'resize/foo',
      'resize-x/foo',
      'resize-y/foo',
    ]),
  ).toEqual('')
})

test('scroll-snap-type', async () => {
  expect(await run(['snap-none', 'snap-x', 'snap-y', 'snap-both'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-scroll-snap-strictness: proximity;
        }
      }
    }

    .snap-both {
      scroll-snap-type: both var(--tw-scroll-snap-strictness);
    }

    .snap-none {
      scroll-snap-type: none;
    }

    .snap-x {
      scroll-snap-type: x var(--tw-scroll-snap-strictness);
    }

    .snap-y {
      scroll-snap-type: y var(--tw-scroll-snap-strictness);
    }

    @property --tw-scroll-snap-strictness {
      syntax: "*";
      inherits: false;
      initial-value: proximity;
    }"
  `)
  expect(
    await run([
      '-snap-none',
      '-snap-x',
      '-snap-y',
      '-snap-both',
      'snap-none/foo',
      'snap-x/foo',
      'snap-y/foo',
      'snap-both/foo',
    ]),
  ).toEqual('')
})

test('--tw-scroll-snap-strictness', async () => {
  expect(await run(['snap-mandatory', 'snap-proximity'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-scroll-snap-strictness: proximity;
        }
      }
    }

    .snap-mandatory {
      --tw-scroll-snap-strictness: mandatory;
    }

    .snap-proximity {
      --tw-scroll-snap-strictness: proximity;
    }

    @property --tw-scroll-snap-strictness {
      syntax: "*";
      inherits: false;
      initial-value: proximity;
    }"
  `)
  expect(
    await run(['-snap-mandatory', '-snap-proximity', 'snap-mandatory/foo', 'snap-proximity/foo']),
  ).toEqual('')
})

test('scroll-snap-align', async () => {
  expect(await run(['snap-align-none', 'snap-start', 'snap-end', 'snap-center']))
    .toMatchInlineSnapshot(`
      ".snap-align-none {
        scroll-snap-align: none;
      }

      .snap-center {
        scroll-snap-align: center;
      }

      .snap-end {
        scroll-snap-align: end;
      }

      .snap-start {
        scroll-snap-align: start;
      }"
    `)
  expect(
    await run([
      '-snap-align-none',
      '-snap-start',
      '-snap-end',
      '-snap-center',
      'snap-align-none/foo',
      'snap-start/foo',
      'snap-end/foo',
      'snap-center/foo',
    ]),
  ).toEqual('')
})

test('scroll-snap-stop', async () => {
  expect(await run(['snap-normal', 'snap-always'])).toMatchInlineSnapshot(`
    ".snap-always {
      scroll-snap-stop: always;
    }

    .snap-normal {
      scroll-snap-stop: normal;
    }"
  `)
  expect(await run(['-snap-normal', '-snap-always', 'snap-normal/foo', 'snap-always/foo'])).toEqual(
    '',
  )
})

test('scroll-m', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-m-4', 'scroll-m-[4px]', '-scroll-m-4', '-scroll-m-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .-scroll-m-4 {
      scroll-margin: calc(var(--spacing-4) * -1);
    }

    .-scroll-m-\\[var\\(--value\\)\\] {
      scroll-margin: calc(var(--value) * -1);
    }

    .scroll-m-4 {
      scroll-margin: var(--spacing-4);
    }

    .scroll-m-\\[4px\\] {
      scroll-margin: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-m',
      'scroll-m-4/foo',
      'scroll-m-[4px]/foo',
      '-scroll-m-4/foo',
      '-scroll-m-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-mx', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-mx-4', 'scroll-mx-[4px]', '-scroll-mx-4', '-scroll-mx-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .-scroll-mx-4 {
      scroll-margin-inline: calc(var(--spacing-4) * -1);
    }

    .-scroll-mx-\\[var\\(--value\\)\\] {
      scroll-margin-inline: calc(var(--value) * -1);
    }

    .scroll-mx-4 {
      scroll-margin-inline: var(--spacing-4);
    }

    .scroll-mx-\\[4px\\] {
      scroll-margin-inline: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-mx',
      'scroll-mx-4/foo',
      'scroll-mx-[4px]/foo',
      '-scroll-mx-4/foo',
      '-scroll-mx-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-my', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-my-4', 'scroll-my-[4px]', '-scroll-my-4', '-scroll-my-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .-scroll-my-4 {
      scroll-margin-block: calc(var(--spacing-4) * -1);
    }

    .-scroll-my-\\[var\\(--value\\)\\] {
      scroll-margin-block: calc(var(--value) * -1);
    }

    .scroll-my-4 {
      scroll-margin-block: var(--spacing-4);
    }

    .scroll-my-\\[4px\\] {
      scroll-margin-block: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-my',
      'scroll-my-4/foo',
      'scroll-my-[4px]/foo',
      '-scroll-my-4/foo',
      '-scroll-my-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-ms', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-ms-4', 'scroll-ms-[4px]', '-scroll-ms-4', '-scroll-ms-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .-scroll-ms-4 {
      scroll-margin-inline-start: calc(var(--spacing-4) * -1);
    }

    .-scroll-ms-\\[var\\(--value\\)\\] {
      scroll-margin-inline-start: calc(var(--value) * -1);
    }

    .scroll-ms-4 {
      scroll-margin-inline-start: var(--spacing-4);
    }

    .scroll-ms-\\[4px\\] {
      scroll-margin-inline-start: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-ms',
      'scroll-ms-4/foo',
      'scroll-ms-[4px]/foo',
      '-scroll-ms-4/foo',
      '-scroll-ms-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-me', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-me-4', 'scroll-me-[4px]', '-scroll-me-4', '-scroll-me-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .-scroll-me-4 {
      scroll-margin-inline-end: calc(var(--spacing-4) * -1);
    }

    .-scroll-me-\\[var\\(--value\\)\\] {
      scroll-margin-inline-end: calc(var(--value) * -1);
    }

    .scroll-me-4 {
      scroll-margin-inline-end: var(--spacing-4);
    }

    .scroll-me-\\[4px\\] {
      scroll-margin-inline-end: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-me',
      'scroll-me-4/foo',
      'scroll-me-[4px]/foo',
      '-scroll-me-4/foo',
      '-scroll-me-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-mt', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-mt-4', 'scroll-mt-[4px]', '-scroll-mt-4', '-scroll-mt-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .-scroll-mt-4 {
      scroll-margin-top: calc(var(--spacing-4) * -1);
    }

    .-scroll-mt-\\[var\\(--value\\)\\] {
      scroll-margin-top: calc(var(--value) * -1);
    }

    .scroll-mt-4 {
      scroll-margin-top: var(--spacing-4);
    }

    .scroll-mt-\\[4px\\] {
      scroll-margin-top: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-mt',
      'scroll-mt-4/foo',
      'scroll-mt-[4px]/foo',
      '-scroll-mt-4/foo',
      '-scroll-mt-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-mr', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-mr-4', 'scroll-mr-[4px]', '-scroll-mr-4', '-scroll-mr-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .-scroll-mr-4 {
      scroll-margin-right: calc(var(--spacing-4) * -1);
    }

    .-scroll-mr-\\[var\\(--value\\)\\] {
      scroll-margin-right: calc(var(--value) * -1);
    }

    .scroll-mr-4 {
      scroll-margin-right: var(--spacing-4);
    }

    .scroll-mr-\\[4px\\] {
      scroll-margin-right: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-mr',
      'scroll-mr-4/foo',
      'scroll-mr-[4px]/foo',
      '-scroll-mr-4/foo',
      '-scroll-mr-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-mb', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-mb-4', 'scroll-mb-[4px]', '-scroll-mb-4', '-scroll-mb-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .-scroll-mb-4 {
      scroll-margin-bottom: calc(var(--spacing-4) * -1);
    }

    .-scroll-mb-\\[var\\(--value\\)\\] {
      scroll-margin-bottom: calc(var(--value) * -1);
    }

    .scroll-mb-4 {
      scroll-margin-bottom: var(--spacing-4);
    }

    .scroll-mb-\\[4px\\] {
      scroll-margin-bottom: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-mb',
      'scroll-mb-4/foo',
      'scroll-mb-[4px]/foo',
      '-scroll-mb-4/foo',
      '-scroll-mb-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-ml', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-ml-4', 'scroll-ml-[4px]', '-scroll-ml-4', '-scroll-ml-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .-scroll-ml-4 {
      scroll-margin-left: calc(var(--spacing-4) * -1);
    }

    .-scroll-ml-\\[var\\(--value\\)\\] {
      scroll-margin-left: calc(var(--value) * -1);
    }

    .scroll-ml-4 {
      scroll-margin-left: var(--spacing-4);
    }

    .scroll-ml-\\[4px\\] {
      scroll-margin-left: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-ml',
      'scroll-ml-4/foo',
      'scroll-ml-[4px]/foo',
      '-scroll-ml-4/foo',
      '-scroll-ml-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-p', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-p-4', 'scroll-p-[4px]', '-scroll-p-4', '-scroll-p-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .scroll-p-4 {
      scroll-padding: var(--spacing-4);
    }

    .scroll-p-\\[4px\\] {
      scroll-padding: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-p',
      'scroll-p-4/foo',
      'scroll-p-[4px]/foo',
      '-scroll-p-4/foo',
      '-scroll-p-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-px', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-px-4', 'scroll-px-[4px]', '-scroll-px-4', '-scroll-px-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .scroll-px-4 {
      scroll-padding-inline: var(--spacing-4);
    }

    .scroll-px-\\[4px\\] {
      scroll-padding-inline: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-px',
      'scroll-px-4/foo',
      'scroll-px-[4px]/foo',
      '-scroll-px-4/foo',
      '-scroll-px-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-py', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-py-4', 'scroll-py-[4px]', '-scroll-py-4', '-scroll-py-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .scroll-py-4 {
      scroll-padding-block: var(--spacing-4);
    }

    .scroll-py-\\[4px\\] {
      scroll-padding-block: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-py',
      'scroll-py-4/foo',
      'scroll-py-[4px]/foo',
      '-scroll-py-4/foo',
      '-scroll-py-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-ps', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-ps-4', 'scroll-ps-[4px]', '-scroll-ps-4', '-scroll-ps-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .scroll-ps-4 {
      scroll-padding-inline-start: var(--spacing-4);
    }

    .scroll-ps-\\[4px\\] {
      scroll-padding-inline-start: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-ps',
      'scroll-ps-4/foo',
      'scroll-ps-[4px]/foo',
      '-scroll-ps-4/foo',
      '-scroll-ps-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-pe', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-pe-4', 'scroll-pe-[4px]', '-scroll-pe-4', '-scroll-pe-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .scroll-pe-4 {
      scroll-padding-inline-end: var(--spacing-4);
    }

    .scroll-pe-\\[4px\\] {
      scroll-padding-inline-end: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-pe',
      'scroll-pe-4/foo',
      'scroll-pe-[4px]/foo',
      '-scroll-pe-4/foo',
      '-scroll-pe-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-pt', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-pt-4', 'scroll-pt-[4px]', '-scroll-pt-4', '-scroll-pt-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .scroll-pt-4 {
      scroll-padding-top: var(--spacing-4);
    }

    .scroll-pt-\\[4px\\] {
      scroll-padding-top: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-pt',
      'scroll-pt-4/foo',
      'scroll-pt-[4px]/foo',
      '-scroll-pt-4/foo',
      '-scroll-pt-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-pr', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-pr-4', 'scroll-pr-[4px]', '-scroll-pr-4', '-scroll-pr-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .scroll-pr-4 {
      scroll-padding-right: var(--spacing-4);
    }

    .scroll-pr-\\[4px\\] {
      scroll-padding-right: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-pr',
      'scroll-pr-4/foo',
      'scroll-pr-[4px]/foo',
      '-scroll-pr-4/foo',
      '-scroll-pr-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-pb', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-pb-4', 'scroll-pb-[4px]', '-scroll-pb-4', '-scroll-pb-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .scroll-pb-4 {
      scroll-padding-bottom: var(--spacing-4);
    }

    .scroll-pb-\\[4px\\] {
      scroll-padding-bottom: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-pb',
      'scroll-pb-4/foo',
      'scroll-pb-[4px]/foo',
      '-scroll-pb-4/foo',
      '-scroll-pb-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('scroll-pl', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-pl-4', 'scroll-pl-[4px]', '-scroll-pl-4', '-scroll-pl-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .scroll-pl-4 {
      scroll-padding-left: var(--spacing-4);
    }

    .scroll-pl-\\[4px\\] {
      scroll-padding-left: 4px;
    }"
  `)
  expect(
    await run([
      'scroll-pl',
      'scroll-pl-4/foo',
      'scroll-pl-[4px]/foo',
      '-scroll-pl-4/foo',
      '-scroll-pl-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('list-style-position', async () => {
  expect(await run(['list-inside', 'list-outside'])).toMatchInlineSnapshot(`
    ".list-inside {
      list-style-position: inside;
    }

    .list-outside {
      list-style-position: outside;
    }"
  `)
  expect(
    await run(['-list-inside', '-list-outside', 'list-inside/foo', 'list-outside/foo']),
  ).toEqual('')
})

test('list', async () => {
  expect(await run(['list-none', 'list-disc', 'list-decimal', 'list-[var(--value)]']))
    .toMatchInlineSnapshot(`
      ".list-\\[var\\(--value\\)\\] {
        list-style-type: var(--value);
      }

      .list-decimal {
        list-style-type: decimal;
      }

      .list-disc {
        list-style-type: disc;
      }

      .list-none {
        list-style-type: none;
      }"
    `)
  expect(
    await run([
      '-list-none',
      '-list-disc',
      '-list-decimal',
      '-list-[var(--value)]',
      'list-none/foo',
      'list-disc/foo',
      'list-decimal/foo',
      'list-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('list-image', async () => {
  expect(await run(['list-image-none', 'list-image-[var(--value)]'])).toMatchInlineSnapshot(`
    ".list-image-\\[var\\(--value\\)\\] {
      list-style-image: var(--value);
    }

    .list-image-none {
      list-style-image: none;
    }"
  `)
  expect(
    await run([
      'list-image',
      '-list-image-none',
      '-list-image-[var(--value)]',
      'list-image-none/foo',
      'list-image-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('appearance', async () => {
  expect(await run(['appearance-none', 'appearance-auto'])).toMatchInlineSnapshot(`
    ".appearance-auto {
      appearance: auto;
    }

    .appearance-none {
      appearance: none;
    }"
  `)
  expect(
    await run([
      'appearance',
      '-appearance-none',
      '-appearance-auto',
      'appearance-none/foo',
      'appearance-auto/foo',
    ]),
  ).toEqual('')
})

test('color-scheme', async () => {
  expect(
    await run([
      'scheme-normal',
      'scheme-dark',
      'scheme-light',
      'scheme-light-dark',
      'scheme-only-dark',
      'scheme-only-light',
    ]),
  ).toMatchInlineSnapshot(`
    ".scheme-dark {
      color-scheme: dark;
    }

    .scheme-light {
      color-scheme: light;
    }

    .scheme-light-dark {
      color-scheme: light dark;
    }

    .scheme-normal {
      color-scheme: normal;
    }

    .scheme-only-dark {
      color-scheme: dark only;
    }

    .scheme-only-light {
      color-scheme: light only;
    }"
  `)
  expect(
    await run([
      'scheme',
      '-scheme-dark',
      '-scheme-light',
      '-scheme-light-dark',
      '-scheme-dark-only',
      '-scheme-light-only',
    ]),
  ).toEqual('')
})

test('columns', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --container-3xs: 16rem;
          --container-7xl: 80rem;
        }
        @tailwind utilities;
      `,
      [
        'columns-auto',
        'columns-3xs',
        'columns-7xl',
        'columns-4',
        'columns-99',
        'columns-[123]',
        'columns-[var(--value)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --container-3xs: 16rem;
      --container-7xl: 80rem;
    }

    .columns-3xs {
      columns: var(--container-3xs);
    }

    .columns-4 {
      columns: 4;
    }

    .columns-7xl {
      columns: var(--container-7xl);
    }

    .columns-99 {
      columns: 99;
    }

    .columns-\\[123\\] {
      columns: 123;
    }

    .columns-\\[var\\(--value\\)\\] {
      columns: var(--value);
    }

    .columns-auto {
      columns: auto;
    }"
  `)
  expect(
    await run([
      'columns',
      'columns--4',
      '-columns-4',
      '-columns-[123]',
      '-columns-[var(--value)]',
      'columns-unknown',
      'columns-auto/foo',
      'columns-3xs/foo',
      'columns-7xl/foo',
      'columns-4/foo',
      'columns-99/foo',
      'columns-[123]/foo',
      'columns-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('break-before', async () => {
  expect(
    await run([
      'break-before-auto',
      'break-before-avoid',
      'break-before-all',
      'break-before-avoid-page',
      'break-before-page',
      'break-before-left',
      'break-before-right',
      'break-before-column',
    ]),
  ).toMatchInlineSnapshot(`
    ".break-before-all {
      break-before: all;
    }

    .break-before-auto {
      break-before: auto;
    }

    .break-before-avoid {
      break-before: avoid;
    }

    .break-before-avoid-page {
      break-before: avoid-page;
    }

    .break-before-column {
      break-before: column;
    }

    .break-before-left {
      break-before: left;
    }

    .break-before-page {
      break-before: page;
    }

    .break-before-right {
      break-before: right;
    }"
  `)
  expect(
    await run([
      'break-before',
      '-break-before-auto',
      '-break-before-avoid',
      '-break-before-all',
      '-break-before-avoid-page',
      '-break-before-page',
      '-break-before-left',
      '-break-before-right',
      '-break-before-column',
      'break-before-auto/foo',
      'break-before-avoid/foo',
      'break-before-all/foo',
      'break-before-avoid-page/foo',
      'break-before-page/foo',
      'break-before-left/foo',
      'break-before-right/foo',
      'break-before-column/foo',
    ]),
  ).toEqual('')
})

test('break-inside', async () => {
  expect(
    await run([
      'break-inside-auto',
      'break-inside-avoid',
      'break-inside-avoid-page',
      'break-inside-avoid-column',
    ]),
  ).toMatchInlineSnapshot(`
    ".break-inside-auto {
      break-inside: auto;
    }

    .break-inside-avoid {
      break-inside: avoid;
    }

    .break-inside-avoid-column {
      break-inside: avoid-column;
    }

    .break-inside-avoid-page {
      break-inside: avoid-page;
    }"
  `)
  expect(
    await run([
      'break-inside',
      '-break-inside-auto',
      '-break-inside-avoid',
      '-break-inside-avoid-page',
      '-break-inside-avoid-column',
      'break-inside-auto/foo',
      'break-inside-avoid/foo',
      'break-inside-avoid-page/foo',
      'break-inside-avoid-column/foo',
    ]),
  ).toEqual('')
})

test('break-after', async () => {
  expect(
    await run([
      'break-after-auto',
      'break-after-avoid',
      'break-after-all',
      'break-after-avoid-page',
      'break-after-page',
      'break-after-left',
      'break-after-right',
      'break-after-column',
    ]),
  ).toMatchInlineSnapshot(`
    ".break-after-all {
      break-after: all;
    }

    .break-after-auto {
      break-after: auto;
    }

    .break-after-avoid {
      break-after: avoid;
    }

    .break-after-avoid-page {
      break-after: avoid-page;
    }

    .break-after-column {
      break-after: column;
    }

    .break-after-left {
      break-after: left;
    }

    .break-after-page {
      break-after: page;
    }

    .break-after-right {
      break-after: right;
    }"
  `)
  expect(
    await run([
      'break-after',
      '-break-after-auto',
      '-break-after-avoid',
      '-break-after-all',
      '-break-after-avoid-page',
      '-break-after-page',
      '-break-after-left',
      '-break-after-right',
      '-break-after-column',
      'break-after-auto/foo',
      'break-after-avoid/foo',
      'break-after-all/foo',
      'break-after-avoid-page/foo',
      'break-after-page/foo',
      'break-after-left/foo',
      'break-after-right/foo',
      'break-after-column/foo',
    ]),
  ).toEqual('')
})

test('auto-cols', async () => {
  expect(
    await run([
      'auto-cols-auto',
      'auto-cols-min',
      'auto-cols-max',
      'auto-cols-fr',
      'auto-cols-[2fr]',
    ]),
  ).toMatchInlineSnapshot(`
    ".auto-cols-\\[2fr\\] {
      grid-auto-columns: 2fr;
    }

    .auto-cols-auto {
      grid-auto-columns: auto;
    }

    .auto-cols-fr {
      grid-auto-columns: minmax(0, 1fr);
    }

    .auto-cols-max {
      grid-auto-columns: max-content;
    }

    .auto-cols-min {
      grid-auto-columns: min-content;
    }"
  `)
  expect(
    await run([
      'auto-cols',
      '-auto-cols-auto',
      '-auto-cols-[2fr]',
      'auto-cols-auto/foo',
      'auto-cols-min/foo',
      'auto-cols-max/foo',
      'auto-cols-fr/foo',
      'auto-cols-[2fr]/foo',
    ]),
  ).toEqual('')
})

test('grid-flow', async () => {
  expect(
    await run([
      'grid-flow-row',
      'grid-flow-col',
      'grid-flow-dense',
      'grid-flow-row-dense',
      'grid-flow-col-dense',
    ]),
  ).toMatchInlineSnapshot(`
    ".grid-flow-col {
      grid-auto-flow: column;
    }

    .grid-flow-col-dense {
      grid-auto-flow: column dense;
    }

    .grid-flow-dense {
      grid-auto-flow: dense;
    }

    .grid-flow-row {
      grid-auto-flow: row;
    }

    .grid-flow-row-dense {
      grid-auto-flow: row dense;
    }"
  `)
  expect(
    await run([
      'grid-flow',
      '-grid-flow-row',
      '-grid-flow-col',
      '-grid-flow-dense',
      '-grid-flow-row-dense',
      '-grid-flow-col-dense',
      'grid-flow-row/foo',
      'grid-flow-col/foo',
      'grid-flow-dense/foo',
      'grid-flow-row-dense/foo',
      'grid-flow-col-dense/foo',
    ]),
  ).toEqual('')
})

test('auto-rows', async () => {
  expect(
    await run([
      'auto-rows-auto',
      'auto-rows-min',
      'auto-rows-max',
      'auto-rows-fr',
      'auto-rows-[2fr]',
    ]),
  ).toMatchInlineSnapshot(`
    ".auto-rows-\\[2fr\\] {
      grid-auto-rows: 2fr;
    }

    .auto-rows-auto {
      grid-auto-rows: auto;
    }

    .auto-rows-fr {
      grid-auto-rows: minmax(0, 1fr);
    }

    .auto-rows-max {
      grid-auto-rows: max-content;
    }

    .auto-rows-min {
      grid-auto-rows: min-content;
    }"
  `)
  expect(
    await run([
      'auto-rows',
      '-auto-rows-auto',
      '-auto-rows-[2fr]',
      'auto-rows-auto/foo',
      'auto-rows-min/foo',
      'auto-rows-max/foo',
      'auto-rows-fr/foo',
      'auto-rows-[2fr]/foo',
    ]),
  ).toEqual('')
})

test('grid-cols', async () => {
  expect(
    await run([
      'grid-cols-none',
      'grid-cols-subgrid',
      'grid-cols-12',
      'grid-cols-99',
      'grid-cols-[123]',
    ]),
  ).toMatchInlineSnapshot(`
    ".grid-cols-12 {
      grid-template-columns: repeat(12, minmax(0, 1fr));
    }

    .grid-cols-99 {
      grid-template-columns: repeat(99, minmax(0, 1fr));
    }

    .grid-cols-\\[123\\] {
      grid-template-columns: 123px;
    }

    .grid-cols-none {
      grid-template-columns: none;
    }

    .grid-cols-subgrid {
      grid-template-columns: subgrid;
    }"
  `)
  expect(
    await run([
      'grid-cols',
      'grid-cols-0',
      '-grid-cols-none',
      '-grid-cols-subgrid',
      'grid-cols--12',
      '-grid-cols-12',
      '-grid-cols-[123]',
      'grid-cols-unknown',
      'grid-cols-none/foo',
      'grid-cols-subgrid/foo',
      'grid-cols-12/foo',
      'grid-cols-99/foo',
      'grid-cols-[123]/foo',
    ]),
  ).toEqual('')
})

test('grid-rows', async () => {
  expect(
    await run([
      'grid-rows-none',
      'grid-rows-subgrid',
      'grid-rows-12',
      'grid-rows-99',
      'grid-rows-[123]',
    ]),
  ).toMatchInlineSnapshot(`
    ".grid-rows-12 {
      grid-template-rows: repeat(12, minmax(0, 1fr));
    }

    .grid-rows-99 {
      grid-template-rows: repeat(99, minmax(0, 1fr));
    }

    .grid-rows-\\[123\\] {
      grid-template-rows: 123px;
    }

    .grid-rows-none {
      grid-template-rows: none;
    }

    .grid-rows-subgrid {
      grid-template-rows: subgrid;
    }"
  `)
  expect(
    await run([
      'grid-rows',
      'grid-rows-0',
      '-grid-rows-none',
      '-grid-rows-subgrid',
      'grid-rows--12',
      '-grid-rows-12',
      '-grid-rows-[123]',
      'grid-rows-unknown',
      'grid-rows-none/foo',
      'grid-rows-subgrid/foo',
      'grid-rows-12/foo',
      'grid-rows-99/foo',
      'grid-rows-[123]/foo',
    ]),
  ).toEqual('')
})

test('flex-direction', async () => {
  expect(await run(['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse']))
    .toMatchInlineSnapshot(`
      ".flex-col {
        flex-direction: column;
      }

      .flex-col-reverse {
        flex-direction: column-reverse;
      }

      .flex-row {
        flex-direction: row;
      }

      .flex-row-reverse {
        flex-direction: row-reverse;
      }"
    `)
  expect(
    await run([
      '-flex-row',
      '-flex-row-reverse',
      '-flex-col',
      '-flex-col-reverse',
      'flex-row/foo',
      'flex-row-reverse/foo',
      'flex-col/foo',
      'flex-col-reverse/foo',
    ]),
  ).toEqual('')
})

test('flex-wrap', async () => {
  expect(await run(['flex-wrap', 'flex-wrap-reverse', 'flex-nowrap'])).toMatchInlineSnapshot(`
    ".flex-nowrap {
      flex-wrap: nowrap;
    }

    .flex-wrap {
      flex-wrap: wrap;
    }

    .flex-wrap-reverse {
      flex-wrap: wrap-reverse;
    }"
  `)
  expect(
    await run([
      '-flex-wrap',
      '-flex-wrap-reverse',
      '-flex-nowrap',
      'flex-wrap/foo',
      'flex-wrap-reverse/foo',
      'flex-nowrap/foo',
    ]),
  ).toEqual('')
})

test('place-content', async () => {
  expect(
    await run([
      'place-content-center',
      'place-content-center-safe',
      'place-content-start',
      'place-content-end',
      'place-content-end-safe',
      'place-content-between',
      'place-content-around',
      'place-content-evenly',
      'place-content-baseline',
      'place-content-stretch',
    ]),
  ).toMatchInlineSnapshot(`
    ".place-content-around {
      place-content: space-around;
    }

    .place-content-baseline {
      place-content: baseline start;
    }

    .place-content-between {
      place-content: space-between;
    }

    .place-content-center {
      place-content: center;
    }

    .place-content-center-safe {
      place-content: safe center;
    }

    .place-content-end {
      place-content: end;
    }

    .place-content-end-safe {
      place-content: safe end;
    }

    .place-content-evenly {
      place-content: space-evenly;
    }

    .place-content-start {
      place-content: start;
    }

    .place-content-stretch {
      place-content: stretch;
    }"
  `)
  expect(
    await run([
      'place-content',
      '-place-content-center',
      '-place-content-start',
      '-place-content-end',
      '-place-content-between',
      '-place-content-around',
      '-place-content-evenly',
      '-place-content-baseline',
      '-place-content-stretch',
      'place-content-center/foo',
      'place-content-start/foo',
      'place-content-end/foo',
      'place-content-between/foo',
      'place-content-around/foo',
      'place-content-evenly/foo',
      'place-content-baseline/foo',
      'place-content-stretch/foo',
    ]),
  ).toEqual('')
})

test('place-items', async () => {
  expect(
    await run([
      'place-items-start',
      'place-items-end',
      'place-items-end-safe',
      'place-items-center',
      'place-items-center-safe',
      'place-items-baseline',
      'place-items-stretch',
    ]),
  ).toMatchInlineSnapshot(`
    ".place-items-baseline {
      place-items: baseline;
    }

    .place-items-center {
      place-items: center;
    }

    .place-items-center-safe {
      place-items: safe center;
    }

    .place-items-end {
      place-items: end;
    }

    .place-items-end-safe {
      place-items: safe end;
    }

    .place-items-start {
      place-items: start;
    }

    .place-items-stretch {
      place-items: stretch stretch;
    }"
  `)
  expect(
    await run([
      'place-items',
      '-place-items-start',
      '-place-items-end',
      '-place-items-center',
      '-place-items-baseline',
      '-place-items-stretch',
      'place-items-start/foo',
      'place-items-end/foo',
      'place-items-center/foo',
      'place-items-baseline/foo',
      'place-items-stretch/foo',
    ]),
  ).toEqual('')
})

test('align-content', async () => {
  expect(
    await run([
      'content-normal',
      'content-center',
      'content-center-safe',
      'content-start',
      'content-end',
      'content-end-safe',
      'content-between',
      'content-around',
      'content-evenly',
      'content-baseline',
      'content-stretch',
    ]),
  ).toMatchInlineSnapshot(`
    ".content-around {
      align-content: space-around;
    }

    .content-baseline {
      align-content: baseline;
    }

    .content-between {
      align-content: space-between;
    }

    .content-center {
      align-content: center;
    }

    .content-center-safe {
      align-content: safe center;
    }

    .content-end {
      align-content: flex-end;
    }

    .content-end-safe {
      align-content: safe flex-end;
    }

    .content-evenly {
      align-content: space-evenly;
    }

    .content-normal {
      align-content: normal;
    }

    .content-start {
      align-content: flex-start;
    }

    .content-stretch {
      align-content: stretch;
    }"
  `)
  expect(
    await run([
      'content',
      '-content-normal',
      '-content-center',
      '-content-start',
      '-content-end',
      '-content-between',
      '-content-around',
      '-content-evenly',
      '-content-baseline',
      '-content-stretch',
      'content-normal/foo',
      'content-center/foo',
      'content-start/foo',
      'content-end/foo',
      'content-between/foo',
      'content-around/foo',
      'content-evenly/foo',
      'content-baseline/foo',
      'content-stretch/foo',
    ]),
  ).toEqual('')
})

test('items', async () => {
  expect(
    await run([
      'items-start',
      'items-end',
      'items-end-safe',
      'items-center',
      'items-center-safe',
      'items-baseline',
      'items-baseline-last',
      'items-stretch',
    ]),
  ).toMatchInlineSnapshot(`
    ".items-baseline {
      align-items: baseline;
    }

    .items-baseline-last {
      align-items: last baseline;
    }

    .items-center {
      align-items: center;
    }

    .items-center-safe {
      align-items: safe center;
    }

    .items-end {
      align-items: flex-end;
    }

    .items-end-safe {
      align-items: safe flex-end;
    }

    .items-start {
      align-items: flex-start;
    }

    .items-stretch {
      align-items: stretch;
    }"
  `)
  expect(
    await run([
      'items',
      '-items-start',
      '-items-end',
      '-items-center',
      '-items-baseline',
      '-items-first-baseline',
      '-items-last-baseline',
      '-items-stretch',
      'items-start/foo',
      'items-end/foo',
      'items-center/foo',
      'items-baseline/foo',
      'items-stretch/foo',
    ]),
  ).toEqual('')
})

test('justify', async () => {
  expect(
    await run([
      'justify-normal',
      'justify-start',
      'justify-end',
      'justify-end-safe',
      'justify-center',
      'justify-center-safe',
      'justify-between',
      'justify-around',
      'justify-evenly',
      'justify-stretch',
    ]),
  ).toMatchInlineSnapshot(`
    ".justify-around {
      justify-content: space-around;
    }

    .justify-between {
      justify-content: space-between;
    }

    .justify-center {
      justify-content: center;
    }

    .justify-center-safe {
      justify-content: safe center;
    }

    .justify-end {
      justify-content: flex-end;
    }

    .justify-end-safe {
      justify-content: safe flex-end;
    }

    .justify-evenly {
      justify-content: space-evenly;
    }

    .justify-normal {
      justify-content: normal;
    }

    .justify-start {
      justify-content: flex-start;
    }

    .justify-stretch {
      justify-content: stretch;
    }"
  `)
  expect(
    await run([
      'justify',
      '-justify-normal',
      '-justify-start',
      '-justify-end',
      '-justify-center',
      '-justify-between',
      '-justify-around',
      '-justify-evenly',
      '-justify-stretch',
      'justify-normal/foo',
      'justify-start/foo',
      'justify-end/foo',
      'justify-center/foo',
      'justify-between/foo',
      'justify-around/foo',
      'justify-evenly/foo',
      'justify-stretch/foo',
    ]),
  ).toEqual('')
})

test('justify-items', async () => {
  expect(
    await run([
      'justify-items-start',
      'justify-items-end',
      'justify-items-end-safe',
      'justify-items-center',
      'justify-items-center-safe',
      'justify-items-stretch',
    ]),
  ).toMatchInlineSnapshot(`
    ".justify-items-center {
      justify-items: center;
    }

    .justify-items-center-safe {
      justify-items: safe center;
    }

    .justify-items-end {
      justify-items: end;
    }

    .justify-items-end-safe {
      justify-items: safe end;
    }

    .justify-items-start {
      justify-items: start;
    }

    .justify-items-stretch {
      justify-items: stretch;
    }"
  `)
  expect(
    await run([
      'justify-items',
      '-justify-items-start',
      '-justify-items-end',
      '-justify-items-center',
      '-justify-items-stretch',
      'justify-items-start/foo',
      'justify-items-end/foo',
      'justify-items-center/foo',
      'justify-items-stretch/foo',
    ]),
  ).toEqual('')
})

test('gap', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['gap-4', 'gap-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .gap-4 {
      gap: var(--spacing-4);
    }

    .gap-\\[4px\\] {
      gap: 4px;
    }"
  `)
  expect(await run(['gap', '-gap-4', '-gap-[4px]', 'gap-4/foo', 'gap-[4px]/foo'])).toEqual('')
})

test('gap-x', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['gap-x-4', 'gap-x-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .gap-x-4 {
      column-gap: var(--spacing-4);
    }

    .gap-x-\\[4px\\] {
      column-gap: 4px;
    }"
  `)
  expect(
    await run(['gap-x', '-gap-x-4', '-gap-x-[4px]', 'gap-x-4/foo', 'gap-x-[4px]/foo']),
  ).toEqual('')
})

test('gap-y', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['gap-y-4', 'gap-y-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing-4: 1rem;
    }

    .gap-y-4 {
      row-gap: var(--spacing-4);
    }

    .gap-y-\\[4px\\] {
      row-gap: 4px;
    }"
  `)
  expect(
    await run(['gap-y', '-gap-y-4', '-gap-y-[4px]', 'gap-y-4/foo', 'gap-y-[4px]/foo']),
  ).toEqual('')
})

test('space-x', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['space-x-4', 'space-x-[4px]', '-space-x-4'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-space-x-reverse: 0;
        }
      }
    }

    :root, :host {
      --spacing-4: 1rem;
    }

    :where(.-space-x-4 > :not(:last-child)) {
      --tw-space-x-reverse: 0;
      margin-inline-start: calc(calc(var(--spacing-4) * -1) * var(--tw-space-x-reverse));
      margin-inline-end: calc(calc(var(--spacing-4) * -1) * calc(1 - var(--tw-space-x-reverse)));
    }

    :where(.space-x-4 > :not(:last-child)) {
      --tw-space-x-reverse: 0;
      margin-inline-start: calc(var(--spacing-4) * var(--tw-space-x-reverse));
      margin-inline-end: calc(var(--spacing-4) * calc(1 - var(--tw-space-x-reverse)));
    }

    :where(.space-x-\\[4px\\] > :not(:last-child)) {
      --tw-space-x-reverse: 0;
      margin-inline-start: calc(4px * var(--tw-space-x-reverse));
      margin-inline-end: calc(4px * calc(1 - var(--tw-space-x-reverse)));
    }

    @property --tw-space-x-reverse {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(await run(['space-x', 'space-x-4/foo', 'space-x-[4px]/foo', '-space-x-4/foo'])).toEqual('')
})

test('space-y', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['space-y-4', 'space-y-[4px]', '-space-y-4'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-space-y-reverse: 0;
        }
      }
    }

    :root, :host {
      --spacing-4: 1rem;
    }

    :where(.-space-y-4 > :not(:last-child)) {
      --tw-space-y-reverse: 0;
      margin-block-start: calc(calc(var(--spacing-4) * -1) * var(--tw-space-y-reverse));
      margin-block-end: calc(calc(var(--spacing-4) * -1) * calc(1 - var(--tw-space-y-reverse)));
    }

    :where(.space-y-4 > :not(:last-child)) {
      --tw-space-y-reverse: 0;
      margin-block-start: calc(var(--spacing-4) * var(--tw-space-y-reverse));
      margin-block-end: calc(var(--spacing-4) * calc(1 - var(--tw-space-y-reverse)));
    }

    :where(.space-y-\\[4px\\] > :not(:last-child)) {
      --tw-space-y-reverse: 0;
      margin-block-start: calc(4px * var(--tw-space-y-reverse));
      margin-block-end: calc(4px * calc(1 - var(--tw-space-y-reverse)));
    }

    @property --tw-space-y-reverse {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(await run(['space-y', 'space-y-4/foo', 'space-y-[4px]/foo', '-space-y-4/foo'])).toEqual('')
})

test('space-x-reverse', async () => {
  expect(await run(['space-x-reverse'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-space-x-reverse: 0;
        }
      }
    }

    :where(.space-x-reverse > :not(:last-child)) {
      --tw-space-x-reverse: 1;
    }

    @property --tw-space-x-reverse {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(await run(['-space-x-reverse', 'space-x-reverse/foo'])).toEqual('')
})

test('space-y-reverse', async () => {
  expect(await run(['space-y-reverse'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-space-y-reverse: 0;
        }
      }
    }

    :where(.space-y-reverse > :not(:last-child)) {
      --tw-space-y-reverse: 1;
    }

    @property --tw-space-y-reverse {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(await run(['-space-y-reverse', 'space-y-reverse/foo'])).toEqual('')
})

test('divide-x', async () => {
  expect(
    await compileCss(
      css`
        @tailwind utilities;
      `,
      ['divide-x', 'divide-x-4', 'divide-x-123', 'divide-x-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-divide-x-reverse: 0;
          --tw-border-style: solid;
        }
      }
    }

    :where(.divide-x > :not(:last-child)) {
      --tw-divide-x-reverse: 0;
      border-inline-style: var(--tw-border-style);
      border-inline-start-width: calc(1px * var(--tw-divide-x-reverse));
      border-inline-end-width: calc(1px * calc(1 - var(--tw-divide-x-reverse)));
    }

    :where(.divide-x-4 > :not(:last-child)) {
      --tw-divide-x-reverse: 0;
      border-inline-style: var(--tw-border-style);
      border-inline-start-width: calc(4px * var(--tw-divide-x-reverse));
      border-inline-end-width: calc(4px * calc(1 - var(--tw-divide-x-reverse)));
    }

    :where(.divide-x-123 > :not(:last-child)) {
      --tw-divide-x-reverse: 0;
      border-inline-style: var(--tw-border-style);
      border-inline-start-width: calc(123px * var(--tw-divide-x-reverse));
      border-inline-end-width: calc(123px * calc(1 - var(--tw-divide-x-reverse)));
    }

    :where(.divide-x-\\[4px\\] > :not(:last-child)) {
      --tw-divide-x-reverse: 0;
      border-inline-style: var(--tw-border-style);
      border-inline-start-width: calc(4px * var(--tw-divide-x-reverse));
      border-inline-end-width: calc(4px * calc(1 - var(--tw-divide-x-reverse)));
    }

    @property --tw-divide-x-reverse {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-border-style {
      syntax: "*";
      inherits: false;
      initial-value: solid;
    }"
  `)
  expect(
    await run([
      '-divide-x',
      'divide-x--4',
      '-divide-x-4',
      '-divide-x-123',
      'divide-x-unknown',
      'divide-x/foo',
      'divide-x-4/foo',
      'divide-x-123/foo',
      'divide-x-[4px]/foo',
    ]),
  ).toEqual('')
})

test('divide-x with custom default border width', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --default-border-width: 2px;
        }
        @tailwind utilities;
      `,
      ['divide-x'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-divide-x-reverse: 0;
          --tw-border-style: solid;
        }
      }
    }

    :where(.divide-x > :not(:last-child)) {
      --tw-divide-x-reverse: 0;
      border-inline-style: var(--tw-border-style);
      border-inline-start-width: calc(2px * var(--tw-divide-x-reverse));
      border-inline-end-width: calc(2px * calc(1 - var(--tw-divide-x-reverse)));
    }

    @property --tw-divide-x-reverse {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-border-style {
      syntax: "*";
      inherits: false;
      initial-value: solid;
    }"
  `)
  expect(await run(['divide-x/foo'])).toEqual('')
})

test('divide-y', async () => {
  expect(
    await compileCss(
      css`
        @tailwind utilities;
      `,
      ['divide-y', 'divide-y-4', 'divide-y-123', 'divide-y-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-divide-y-reverse: 0;
          --tw-border-style: solid;
        }
      }
    }

    :where(.divide-y > :not(:last-child)) {
      --tw-divide-y-reverse: 0;
      border-bottom-style: var(--tw-border-style);
      border-top-style: var(--tw-border-style);
      border-top-width: calc(1px * var(--tw-divide-y-reverse));
      border-bottom-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
    }

    :where(.divide-y-4 > :not(:last-child)) {
      --tw-divide-y-reverse: 0;
      border-bottom-style: var(--tw-border-style);
      border-top-style: var(--tw-border-style);
      border-top-width: calc(4px * var(--tw-divide-y-reverse));
      border-bottom-width: calc(4px * calc(1 - var(--tw-divide-y-reverse)));
    }

    :where(.divide-y-123 > :not(:last-child)) {
      --tw-divide-y-reverse: 0;
      border-bottom-style: var(--tw-border-style);
      border-top-style: var(--tw-border-style);
      border-top-width: calc(123px * var(--tw-divide-y-reverse));
      border-bottom-width: calc(123px * calc(1 - var(--tw-divide-y-reverse)));
    }

    :where(.divide-y-\\[4px\\] > :not(:last-child)) {
      --tw-divide-y-reverse: 0;
      border-bottom-style: var(--tw-border-style);
      border-top-style: var(--tw-border-style);
      border-top-width: calc(4px * var(--tw-divide-y-reverse));
      border-bottom-width: calc(4px * calc(1 - var(--tw-divide-y-reverse)));
    }

    @property --tw-divide-y-reverse {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-border-style {
      syntax: "*";
      inherits: false;
      initial-value: solid;
    }"
  `)
  expect(
    await run([
      '-divide-y',
      'divide-y--4',
      '-divide-y-4',
      '-divide-y-123',
      'divide-y-unknown',
      'divide-y/foo',
      'divide-y-4/foo',
      'divide-y-123/foo',
      'divide-y-[4px]/foo',
    ]),
  ).toEqual('')
})

test('divide-y with custom default border width', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --default-border-width: 2px;
        }
        @tailwind utilities;
      `,
      ['divide-y'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-divide-y-reverse: 0;
          --tw-border-style: solid;
        }
      }
    }

    :where(.divide-y > :not(:last-child)) {
      --tw-divide-y-reverse: 0;
      border-bottom-style: var(--tw-border-style);
      border-top-style: var(--tw-border-style);
      border-top-width: calc(2px * var(--tw-divide-y-reverse));
      border-bottom-width: calc(2px * calc(1 - var(--tw-divide-y-reverse)));
    }

    @property --tw-divide-y-reverse {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-border-style {
      syntax: "*";
      inherits: false;
      initial-value: solid;
    }"
  `)
  expect(await run(['divide-y/foo'])).toEqual('')
})

test('divide-x-reverse', async () => {
  expect(await run(['divide-x-reverse'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-divide-x-reverse: 0;
        }
      }
    }

    :where(.divide-x-reverse > :not(:last-child)) {
      --tw-divide-x-reverse: 1;
    }

    @property --tw-divide-x-reverse {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(await run(['-divide-x-reverse', 'divide-x-reverse/foo'])).toEqual('')
})

test('divide-y-reverse', async () => {
  expect(await run(['divide-y-reverse'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-divide-y-reverse: 0;
        }
      }
    }

    :where(.divide-y-reverse > :not(:last-child)) {
      --tw-divide-y-reverse: 1;
    }

    @property --tw-divide-y-reverse {
      syntax: "*";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(await run(['-divide-y-reverse', 'divide-y-reverse/foo'])).toEqual('')
})

test('divide-style', async () => {
  expect(
    await run(['divide-solid', 'divide-dashed', 'divide-dotted', 'divide-double', 'divide-none']),
  ).toMatchInlineSnapshot(`
    ":where(.divide-dashed > :not(:last-child)) {
      --tw-border-style: dashed;
      border-style: dashed;
    }

    :where(.divide-dotted > :not(:last-child)) {
      --tw-border-style: dotted;
      border-style: dotted;
    }

    :where(.divide-double > :not(:last-child)) {
      --tw-border-style: double;
      border-style: double;
    }

    :where(.divide-none > :not(:last-child)) {
      --tw-border-style: none;
      border-style: none;
    }

    :where(.divide-solid > :not(:last-child)) {
      --tw-border-style: solid;
      border-style: solid;
    }"
  `)
  expect(
    await run([
      'divide',
      '-divide-solid',
      '-divide-dashed',
      '-divide-dotted',
      '-divide-double',
      '-divide-none',
      'divide-solid/foo',
      'divide-dashed/foo',
      'divide-dotted/foo',
      'divide-double/foo',
      'divide-none/foo',
    ]),
  ).toEqual('')
})

test('accent', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --accent-color-blue-500: #3b82f6;
        }
        @tailwind utilities;
      `,
      [
        'accent-red-500',
        'accent-red-500/50',
        'accent-red-500/2.25',
        'accent-red-500/2.5',
        'accent-red-500/2.75',
        'accent-red-500/[0.5]',
        'accent-red-500/[50%]',
        'accent-blue-500',
        'accent-current',
        'accent-current/50',
        'accent-current/[0.5]',
        'accent-current/[50%]',
        'accent-inherit',
        'accent-transparent',
        'accent-[#0088cc]',
        'accent-[#0088cc]/50',
        'accent-[#0088cc]/[0.5]',
        'accent-[#0088cc]/[50%]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --color-red-500: #ef4444;
      --accent-color-blue-500: #3b82f6;
    }

    .accent-\\[\\#0088cc\\] {
      accent-color: #08c;
    }

    .accent-\\[\\#0088cc\\]\\/50, .accent-\\[\\#0088cc\\]\\/\\[0\\.5\\], .accent-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      accent-color: oklab(59.9824% -.067 -.124 / .5);
    }

    .accent-blue-500 {
      accent-color: var(--accent-color-blue-500);
    }

    .accent-current, .accent-current\\/50 {
      accent-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .accent-current\\/50 {
        accent-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .accent-current\\/\\[0\\.5\\] {
      accent-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .accent-current\\/\\[0\\.5\\] {
        accent-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .accent-current\\/\\[50\\%\\] {
      accent-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .accent-current\\/\\[50\\%\\] {
        accent-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .accent-inherit {
      accent-color: inherit;
    }

    .accent-red-500 {
      accent-color: var(--color-red-500);
    }

    .accent-red-500\\/2\\.5 {
      accent-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .accent-red-500\\/2\\.5 {
        accent-color: color-mix(in oklab, var(--color-red-500) 2.5%, transparent);
      }
    }

    .accent-red-500\\/2\\.25 {
      accent-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .accent-red-500\\/2\\.25 {
        accent-color: color-mix(in oklab, var(--color-red-500) 2.25%, transparent);
      }
    }

    .accent-red-500\\/2\\.75 {
      accent-color: #ef444407;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .accent-red-500\\/2\\.75 {
        accent-color: color-mix(in oklab, var(--color-red-500) 2.75%, transparent);
      }
    }

    .accent-red-500\\/50 {
      accent-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .accent-red-500\\/50 {
        accent-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .accent-red-500\\/\\[0\\.5\\] {
      accent-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .accent-red-500\\/\\[0\\.5\\] {
        accent-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .accent-red-500\\/\\[50\\%\\] {
      accent-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .accent-red-500\\/\\[50\\%\\] {
        accent-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .accent-transparent {
      accent-color: #0000;
    }"
  `)
  expect(
    await run([
      'accent',
      '-accent-red-500',
      'accent-red-500/-50',
      '-accent-red-500/50',
      '-accent-red-500/[0.5]',
      '-accent-red-500/[50%]',
      '-accent-current',
      '-accent-current/50',
      '-accent-current/[0.5]',
      '-accent-current/[50%]',
      '-accent-inherit',
      '-accent-transparent',
      'accent-[#0088cc]/-50',
      '-accent-[#0088cc]',
      '-accent-[#0088cc]/50',
      '-accent-[#0088cc]/[0.5]',
      '-accent-[#0088cc]/[50%]',
      'accent-red-500/foo',
      'accent-red-500/50/foo',
      'accent-red-500/[0.5]/foo',
      'accent-red-500/[50%]/foo',
      'accent-current/foo',
      'accent-current/50/foo',
      'accent-current/[0.5]/foo',
      'accent-current/[50%]/foo',
      'accent-inherit/foo',
      'accent-transparent/foo',
      'accent-[#0088cc]/foo',
      'accent-[#0088cc]/50/foo',
      'accent-[#0088cc]/[0.5]/foo',
      'accent-[#0088cc]/[50%]/foo',
    ]),
  ).toEqual('')
})

test('caret', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --caret-color-blue-500: #3b82f6;
        }
        @tailwind utilities;
      `,
      [
        'caret-red-500',
        'caret-red-500/50',
        'caret-red-500/2.25',
        'caret-red-500/2.5',
        'caret-red-500/2.75',
        'caret-red-500/[0.5]',
        'caret-red-500/[50%]',
        'caret-blue-500',
        'caret-current',
        'caret-current/50',
        'caret-current/[0.5]',
        'caret-current/[50%]',
        'caret-inherit',
        'caret-transparent',
        'caret-[#0088cc]',
        'caret-[#0088cc]/50',
        'caret-[#0088cc]/[0.5]',
        'caret-[#0088cc]/[50%]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --color-red-500: #ef4444;
      --caret-color-blue-500: #3b82f6;
    }

    .caret-\\[\\#0088cc\\] {
      caret-color: #08c;
    }

    .caret-\\[\\#0088cc\\]\\/50, .caret-\\[\\#0088cc\\]\\/\\[0\\.5\\], .caret-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      caret-color: oklab(59.9824% -.067 -.124 / .5);
    }

    .caret-blue-500 {
      caret-color: var(--caret-color-blue-500);
    }

    .caret-current, .caret-current\\/50 {
      caret-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .caret-current\\/50 {
        caret-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .caret-current\\/\\[0\\.5\\] {
      caret-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .caret-current\\/\\[0\\.5\\] {
        caret-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .caret-current\\/\\[50\\%\\] {
      caret-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .caret-current\\/\\[50\\%\\] {
        caret-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .caret-inherit {
      caret-color: inherit;
    }

    .caret-red-500 {
      caret-color: var(--color-red-500);
    }

    .caret-red-500\\/2\\.5 {
      caret-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .caret-red-500\\/2\\.5 {
        caret-color: color-mix(in oklab, var(--color-red-500) 2.5%, transparent);
      }
    }

    .caret-red-500\\/2\\.25 {
      caret-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .caret-red-500\\/2\\.25 {
        caret-color: color-mix(in oklab, var(--color-red-500) 2.25%, transparent);
      }
    }

    .caret-red-500\\/2\\.75 {
      caret-color: #ef444407;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .caret-red-500\\/2\\.75 {
        caret-color: color-mix(in oklab, var(--color-red-500) 2.75%, transparent);
      }
    }

    .caret-red-500\\/50 {
      caret-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .caret-red-500\\/50 {
        caret-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .caret-red-500\\/\\[0\\.5\\] {
      caret-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .caret-red-500\\/\\[0\\.5\\] {
        caret-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .caret-red-500\\/\\[50\\%\\] {
      caret-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .caret-red-500\\/\\[50\\%\\] {
        caret-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .caret-transparent {
      caret-color: #0000;
    }"
  `)
  expect(
    await run([
      'caret',
      '-caret-red-500',
      '-caret-red-500/50',
      '-caret-red-500/[0.5]',
      '-caret-red-500/[50%]',
      '-caret-current',
      '-caret-current/50',
      '-caret-current/[0.5]',
      '-caret-current/[50%]',
      '-caret-inherit',
      '-caret-transparent',
      '-caret-[#0088cc]',
      '-caret-[#0088cc]/50',
      '-caret-[#0088cc]/[0.5]',
      '-caret-[#0088cc]/[50%]',
      'caret-red-500/foo',
      'caret-red-500/50/foo',
      'caret-red-500/[0.5]/foo',
      'caret-red-500/[50%]/foo',
      'caret-current/foo',
      'caret-current/50/foo',
      'caret-current/[0.5]/foo',
      'caret-current/[50%]/foo',
      'caret-inherit/foo',
      'caret-transparent/foo',
      'caret-[#0088cc]/foo',
      'caret-[#0088cc]/50/foo',
      'caret-[#0088cc]/[0.5]/foo',
      'caret-[#0088cc]/[50%]/foo',
    ]),
  ).toEqual('')
})

test('divide-color', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        'divide-red-500',
        'divide-red-500/50',
        'divide-red-500/2.25',
        'divide-red-500/2.5',
        'divide-red-500/2.75',
        'divide-red-500/[0.5]',
        'divide-red-500/[50%]',
        'divide-current',
        'divide-current/50',
        'divide-current/[0.5]',
        'divide-current/[50%]',
        'divide-inherit',
        'divide-transparent',
        'divide-[#0088cc]',
        'divide-[#0088cc]/50',
        'divide-[#0088cc]/[0.5]',
        'divide-[#0088cc]/[50%]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --color-red-500: #ef4444;
    }

    :where(.divide-\\[\\#0088cc\\] > :not(:last-child)) {
      border-color: #08c;
    }

    :where(.divide-\\[\\#0088cc\\]\\/50 > :not(:last-child)), :where(.divide-\\[\\#0088cc\\]\\/\\[0\\.5\\] > :not(:last-child)), :where(.divide-\\[\\#0088cc\\]\\/\\[50\\%\\] > :not(:last-child)) {
      border-color: oklab(59.9824% -.067 -.124 / .5);
    }

    :where(.divide-current > :not(:last-child)), :where(.divide-current\\/50 > :not(:last-child)) {
      border-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      :where(.divide-current\\/50 > :not(:last-child)) {
        border-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    :where(.divide-current\\/\\[0\\.5\\] > :not(:last-child)) {
      border-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      :where(.divide-current\\/\\[0\\.5\\] > :not(:last-child)) {
        border-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    :where(.divide-current\\/\\[50\\%\\] > :not(:last-child)) {
      border-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      :where(.divide-current\\/\\[50\\%\\] > :not(:last-child)) {
        border-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    :where(.divide-inherit > :not(:last-child)) {
      border-color: inherit;
    }

    :where(.divide-red-500 > :not(:last-child)) {
      border-color: var(--color-red-500);
    }

    :where(.divide-red-500\\/2\\.5 > :not(:last-child)) {
      border-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      :where(.divide-red-500\\/2\\.5 > :not(:last-child)) {
        border-color: color-mix(in oklab, var(--color-red-500) 2.5%, transparent);
      }
    }

    :where(.divide-red-500\\/2\\.25 > :not(:last-child)) {
      border-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      :where(.divide-red-500\\/2\\.25 > :not(:last-child)) {
        border-color: color-mix(in oklab, var(--color-red-500) 2.25%, transparent);
      }
    }

    :where(.divide-red-500\\/2\\.75 > :not(:last-child)) {
      border-color: #ef444407;
    }

    @supports (color: color-mix(in lab, red, red)) {
      :where(.divide-red-500\\/2\\.75 > :not(:last-child)) {
        border-color: color-mix(in oklab, var(--color-red-500) 2.75%, transparent);
      }
    }

    :where(.divide-red-500\\/50 > :not(:last-child)) {
      border-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      :where(.divide-red-500\\/50 > :not(:last-child)) {
        border-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    :where(.divide-red-500\\/\\[0\\.5\\] > :not(:last-child)) {
      border-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      :where(.divide-red-500\\/\\[0\\.5\\] > :not(:last-child)) {
        border-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    :where(.divide-red-500\\/\\[50\\%\\] > :not(:last-child)) {
      border-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      :where(.divide-red-500\\/\\[50\\%\\] > :not(:last-child)) {
        border-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    :where(.divide-transparent > :not(:last-child)) {
      border-color: #0000;
    }"
  `)
  expect(
    await run([
      'divide',
      '-divide-red-500',
      '-divide-red-500/50',
      '-divide-red-500/[0.5]',
      '-divide-red-500/[50%]',
      '-divide-current',
      '-divide-current/50',
      '-divide-current/[0.5]',
      '-divide-current/[50%]',
      '-divide-inherit',
      '-divide-transparent',
      '-divide-[#0088cc]',
      '-divide-[#0088cc]/50',
      '-divide-[#0088cc]/[0.5]',
      '-divide-[#0088cc]/[50%]',
      'divide-red-500/foo',
      'divide-red-500/50/foo',
      'divide-red-500/[0.5]/foo',
      'divide-red-500/[50%]/foo',
      'divide-current/foo',
      'divide-current/50/foo',
      'divide-current/[0.5]/foo',
      'divide-current/[50%]/foo',
      'divide-inherit/foo',
      'divide-transparent/foo',
      'divide-[#0088cc]/foo',
      'divide-[#0088cc]/50/foo',
      'divide-[#0088cc]/[0.5]/foo',
      'divide-[#0088cc]/[50%]/foo',
    ]),
  ).toEqual('')
})

test('place-self', async () => {
  expect(
    await run([
      'place-self-auto',
      'place-self-start',
      'place-self-end',
      'place-self-end-safe',
      'place-self-center',
      'place-self-center-safe',
      'place-self-stretch',
    ]),
  ).toMatchInlineSnapshot(`
    ".place-self-auto {
      place-self: auto;
    }

    .place-self-center {
      place-self: center;
    }

    .place-self-center-safe {
      place-self: safe center;
    }

    .place-self-end {
      place-self: end;
    }

    .place-self-end-safe {
      place-self: safe end;
    }

    .place-self-start {
      place-self: start;
    }

    .place-self-stretch {
      place-self: stretch stretch;
    }"
  `)
  expect(
    await run([
      'place-self',
      '-place-self-auto',
      '-place-self-start',
      '-place-self-end',
      '-place-self-center',
      '-place-self-stretch',
      'place-self-auto/foo',
      'place-self-start/foo',
      'place-self-end/foo',
      'place-self-center/foo',
      'place-self-stretch/foo',
    ]),
  ).toEqual('')
})

test('self', async () => {
  expect(
    await run([
      'self-auto',
      'self-start',
      'self-end',
      'self-end-safe',
      'self-center',
      'self-center-safe',
      'self-stretch',
      'self-baseline',
      'self-baseline-last',
    ]),
  ).toMatchInlineSnapshot(`
    ".self-auto {
      align-self: auto;
    }

    .self-baseline {
      align-self: baseline;
    }

    .self-baseline-last {
      align-self: last baseline;
    }

    .self-center {
      align-self: center;
    }

    .self-center-safe {
      align-self: safe center;
    }

    .self-end {
      align-self: flex-end;
    }

    .self-end-safe {
      align-self: safe flex-end;
    }

    .self-start {
      align-self: flex-start;
    }

    .self-stretch {
      align-self: stretch;
    }"
  `)
  expect(
    await run([
      'self',
      '-self-auto',
      '-self-start',
      '-self-end',
      '-self-center',
      '-self-stretch',
      '-self-baseline',
      'self-auto/foo',
      'self-start/foo',
      'self-end/foo',
      'self-center/foo',
      'self-stretch/foo',
      'self-baseline/foo',
    ]),
  ).toEqual('')
})

test('justify-self', async () => {
  expect(
    await run([
      'justify-self-auto',
      'justify-self-start',
      'justify-self-end',
      'justify-self-end-safe',
      'justify-self-center',
      'justify-self-center-safe',
      'justify-self-stretch',
      'justify-self-baseline',
    ]),
  ).toMatchInlineSnapshot(`
    ".justify-self-auto {
      justify-self: auto;
    }

    .justify-self-center {
      justify-self: center;
    }

    .justify-self-center-safe {
      justify-self: safe center;
    }

    .justify-self-end {
      justify-self: flex-end;
    }

    .justify-self-end-safe {
      justify-self: safe flex-end;
    }

    .justify-self-start {
      justify-self: flex-start;
    }

    .justify-self-stretch {
      justify-self: stretch;
    }"
  `)
  expect(
    await run([
      'justify-self',
      '-justify-self-auto',
      '-justify-self-start',
      '-justify-self-end',
      '-justify-self-center',
      '-justify-self-stretch',
      '-justify-self-baseline',
      'justify-self-auto/foo',
      'justify-self-start/foo',
      'justify-self-end/foo',
      'justify-self-center/foo',
      'justify-self-stretch/foo',
      'justify-self-baseline/foo',
    ]),
  ).toEqual('')
})

test('overflow', async () => {
  expect(
    await run([
      'overflow-auto',
      'overflow-hidden',
      'overflow-clip',
      'overflow-visible',
      'overflow-scroll',
    ]),
  ).toMatchInlineSnapshot(`
    ".overflow-auto {
      overflow: auto;
    }

    .overflow-clip {
      overflow: clip;
    }

    .overflow-hidden {
      overflow: hidden;
    }

    .overflow-scroll {
      overflow: scroll;
    }

    .overflow-visible {
      overflow: visible;
    }"
  `)
  expect(
    await run([
      'overflow',
      '-overflow-auto',
      '-overflow-hidden',
      '-overflow-clip',
      '-overflow-visible',
      '-overflow-scroll',
      'overflow-auto/foo',
      'overflow-hidden/foo',
      'overflow-clip/foo',
      'overflow-visible/foo',
      'overflow-scroll/foo',
    ]),
  ).toEqual('')
})

test('overflow-x', async () => {
  expect(
    await run([
      'overflow-x-auto',
      'overflow-x-hidden',
      'overflow-x-clip',
      'overflow-x-visible',
      'overflow-x-scroll',
    ]),
  ).toMatchInlineSnapshot(`
    ".overflow-x-auto {
      overflow-x: auto;
    }

    .overflow-x-clip {
      overflow-x: clip;
    }

    .overflow-x-hidden {
      overflow-x: hidden;
    }

    .overflow-x-scroll {
      overflow-x: scroll;
    }

    .overflow-x-visible {
      overflow-x: visible;
    }"
  `)
  expect(
    await run([
      'overflow-x',
      '-overflow-x-auto',
      '-overflow-x-hidden',
      '-overflow-x-clip',
      '-overflow-x-visible',
      '-overflow-x-scroll',
      'overflow-x-auto/foo',
      'overflow-x-hidden/foo',
      'overflow-x-clip/foo',
      'overflow-x-visible/foo',
      'overflow-x-scroll/foo',
    ]),
  ).toEqual('')
})

test('overflow-y', async () => {
  expect(
    await run([
      'overflow-y-auto',
      'overflow-y-hidden',
      'overflow-y-clip',
      'overflow-y-visible',
      'overflow-y-scroll',
    ]),
  ).toMatchInlineSnapshot(`
    ".overflow-y-auto {
      overflow-y: auto;
    }

    .overflow-y-clip {
      overflow-y: clip;
    }

    .overflow-y-hidden {
      overflow-y: hidden;
    }

    .overflow-y-scroll {
      overflow-y: scroll;
    }

    .overflow-y-visible {
      overflow-y: visible;
    }"
  `)
  expect(
    await run([
      'overflow-y',
      '-overflow-y-auto',
      '-overflow-y-hidden',
      '-overflow-y-clip',
      '-overflow-y-visible',
      '-overflow-y-scroll',
      'overflow-y-auto/foo',
      'overflow-y-hidden/foo',
      'overflow-y-clip/foo',
      'overflow-y-visible/foo',
      'overflow-y-scroll/foo',
    ]),
  ).toEqual('')
})

test('overscroll', async () => {
  expect(await run(['overscroll-auto', 'overscroll-contain', 'overscroll-none']))
    .toMatchInlineSnapshot(`
      ".overscroll-auto {
        overscroll-behavior: auto;
      }

      .overscroll-contain {
        overscroll-behavior: contain;
      }

      .overscroll-none {
        overscroll-behavior: none;
      }"
    `)
  expect(
    await run([
      'overscroll',
      '-overscroll-auto',
      '-overscroll-contain',
      '-overscroll-none',
      'overscroll-auto/foo',
      'overscroll-contain/foo',
      'overscroll-none/foo',
    ]),
  ).toEqual('')
})

test('overscroll-x', async () => {
  expect(await run(['overscroll-x-auto', 'overscroll-x-contain', 'overscroll-x-none']))
    .toMatchInlineSnapshot(`
      ".overscroll-x-auto {
        overscroll-behavior-x: auto;
      }

      .overscroll-x-contain {
        overscroll-behavior-x: contain;
      }

      .overscroll-x-none {
        overscroll-behavior-x: none;
      }"
    `)
  expect(
    await run([
      'overscroll-x',
      '-overscroll-x-auto',
      '-overscroll-x-contain',
      '-overscroll-x-none',
      'overscroll-x-auto/foo',
      'overscroll-x-contain/foo',
      'overscroll-x-none/foo',
    ]),
  ).toEqual('')
})

test('overscroll-y', async () => {
  expect(await run(['overscroll-y-auto', 'overscroll-y-contain', 'overscroll-y-none']))
    .toMatchInlineSnapshot(`
      ".overscroll-y-auto {
        overscroll-behavior-y: auto;
      }

      .overscroll-y-contain {
        overscroll-behavior-y: contain;
      }

      .overscroll-y-none {
        overscroll-behavior-y: none;
      }"
    `)
  expect(
    await run([
      'overscroll-y',
      '-overscroll-y-auto',
      '-overscroll-y-contain',
      '-overscroll-y-none',
      'overscroll-y-auto/foo',
      'overscroll-y-contain/foo',
      'overscroll-y-none/foo',
    ]),
  ).toEqual('')
})

test('scroll-behavior', async () => {
  expect(await run(['scroll-auto', 'scroll-smooth'])).toMatchInlineSnapshot(`
    ".scroll-auto {
      scroll-behavior: auto;
    }

    .scroll-smooth {
      scroll-behavior: smooth;
    }"
  `)
  expect(
    await run(['scroll', '-scroll-auto', '-scroll-smooth', 'scroll-auto/foo', 'scroll-smooth/foo']),
  ).toEqual('')
})

test('truncate', async () => {
  expect(await run(['truncate'])).toMatchInlineSnapshot(`
    ".truncate {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }"
  `)
  expect(await run(['-truncate', 'truncate/foo'])).toEqual('')
})

test('text-overflow', async () => {
  expect(await run(['text-ellipsis', 'text-clip'])).toMatchInlineSnapshot(`
    ".text-clip {
      text-overflow: clip;
    }

    .text-ellipsis {
      text-overflow: ellipsis;
    }"
  `)
  expect(await run(['-text-ellipsis', '-text-clip', 'text-ellipsis/foo', 'text-clip/foo'])).toEqual(
    '',
  )
})

test('hyphens', async () => {
  expect(await run(['hyphens-none', 'hyphens-manual', 'hyphens-auto'])).toMatchInlineSnapshot(`
    ".hyphens-auto {
      -webkit-hyphens: auto;
      hyphens: auto;
    }

    .hyphens-manual {
      -webkit-hyphens: manual;
      hyphens: manual;
    }

    .hyphens-none {
      -webkit-hyphens: none;
      hyphens: none;
    }"
  `)
  expect(
    await run([
      'hyphens',
      '-hyphens-none',
      '-hyphens-manual',
      '-hyphens-auto',
      'hyphens-none/foo',
      'hyphens-manual/foo',
      'hyphens-auto/foo',
    ]),
  ).toEqual('')
})

test('whitespace', async () => {
  expect(
    await run([
      'whitespace-normal',
      'whitespace-nowrap',
      'whitespace-pre',
      'whitespace-pre-line',
      'whitespace-pre-wrap',
      'whitespace-break-spaces',
    ]),
  ).toMatchInlineSnapshot(`
    ".whitespace-break-spaces {
      white-space: break-spaces;
    }

    .whitespace-normal {
      white-space: normal;
    }

    .whitespace-nowrap {
      white-space: nowrap;
    }

    .whitespace-pre {
      white-space: pre;
    }

    .whitespace-pre-line {
      white-space: pre-line;
    }

    .whitespace-pre-wrap {
      white-space: pre-wrap;
    }"
  `)
  expect(
    await run([
      'whitespace',
      '-whitespace-normal',
      '-whitespace-nowrap',
      '-whitespace-pre',
      '-whitespace-pre-line',
      '-whitespace-pre-wrap',
      '-whitespace-break-spaces',
      'whitespace-normal/foo',
      'whitespace-nowrap/foo',
      'whitespace-pre/foo',
      'whitespace-pre-line/foo',
      'whitespace-pre-wrap/foo',
      'whitespace-break-spaces/foo',
    ]),
  ).toEqual('')
})

test('text-wrap', async () => {
  expect(await run(['text-wrap', 'text-nowrap', 'text-balance', 'text-pretty']))
    .toMatchInlineSnapshot(`
      ".text-balance {
        text-wrap: balance;
      }

      .text-nowrap {
        text-wrap: nowrap;
      }

      .text-pretty {
        text-wrap: pretty;
      }

      .text-wrap {
        text-wrap: wrap;
      }"
    `)
  expect(
    await run([
      '-text-wrap',
      '-text-nowrap',
      '-text-balance',
      '-text-pretty',
      'text-wrap/foo',
      'text-nowrap/foo',
      'text-balance/foo',
      'text-pretty/foo',
    ]),
  ).toEqual('')
})

test('word-break', async () => {
  expect(await run(['break-normal', 'break-words', 'break-all', 'break-keep']))
    .toMatchInlineSnapshot(`
      ".break-normal {
        overflow-wrap: normal;
        word-break: normal;
      }

      .break-words {
        overflow-wrap: break-word;
      }

      .break-all {
        word-break: break-all;
      }

      .break-keep {
        word-break: keep-all;
      }"
    `)
  expect(
    await run([
      '-break-normal',
      '-break-words',
      '-break-all',
      '-break-keep',
      'break-normal/foo',
      'break-words/foo',
      'break-all/foo',
      'break-keep/foo',
    ]),
  ).toEqual('')
})

test('overflow-wrap', async () => {
  expect(await run(['wrap-anywhere', 'wrap-break-word', 'wrap-normal'])).toMatchInlineSnapshot(`
    ".wrap-anywhere {
      overflow-wrap: anywhere;
    }

    .wrap-break-word {
      overflow-wrap: break-word;
    }

    .wrap-normal {
      overflow-wrap: normal;
    }"
  `)
  expect(
    await run([
      '-wrap-anywhere',
      '-wrap-break-word',
      '-wrap-normal',
      'wrap-anywhere/foo',
      'wrap-break-word/foo',
      'wrap-normal/foo',
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
  expect(
    await run([
      '-rounded-s',
      '-rounded-s-full',
      '-rounded-s-none',
      '-rounded-s-sm',
      '-rounded-s-[4px]',
      'rounded-s/foo',
      'rounded-s-full/foo',
      'rounded-s-none/foo',
      'rounded-s-sm/foo',
      'rounded-s-[4px]/foo',
    ]),
  ).toEqual('')
})

test('rounded-e', async () => {
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
      ['rounded-e', 'rounded-e-full', 'rounded-e-none', 'rounded-e-sm', 'rounded-e-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-e {
      border-start-end-radius: var(--radius);
      border-end-end-radius: var(--radius);
    }

    .rounded-e-\\[4px\\] {
      border-start-end-radius: 4px;
      border-end-end-radius: 4px;
    }

    .rounded-e-full {
      border-start-end-radius: var(--radius-full);
      border-end-end-radius: var(--radius-full);
    }

    .rounded-e-none {
      border-start-end-radius: var(--radius-none);
      border-end-end-radius: var(--radius-none);
    }

    .rounded-e-sm {
      border-start-end-radius: var(--radius-sm);
      border-end-end-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded-e',
      '-rounded-e-full',
      '-rounded-e-none',
      '-rounded-e-sm',
      '-rounded-e-[4px]',
      'rounded-e/foo',
      'rounded-e-full/foo',
      'rounded-e-none/foo',
      'rounded-e-sm/foo',
      'rounded-e-[4px]/foo',
    ]),
  ).toEqual('')
})

test('rounded-t', async () => {
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
      ['rounded-t', 'rounded-t-full', 'rounded-t-none', 'rounded-t-sm', 'rounded-t-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-t {
      border-top-left-radius: var(--radius);
      border-top-right-radius: var(--radius);
    }

    .rounded-t-\\[4px\\] {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    .rounded-t-full {
      border-top-left-radius: 3.40282e38px;
      border-top-right-radius: 3.40282e38px;
      border-top-left-radius: var(--radius-full);
      border-top-right-radius: var(--radius-full);
    }

    .rounded-t-none {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top-left-radius: var(--radius-none);
      border-top-right-radius: var(--radius-none);
    }

    .rounded-t-sm {
      border-top-left-radius: var(--radius-sm);
      border-top-right-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded-t',
      '-rounded-t-full',
      '-rounded-t-none',
      '-rounded-t-sm',
      '-rounded-t-[4px]',
      'rounded-t/foo',
      'rounded-t-full/foo',
      'rounded-t-none/foo',
      'rounded-t-sm/foo',
      'rounded-t-[4px]/foo',
    ]),
  ).toEqual('')
})

test('rounded-r', async () => {
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
      ['rounded-r', 'rounded-r-full', 'rounded-r-none', 'rounded-r-sm', 'rounded-r-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-r {
      border-top-right-radius: var(--radius);
      border-bottom-right-radius: var(--radius);
    }

    .rounded-r-\\[4px\\] {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    .rounded-r-full {
      border-top-right-radius: 3.40282e38px;
      border-bottom-right-radius: 3.40282e38px;
      border-top-right-radius: var(--radius-full);
      border-bottom-right-radius: var(--radius-full);
    }

    .rounded-r-none {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-top-right-radius: var(--radius-none);
      border-bottom-right-radius: var(--radius-none);
    }

    .rounded-r-sm {
      border-top-right-radius: var(--radius-sm);
      border-bottom-right-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded-r',
      '-rounded-r-full',
      '-rounded-r-none',
      '-rounded-r-sm',
      '-rounded-r-[4px]',
      'rounded-r/foo',
      'rounded-r-full/foo',
      'rounded-r-none/foo',
      'rounded-r-sm/foo',
      'rounded-r-[4px]/foo',
    ]),
  ).toEqual('')
})

test('rounded-b', async () => {
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
      ['rounded-b', 'rounded-b-full', 'rounded-b-none', 'rounded-b-sm', 'rounded-b-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-b {
      border-bottom-right-radius: var(--radius);
      border-bottom-left-radius: var(--radius);
    }

    .rounded-b-\\[4px\\] {
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .rounded-b-full {
      border-bottom-right-radius: 3.40282e38px;
      border-bottom-left-radius: 3.40282e38px;
      border-bottom-right-radius: var(--radius-full);
      border-bottom-left-radius: var(--radius-full);
    }

    .rounded-b-none {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: var(--radius-none);
      border-bottom-left-radius: var(--radius-none);
    }

    .rounded-b-sm {
      border-bottom-right-radius: var(--radius-sm);
      border-bottom-left-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded-b',
      '-rounded-b-full',
      '-rounded-b-none',
      '-rounded-b-sm',
      '-rounded-b-[4px]',
      'rounded-b/foo',
      'rounded-b-full/foo',
      'rounded-b-none/foo',
      'rounded-b-sm/foo',
      'rounded-b-[4px]/foo',
    ]),
  ).toEqual('')
})

test('rounded-l', async () => {
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
      ['rounded-l', 'rounded-l-full', 'rounded-l-none', 'rounded-l-sm', 'rounded-l-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-l {
      border-top-left-radius: var(--radius);
      border-bottom-left-radius: var(--radius);
    }

    .rounded-l-\\[4px\\] {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .rounded-l-full {
      border-top-left-radius: 3.40282e38px;
      border-bottom-left-radius: 3.40282e38px;
      border-top-left-radius: var(--radius-full);
      border-bottom-left-radius: var(--radius-full);
    }

    .rounded-l-none {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-top-left-radius: var(--radius-none);
      border-bottom-left-radius: var(--radius-none);
    }

    .rounded-l-sm {
      border-top-left-radius: var(--radius-sm);
      border-bottom-left-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded-l',
      '-rounded-l-full',
      '-rounded-l-none',
      '-rounded-l-sm',
      '-rounded-l-[4px]',
      'rounded-l/foo',
      'rounded-l-full/foo',
      'rounded-l-none/foo',
      'rounded-l-sm/foo',
      'rounded-l-[4px]/foo',
    ]),
  ).toEqual('')
})

test('rounded-ss', async () => {
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
      ['rounded-ss', 'rounded-ss-full', 'rounded-ss-none', 'rounded-ss-sm', 'rounded-ss-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-ss {
      border-start-start-radius: var(--radius);
    }

    .rounded-ss-\\[4px\\] {
      border-start-start-radius: 4px;
    }

    .rounded-ss-full {
      border-start-start-radius: var(--radius-full);
    }

    .rounded-ss-none {
      border-start-start-radius: var(--radius-none);
    }

    .rounded-ss-sm {
      border-start-start-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded-ss',
      '-rounded-ss-full',
      '-rounded-ss-none',
      '-rounded-ss-sm',
      '-rounded-ss-[4px]',
      'rounded-ss/foo',
      'rounded-ss-full/foo',
      'rounded-ss-none/foo',
      'rounded-ss-sm/foo',
      'rounded-ss-[4px]/foo',
    ]),
  ).toEqual('')
})

test('rounded-se', async () => {
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
      ['rounded-se', 'rounded-se-full', 'rounded-se-none', 'rounded-se-sm', 'rounded-se-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-se {
      border-start-end-radius: var(--radius);
    }

    .rounded-se-\\[4px\\] {
      border-start-end-radius: 4px;
    }

    .rounded-se-full {
      border-start-end-radius: var(--radius-full);
    }

    .rounded-se-none {
      border-start-end-radius: var(--radius-none);
    }

    .rounded-se-sm {
      border-start-end-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded-se',
      '-rounded-se-full',
      '-rounded-se-none',
      '-rounded-se-sm',
      '-rounded-se-[4px]',
      'rounded-se/foo',
      'rounded-se-full/foo',
      'rounded-se-none/foo',
      'rounded-se-sm/foo',
      'rounded-se-[4px]/foo',
    ]),
  ).toEqual('')
})

test('rounded-ee', async () => {
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
      ['rounded-ee', 'rounded-ee-full', 'rounded-ee-none', 'rounded-ee-sm', 'rounded-ee-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-ee {
      border-end-end-radius: var(--radius);
    }

    .rounded-ee-\\[4px\\] {
      border-end-end-radius: 4px;
    }

    .rounded-ee-full {
      border-end-end-radius: var(--radius-full);
    }

    .rounded-ee-none {
      border-end-end-radius: var(--radius-none);
    }

    .rounded-ee-sm {
      border-end-end-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded-ee',
      '-rounded-ee-full',
      '-rounded-ee-none',
      '-rounded-ee-sm',
      '-rounded-ee-[4px]',
      'rounded-ee/foo',
      'rounded-ee-full/foo',
      'rounded-ee-none/foo',
      'rounded-ee-sm/foo',
      'rounded-ee-[4px]/foo',
    ]),
  ).toEqual('')
})

test('rounded-es', async () => {
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
      ['rounded-es', 'rounded-es-full', 'rounded-es-none', 'rounded-es-sm', 'rounded-es-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-es {
      border-end-start-radius: var(--radius);
    }

    .rounded-es-\\[4px\\] {
      border-end-start-radius: 4px;
    }

    .rounded-es-full {
      border-end-start-radius: var(--radius-full);
    }

    .rounded-es-none {
      border-end-start-radius: var(--radius-none);
    }

    .rounded-es-sm {
      border-end-start-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded-es',
      '-rounded-es-full',
      '-rounded-es-none',
      '-rounded-es-sm',
      '-rounded-es-[4px]',
      'rounded-es/foo',
      'rounded-es-full/foo',
      'rounded-es-none/foo',
      'rounded-es-sm/foo',
      'rounded-es-[4px]/foo',
    ]),
  ).toEqual('')
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
      border-top-left-radius: 3.40282e38px;
      border-top-left-radius: var(--radius-full);
    }

    .rounded-tl-none {
      border-top-left-radius: 0;
      border-top-left-radius: var(--radius-none);
    }

    .rounded-tl-sm {
      border-top-left-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded-tl',
      '-rounded-tl-full',
      '-rounded-tl-none',
      '-rounded-tl-sm',
      '-rounded-tl-[4px]',
      'rounded-tl/foo',
      'rounded-tl-full/foo',
      'rounded-tl-none/foo',
      'rounded-tl-sm/foo',
      'rounded-tl-[4px]/foo',
    ]),
  ).toEqual('')
})

test('rounded-tr', async () => {
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
      ['rounded-tr', 'rounded-tr-full', 'rounded-tr-none', 'rounded-tr-sm', 'rounded-tr-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-tr {
      border-top-right-radius: var(--radius);
    }

    .rounded-tr-\\[4px\\] {
      border-top-right-radius: 4px;
    }

    .rounded-tr-full {
      border-top-right-radius: 3.40282e38px;
      border-top-right-radius: var(--radius-full);
    }

    .rounded-tr-none {
      border-top-right-radius: 0;
      border-top-right-radius: var(--radius-none);
    }

    .rounded-tr-sm {
      border-top-right-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded-tr',
      '-rounded-tr-full',
      '-rounded-tr-none',
      '-rounded-tr-sm',
      '-rounded-tr-[4px]',
      'rounded-tr/foo',
      'rounded-tr-full/foo',
      'rounded-tr-none/foo',
      'rounded-tr-sm/foo',
      'rounded-tr-[4px]/foo',
    ]),
  ).toEqual('')
})

test('rounded-br', async () => {
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
      ['rounded-br', 'rounded-br-full', 'rounded-br-none', 'rounded-br-sm', 'rounded-br-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-br {
      border-bottom-right-radius: var(--radius);
    }

    .rounded-br-\\[4px\\] {
      border-bottom-right-radius: 4px;
    }

    .rounded-br-full {
      border-bottom-right-radius: 3.40282e38px;
      border-bottom-right-radius: var(--radius-full);
    }

    .rounded-br-none {
      border-bottom-right-radius: 0;
      border-bottom-right-radius: var(--radius-none);
    }

    .rounded-br-sm {
      border-bottom-right-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded-br',
      '-rounded-br-full',
      '-rounded-br-none',
      '-rounded-br-sm',
      '-rounded-br-[4px]',
      'rounded-br/foo',
      'rounded-br-full/foo',
      'rounded-br-none/foo',
      'rounded-br-sm/foo',
      'rounded-br-[4px]/foo',
    ]),
  ).toEqual('')
})

test('rounded-bl', async () => {
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
      ['rounded-bl', 'rounded-bl-full', 'rounded-bl-none', 'rounded-bl-sm', 'rounded-bl-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-bl {
      border-bottom-left-radius: var(--radius);
    }

    .rounded-bl-\\[4px\\] {
      border-bottom-left-radius: 4px;
    }

    .rounded-bl-full {
      border-bottom-left-radius: 3.40282e38px;
      border-bottom-left-radius: var(--radius-full);
    }

    .rounded-bl-none {
      border-bottom-left-radius: 0;
      border-bottom-left-radius: var(--radius-none);
    }

    .rounded-bl-sm {
      border-bottom-left-radius: var(--radius-sm);
    }"
  `)
  expect(
    await run([
      '-rounded-bl',
      '-rounded-bl-full',
      '-rounded-bl-none',
      '-rounded-bl-sm',
      '-rounded-bl-[4px]',
      'rounded-bl/foo',
      'rounded-bl-full/foo',
      'rounded-bl-none/foo',
      'rounded-bl-sm/foo',
      'rounded-bl-[4px]/foo',
    ]),
  ).toEqual('')
})

test('border-style', async () => {
  expect(
    await run([
      'border-solid',
      'border-dashed',
      'border-dotted',
      'border-double',
      'border-hidden',
      'border-none',
    ]),
  ).toMatchInlineSnapshot(`
    ".border-dashed {
      --tw-border-style: dashed;
      border-style: dashed;
    }

    .border-dotted {
      --tw-border-style: dotted;
      border-style: dotted;
    }

    .border-double {
      --tw-border-style: double;
      border-style: double;
    }

    .border-hidden {
      --tw-border-style: hidden;
      border-style: hidden;
    }

    .border-none {
      --tw-border-style: none;
      border-style: none;
    }

    .border-solid {
      --tw-border-style: solid;
      border-style: solid;
    }"
  `)
  expect(
    await run([
      '-border-solid',
      '-border-dashed',
      '-border-dotted',
      '-border-double',
      '-border-hidden',
      '-border-none',
      'border-solid/foo',
      'border-dashed/foo',
      'border-dotted/foo',
      'border-double/foo',
      'border-hidden/foo',
      'border-none/foo',
    ]),
  ).toEqual('')
})

// All border utilities are generated in the same way
// so we can test them all at once with a loop
const prefixes = [
  'border',
  'border-x',
  'border-y',
  'border-s',
  'border-e',
  'border-t',
  'border-r',
  'border-b',
  'border-l',
]

for (let prefix of prefixes) {
  test(`${prefix}-*`, async () => {
    let classes = []

    // Width
    classes.push(prefix)
    classes.push(`${prefix}-0`)
    classes.push(`${prefix}-2`)
    classes.push(`${prefix}-4`)
    classes.push(`${prefix}-123`)

    // Inference: Width
    classes.push(`${prefix}-[thin]`)
    classes.push(`${prefix}-[medium]`)
    classes.push(`${prefix}-[thick]`)
    classes.push(`${prefix}-[12px]`)
    classes.push(`${prefix}-[12px_8px]`)
    classes.push(`${prefix}-[0_2px_0_2px]`)
    classes.push(`${prefix}-[0_1]`)
    classes.push(`${prefix}-[thin_2px]`)
    classes.push(`${prefix}-[length:var(--my-width)]`)
    classes.push(`${prefix}-[line-width:var(--my-width)]`)

    // Color
    classes.push(`${prefix}-red-500`)
    classes.push(`${prefix}-red-500/50`)
    classes.push(`${prefix}-red-500/2.25`)
    classes.push(`${prefix}-red-500/2.5`)
    classes.push(`${prefix}-red-500/2.75`)
    classes.push(`${prefix}-blue-500`)
    classes.push(`${prefix}-[#0088cc]`)
    classes.push(`${prefix}-[#0088cc]/50`)
    classes.push(`${prefix}-current`)
    classes.push(`${prefix}-current/50`)
    classes.push(`${prefix}-inherit`)
    classes.push(`${prefix}-transparent`)

    // Inference: Color
    classes.push(`${prefix}-[var(--my-color)]`)
    classes.push(`${prefix}-[var(--my-color)]/50`)
    classes.push(`${prefix}-[color:var(--my-color)]`)
    classes.push(`${prefix}-[color:var(--my-color)]/50`)

    expect(
      await compileCss(
        css`
          @theme {
            --radius-none: 0px;
            --radius-full: 9999px;
            --radius-sm: 0.125rem;
            --color-red-500: #ef4444;
            --border-color-blue-500: #3b82f6;
          }
          @tailwind utilities;
        `,
        classes,
      ),
    ).toMatchSnapshot()

    // No border utilities can ever be negative
    expect(await run(classes.map((cls) => `-${cls}`))).toEqual('')
    expect(
      await run([
        `${prefix}/foo`,
        `${prefix}-0/foo`,
        `${prefix}-2/foo`,
        `${prefix}-4/foo`,
        `${prefix}-123/foo`,
        `${prefix}-[thin]/foo`,
        `${prefix}-[medium]/foo`,
        `${prefix}-[thick]/foo`,
        `${prefix}-[12px]/foo`,
        `${prefix}-[length:var(--my-width)]/foo`,
        `${prefix}-[line-width:var(--my-width)]/foo`,
      ]),
    ).toEqual('')
  })
}

test('border with custom default border width', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --default-border-width: 2px;
        }
        @tailwind utilities;
      `,
      ['border'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-border-style: solid;
        }
      }
    }

    .border {
      border-style: var(--tw-border-style);
      border-width: 2px;
    }

    @property --tw-border-style {
      syntax: "*";
      inherits: false;
      initial-value: solid;
    }"
  `)
  expect(await run(['-border', 'border/foo'])).toEqual('')
})

test('bg', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --background-color-blue-500: #3b82f6;
        }
        @tailwind utilities;
      `,
      [
        // background-color
        'bg-red-500',
        'bg-red-500/50',
        'bg-red-500/2.25',
        'bg-red-500/2.5',
        'bg-red-500/2.75',
        'bg-red-500/[0.5]',
        'bg-red-500/[50%]',
        'bg-blue-500',
        'bg-current',
        'bg-current/50',
        'bg-current/[0.5]',
        'bg-current/[50%]',
        'bg-current/[var(--bg-opacity)]',
        'bg-inherit',
        'bg-transparent',
        'bg-[#0088cc]',
        'bg-[#0088cc]/50',
        'bg-[#0088cc]/[0.5]',
        'bg-[#0088cc]/[50%]',
        'bg-[var(--some-var)]',
        'bg-[var(--some-var)]/50',
        'bg-[var(--some-var)]/[0.5]',
        'bg-[var(--some-var)]/[50%]',
        'bg-[color:var(--some-var)]',
        'bg-[color:var(--some-var)]/50',
        'bg-[color:var(--some-var)]/[0.5]',
        'bg-[color:var(--some-var)]/[50%]',

        // background-image
        'bg-none',

        // Modern linear-gradient API
        'bg-linear-to-t',
        'bg-linear-to-tr',
        'bg-linear-to-r',
        'bg-linear-to-br',
        'bg-linear-to-b',
        'bg-linear-to-bl',
        'bg-linear-to-l',
        'bg-linear-to-tl',
        'bg-linear-45',
        '-bg-linear-45',

        // With interpolation mode modifier
        'bg-linear-to-r/oklch',
        'bg-linear-to-r/oklab',
        'bg-linear-to-r/hsl',
        'bg-linear-to-r/srgb',
        'bg-linear-to-r/longer',
        'bg-linear-to-r/shorter',
        'bg-linear-to-r/increasing',
        'bg-linear-to-r/decreasing',
        'bg-linear-to-r/[in_hsl_longer_hue]',
        'bg-linear-45/oklab',
        '-bg-linear-45/oklab',
        'bg-linear-45/shorter',
        'bg-linear-45/[in_hsl_longer_hue]',
        'bg-conic/oklch',
        'bg-conic/oklab',
        'bg-conic/hsl',
        'bg-conic/srgb',
        'bg-conic/longer',
        'bg-conic/shorter',
        'bg-conic/increasing',
        'bg-conic/decreasing',
        'bg-conic/[in_hsl_longer_hue]',
        'bg-conic-45/oklab',
        '-bg-conic-45/oklab',
        'bg-conic-45/shorter',
        'bg-conic-45/[in_hsl_longer_hue]',
        'bg-radial/oklch',
        'bg-radial/oklab',
        'bg-radial/hsl',
        'bg-radial/srgb',
        'bg-radial/longer',
        'bg-radial/shorter',
        'bg-radial/increasing',
        'bg-radial/decreasing',
        'bg-radial/[in_hsl_longer_hue]',
        'bg-radial-[circle_at_center]',
        // Invalid but proves not converted to `in oklch longer hue` when used
        // as an arbitrary value
        'bg-linear-to-r/[longer]',

        'bg-[url(/image.png)]',
        'bg-[url:var(--my-url)]',
        'bg-[linear-gradient(to_bottom,red,blue)]',
        'bg-[image:var(--my-gradient)]',
        'bg-linear-[125deg]',
        'bg-linear-[1.3rad]',
        'bg-linear-[to_bottom]',
        '-bg-linear-[125deg]',
        '-bg-linear-[1.3rad]',

        // background-size
        'bg-auto',
        'bg-cover',
        'bg-contain',
        'bg-[cover]',
        'bg-[contain]',
        'bg-[size:120px_120px]',

        // background-attachment
        'bg-fixed',
        'bg-local',
        'bg-scroll',

        // background-position
        'bg-top',
        'bg-top-left',
        'bg-top-right',
        'bg-bottom',
        'bg-bottom-left',
        'bg-bottom-right',
        'bg-left',
        'bg-right',
        'bg-center',
        'bg-[50%]',
        'bg-[120px]',
        'bg-[120px_120px]',
        'bg-[length:120px_120px]',
        'bg-[position:120px_120px]',
        'bg-[size:120px_120px]',
        // Legacy versions in v4.0 and earlier
        'bg-right-top',
        'bg-right-bottom',
        'bg-left-bottom',
        'bg-left-top',

        // background-repeat
        'bg-repeat',
        'bg-no-repeat',
        'bg-repeat-x',
        'bg-repeat-y',
        'bg-repeat-round',
        'bg-repeat-space',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --color-red-500: #ef4444;
      --background-color-blue-500: #3b82f6;
    }

    .bg-\\[\\#0088cc\\] {
      background-color: #08c;
    }

    .bg-\\[\\#0088cc\\]\\/50, .bg-\\[\\#0088cc\\]\\/\\[0\\.5\\], .bg-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      background-color: oklab(59.9824% -.067 -.124 / .5);
    }

    .bg-\\[color\\:var\\(--some-var\\)\\], .bg-\\[color\\:var\\(--some-var\\)\\]\\/50 {
      background-color: var(--some-var);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-\\[color\\:var\\(--some-var\\)\\]\\/50 {
        background-color: color-mix(in oklab, var(--some-var) 50%, transparent);
      }
    }

    .bg-\\[color\\:var\\(--some-var\\)\\]\\/\\[0\\.5\\] {
      background-color: var(--some-var);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-\\[color\\:var\\(--some-var\\)\\]\\/\\[0\\.5\\] {
        background-color: color-mix(in oklab, var(--some-var) 50%, transparent);
      }
    }

    .bg-\\[color\\:var\\(--some-var\\)\\]\\/\\[50\\%\\] {
      background-color: var(--some-var);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-\\[color\\:var\\(--some-var\\)\\]\\/\\[50\\%\\] {
        background-color: color-mix(in oklab, var(--some-var) 50%, transparent);
      }
    }

    .bg-\\[var\\(--some-var\\)\\], .bg-\\[var\\(--some-var\\)\\]\\/50 {
      background-color: var(--some-var);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-\\[var\\(--some-var\\)\\]\\/50 {
        background-color: color-mix(in oklab, var(--some-var) 50%, transparent);
      }
    }

    .bg-\\[var\\(--some-var\\)\\]\\/\\[0\\.5\\] {
      background-color: var(--some-var);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-\\[var\\(--some-var\\)\\]\\/\\[0\\.5\\] {
        background-color: color-mix(in oklab, var(--some-var) 50%, transparent);
      }
    }

    .bg-\\[var\\(--some-var\\)\\]\\/\\[50\\%\\] {
      background-color: var(--some-var);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-\\[var\\(--some-var\\)\\]\\/\\[50\\%\\] {
        background-color: color-mix(in oklab, var(--some-var) 50%, transparent);
      }
    }

    .bg-blue-500 {
      background-color: var(--background-color-blue-500);
    }

    .bg-current, .bg-current\\/50 {
      background-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-current\\/50 {
        background-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .bg-current\\/\\[0\\.5\\] {
      background-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-current\\/\\[0\\.5\\] {
        background-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .bg-current\\/\\[50\\%\\] {
      background-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-current\\/\\[50\\%\\] {
        background-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .bg-current\\/\\[var\\(--bg-opacity\\)\\] {
      background-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-current\\/\\[var\\(--bg-opacity\\)\\] {
        background-color: color-mix(in oklab, currentcolor var(--bg-opacity), transparent);
      }
    }

    .bg-inherit {
      background-color: inherit;
    }

    .bg-red-500 {
      background-color: var(--color-red-500);
    }

    .bg-red-500\\/2\\.5 {
      background-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-red-500\\/2\\.5 {
        background-color: color-mix(in oklab, var(--color-red-500) 2.5%, transparent);
      }
    }

    .bg-red-500\\/2\\.25 {
      background-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-red-500\\/2\\.25 {
        background-color: color-mix(in oklab, var(--color-red-500) 2.25%, transparent);
      }
    }

    .bg-red-500\\/2\\.75 {
      background-color: #ef444407;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-red-500\\/2\\.75 {
        background-color: color-mix(in oklab, var(--color-red-500) 2.75%, transparent);
      }
    }

    .bg-red-500\\/50 {
      background-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-red-500\\/50 {
        background-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .bg-red-500\\/\\[0\\.5\\] {
      background-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-red-500\\/\\[0\\.5\\] {
        background-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .bg-red-500\\/\\[50\\%\\] {
      background-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-red-500\\/\\[50\\%\\] {
        background-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .bg-transparent {
      background-color: #0000;
    }

    .-bg-linear-45 {
      --tw-gradient-position: calc(45deg * -1);
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .-bg-linear-45 {
        --tw-gradient-position: calc(45deg * -1) in oklab;
      }
    }

    .-bg-linear-45\\/oklab {
      --tw-gradient-position: calc(45deg * -1);
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .-bg-linear-45\\/oklab {
        --tw-gradient-position: calc(45deg * -1) in oklab;
      }
    }

    .bg-linear-45 {
      --tw-gradient-position: 45deg;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-45 {
        --tw-gradient-position: 45deg in oklab;
      }
    }

    .bg-linear-45\\/\\[in_hsl_longer_hue\\] {
      --tw-gradient-position: 45deg;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-45\\/\\[in_hsl_longer_hue\\] {
        --tw-gradient-position: 45deg in hsl longer hue;
      }
    }

    .bg-linear-45\\/oklab {
      --tw-gradient-position: 45deg;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-45\\/oklab {
        --tw-gradient-position: 45deg in oklab;
      }
    }

    .bg-linear-45\\/shorter {
      --tw-gradient-position: 45deg;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-45\\/shorter {
        --tw-gradient-position: 45deg in oklch shorter hue;
      }
    }

    .bg-linear-to-b {
      --tw-gradient-position: to bottom;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-b {
        --tw-gradient-position: to bottom in oklab;
      }
    }

    .bg-linear-to-bl {
      --tw-gradient-position: to bottom left;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-bl {
        --tw-gradient-position: to bottom left in oklab;
      }
    }

    .bg-linear-to-br {
      --tw-gradient-position: to bottom right;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-br {
        --tw-gradient-position: to bottom right in oklab;
      }
    }

    .bg-linear-to-l {
      --tw-gradient-position: to left;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-l {
        --tw-gradient-position: to left in oklab;
      }
    }

    .bg-linear-to-r {
      --tw-gradient-position: to right;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-r {
        --tw-gradient-position: to right in oklab;
      }
    }

    .bg-linear-to-r\\/\\[in_hsl_longer_hue\\] {
      --tw-gradient-position: to right;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-r\\/\\[in_hsl_longer_hue\\] {
        --tw-gradient-position: to right in hsl longer hue;
      }
    }

    .bg-linear-to-r\\/\\[longer\\] {
      --tw-gradient-position: to right;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-r\\/\\[longer\\] {
        --tw-gradient-position: to right longer;
      }
    }

    .bg-linear-to-r\\/decreasing {
      --tw-gradient-position: to right;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-r\\/decreasing {
        --tw-gradient-position: to right in oklch decreasing hue;
      }
    }

    .bg-linear-to-r\\/hsl {
      --tw-gradient-position: to right;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-r\\/hsl {
        --tw-gradient-position: to right in hsl;
      }
    }

    .bg-linear-to-r\\/increasing {
      --tw-gradient-position: to right;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-r\\/increasing {
        --tw-gradient-position: to right in oklch increasing hue;
      }
    }

    .bg-linear-to-r\\/longer {
      --tw-gradient-position: to right;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-r\\/longer {
        --tw-gradient-position: to right in oklch longer hue;
      }
    }

    .bg-linear-to-r\\/oklab {
      --tw-gradient-position: to right;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-r\\/oklab {
        --tw-gradient-position: to right in oklab;
      }
    }

    .bg-linear-to-r\\/oklch {
      --tw-gradient-position: to right;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-r\\/oklch {
        --tw-gradient-position: to right in oklch;
      }
    }

    .bg-linear-to-r\\/shorter {
      --tw-gradient-position: to right;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-r\\/shorter {
        --tw-gradient-position: to right in oklch shorter hue;
      }
    }

    .bg-linear-to-r\\/srgb {
      --tw-gradient-position: to right;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-r\\/srgb {
        --tw-gradient-position: to right in srgb;
      }
    }

    .bg-linear-to-t {
      --tw-gradient-position: to top;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-t {
        --tw-gradient-position: to top in oklab;
      }
    }

    .bg-linear-to-tl {
      --tw-gradient-position: to top left;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-tl {
        --tw-gradient-position: to top left in oklab;
      }
    }

    .bg-linear-to-tr {
      --tw-gradient-position: to top right;
      background-image: linear-gradient(var(--tw-gradient-stops));
    }

    @supports (background-image: linear-gradient(in lab, red, red)) {
      .bg-linear-to-tr {
        --tw-gradient-position: to top right in oklab;
      }
    }

    .-bg-conic-45\\/oklab {
      --tw-gradient-position: from calc(45deg * -1) in oklab;
      background-image: conic-gradient(var(--tw-gradient-stops));
    }

    .-bg-linear-\\[1\\.3rad\\] {
      --tw-gradient-position: calc(74.4845deg * -1);
      background-image: linear-gradient(var(--tw-gradient-stops, calc(74.4845deg * -1)));
    }

    .-bg-linear-\\[125deg\\] {
      --tw-gradient-position: calc(125deg * -1);
      background-image: linear-gradient(var(--tw-gradient-stops, calc(125deg * -1)));
    }

    .bg-conic-45\\/\\[in_hsl_longer_hue\\] {
      --tw-gradient-position: from 45deg in hsl longer hue;
      background-image: conic-gradient(var(--tw-gradient-stops));
    }

    .bg-conic-45\\/oklab {
      --tw-gradient-position: from 45deg in oklab;
      background-image: conic-gradient(var(--tw-gradient-stops));
    }

    .bg-conic-45\\/shorter {
      --tw-gradient-position: from 45deg in oklch shorter hue;
      background-image: conic-gradient(var(--tw-gradient-stops));
    }

    .bg-conic\\/\\[in_hsl_longer_hue\\] {
      --tw-gradient-position: in hsl longer hue;
      background-image: conic-gradient(var(--tw-gradient-stops));
    }

    .bg-conic\\/decreasing {
      --tw-gradient-position: in oklch decreasing hue;
      background-image: conic-gradient(var(--tw-gradient-stops));
    }

    .bg-conic\\/hsl {
      --tw-gradient-position: in hsl;
      background-image: conic-gradient(var(--tw-gradient-stops));
    }

    .bg-conic\\/increasing {
      --tw-gradient-position: in oklch increasing hue;
      background-image: conic-gradient(var(--tw-gradient-stops));
    }

    .bg-conic\\/longer {
      --tw-gradient-position: in oklch longer hue;
      background-image: conic-gradient(var(--tw-gradient-stops));
    }

    .bg-conic\\/oklab {
      --tw-gradient-position: in oklab;
      background-image: conic-gradient(var(--tw-gradient-stops));
    }

    .bg-conic\\/oklch {
      --tw-gradient-position: in oklch;
      background-image: conic-gradient(var(--tw-gradient-stops));
    }

    .bg-conic\\/shorter {
      --tw-gradient-position: in oklch shorter hue;
      background-image: conic-gradient(var(--tw-gradient-stops));
    }

    .bg-conic\\/srgb {
      --tw-gradient-position: in srgb;
      background-image: conic-gradient(var(--tw-gradient-stops));
    }

    .bg-linear-\\[1\\.3rad\\] {
      --tw-gradient-position: 74.4845deg;
      background-image: linear-gradient(var(--tw-gradient-stops, 74.4845deg));
    }

    .bg-linear-\\[125deg\\] {
      --tw-gradient-position: 125deg;
      background-image: linear-gradient(var(--tw-gradient-stops, 125deg));
    }

    .bg-linear-\\[to_bottom\\] {
      --tw-gradient-position: to bottom;
      background-image: linear-gradient(var(--tw-gradient-stops, to bottom));
    }

    .bg-radial-\\[circle_at_center\\] {
      --tw-gradient-position: circle at center;
      background-image: radial-gradient(var(--tw-gradient-stops, circle at center));
    }

    .bg-radial\\/\\[in_hsl_longer_hue\\] {
      --tw-gradient-position: in hsl longer hue;
      background-image: radial-gradient(var(--tw-gradient-stops));
    }

    .bg-radial\\/decreasing {
      --tw-gradient-position: in oklch decreasing hue;
      background-image: radial-gradient(var(--tw-gradient-stops));
    }

    .bg-radial\\/hsl {
      --tw-gradient-position: in hsl;
      background-image: radial-gradient(var(--tw-gradient-stops));
    }

    .bg-radial\\/increasing {
      --tw-gradient-position: in oklch increasing hue;
      background-image: radial-gradient(var(--tw-gradient-stops));
    }

    .bg-radial\\/longer {
      --tw-gradient-position: in oklch longer hue;
      background-image: radial-gradient(var(--tw-gradient-stops));
    }

    .bg-radial\\/oklab {
      --tw-gradient-position: in oklab;
      background-image: radial-gradient(var(--tw-gradient-stops));
    }

    .bg-radial\\/oklch {
      --tw-gradient-position: in oklch;
      background-image: radial-gradient(var(--tw-gradient-stops));
    }

    .bg-radial\\/shorter {
      --tw-gradient-position: in oklch shorter hue;
      background-image: radial-gradient(var(--tw-gradient-stops));
    }

    .bg-radial\\/srgb {
      --tw-gradient-position: in srgb;
      background-image: radial-gradient(var(--tw-gradient-stops));
    }

    .bg-\\[image\\:var\\(--my-gradient\\)\\] {
      background-image: var(--my-gradient);
    }

    .bg-\\[linear-gradient\\(to_bottom\\,red\\,blue\\)\\] {
      background-image: linear-gradient(red, #00f);
    }

    .bg-\\[url\\(\\/image\\.png\\)\\] {
      background-image: url("/image.png");
    }

    .bg-\\[url\\:var\\(--my-url\\)\\] {
      background-image: var(--my-url);
    }

    .bg-none {
      background-image: none;
    }

    .bg-\\[contain\\] {
      background-size: contain;
    }

    .bg-\\[cover\\] {
      background-size: cover;
    }

    .bg-\\[length\\:120px_120px\\], .bg-\\[size\\:120px_120px\\] {
      background-size: 120px 120px;
    }

    .bg-auto {
      background-size: auto;
    }

    .bg-contain {
      background-size: contain;
    }

    .bg-cover {
      background-size: cover;
    }

    .bg-fixed {
      background-attachment: fixed;
    }

    .bg-local {
      background-attachment: local;
    }

    .bg-scroll {
      background-attachment: scroll;
    }

    .bg-\\[50\\%\\] {
      background-position: 50%;
    }

    .bg-\\[120px\\] {
      background-position: 120px;
    }

    .bg-\\[120px_120px\\], .bg-\\[position\\:120px_120px\\] {
      background-position: 120px 120px;
    }

    .bg-bottom {
      background-position: bottom;
    }

    .bg-bottom-left {
      background-position: 0 100%;
    }

    .bg-bottom-right {
      background-position: 100% 100%;
    }

    .bg-center {
      background-position: center;
    }

    .bg-left {
      background-position: 0;
    }

    .bg-left-bottom {
      background-position: 0 100%;
    }

    .bg-left-top {
      background-position: 0 0;
    }

    .bg-right {
      background-position: 100%;
    }

    .bg-right-bottom {
      background-position: 100% 100%;
    }

    .bg-right-top {
      background-position: 100% 0;
    }

    .bg-top {
      background-position: top;
    }

    .bg-top-left {
      background-position: 0 0;
    }

    .bg-top-right {
      background-position: 100% 0;
    }

    .bg-no-repeat {
      background-repeat: no-repeat;
    }

    .bg-repeat {
      background-repeat: repeat;
    }

    .bg-repeat-round {
      background-repeat: round;
    }

    .bg-repeat-space {
      background-repeat: space;
    }

    .bg-repeat-x {
      background-repeat: repeat-x;
    }

    .bg-repeat-y {
      background-repeat: repeat-y;
    }"
  `)
  expect(
    await run([
      'bg',
      'bg-unknown',

      // background-color
      '-bg-red-500',
      '-bg-red-500/50',
      '-bg-red-500/[0.5]',
      '-bg-red-500/[50%]',
      '-bg-current',
      '-bg-current/50',
      '-bg-current/[0.5]',
      '-bg-current/[50%]',
      '-bg-inherit',
      '-bg-transparent',
      '-bg-[#0088cc]',
      '-bg-[#0088cc]/50',
      '-bg-[#0088cc]/[0.5]',
      '-bg-[#0088cc]/[50%]',

      // background-image
      '-bg-none',
      '-bg-gradient-to-br',
      '-bg-linear-to-br',
      '-bg-linear-[to_bottom]',

      // background-size
      '-bg-auto',
      '-bg-cover',
      '-bg-contain',

      // background-attachment
      '-bg-fixed',
      '-bg-local',
      '-bg-scroll',

      // background-position
      '-bg-center',
      '-bg-top',
      '-bg-right-top',
      '-bg-right-bottom',
      '-bg-bottom',
      '-bg-left-bottom',
      '-bg-left',
      '-bg-left-top',

      // background-repeat
      '-bg-repeat',
      '-bg-no-repeat',
      '-bg-repeat-x',
      '-bg-repeat-y',
      '-bg-round',
      '-bg-space',

      'bg-none/foo',
      'bg-[url(/image.png)]/foo',
      'bg-[url:var(--my-url)]/foo',
      'bg-[linear-gradient(to_bottom,red,blue)]/foo',
      'bg-[image:var(--my-gradient)]/foo',
      'bg-linear-[to_bottom]/hsl',
      'bg-conic-[45deg]/hsl',
      'bg-conic-[circle_at_center]/hsl',
      'bg-auto/foo',
      'bg-cover/foo',
      'bg-contain/foo',
      'bg-[cover]/foo',
      'bg-[contain]/foo',
      'bg-[size:120px_120px]/foo',
      'bg-fixed/foo',
      'bg-local/foo',
      'bg-scroll/foo',
      'bg-center/foo',
      'bg-top/foo',
      'bg-right-top/foo',
      'bg-right-bottom/foo',
      'bg-bottom/foo',
      'bg-left-bottom/foo',
      'bg-left/foo',
      'bg-left-top/foo',
      'bg-[50%]/foo',
      'bg-[120px]/foo',
      'bg-[120px_120px]/foo',
      'bg-[length:120px_120px]/foo',
      'bg-[position:120px_120px]/foo',
      'bg-[size:120px_120px]/foo',
      'bg-repeat/foo',
      'bg-no-repeat/foo',
      'bg-repeat-x/foo',
      'bg-repeat-y/foo',
      'bg-round/foo',
      'bg-space/foo',
    ]),
  ).toEqual('')

  expect(
    await compileCss(
      css`
        @theme reference {
          --opacity-half: 0.5;
          --opacity-custom: var(--custom-opacity);
        }
        @tailwind utilities;
      `,
      ['bg-current/half', 'bg-current/custom', '[color:red]/half'],
    ),
  ).toMatchInlineSnapshot(`
    ".bg-current\\/custom {
      background-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-current\\/custom {
        background-color: color-mix(in oklab, currentcolor var(--opacity-custom, var(--custom-opacity)), transparent);
      }
    }

    .bg-current\\/half {
      background-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .bg-current\\/half {
        background-color: color-mix(in oklab, currentcolor var(--opacity-half, .5), transparent);
      }
    }

    .\\[color\\:red\\]\\/half {
      color: color-mix(in srgb, red .5, transparent);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .\\[color\\:red\\]\\/half {
        color: color-mix(in oklab, red var(--opacity-half, .5), transparent);
      }
    }"
  `)
})

test('bg-position', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      ['bg-position-[120px]', 'bg-position-[120px_120px]', 'bg-position-[var(--some-var)]'],
    ),
  ).toMatchInlineSnapshot(`
    ".bg-position-\\[120px\\] {
      background-position: 120px;
    }

    .bg-position-\\[120px_120px\\] {
      background-position: 120px 120px;
    }

    .bg-position-\\[var\\(--some-var\\)\\] {
      background-position: var(--some-var);
    }"
  `)
  expect(
    await run([
      'bg-position',
      'bg-position/foo',
      '-bg-position',
      '-bg-position/foo',

      'bg-position-[120px_120px]/foo',

      '-bg-position-[120px_120px]',
      '-bg-position-[120px_120px]/foo',
    ]),
  ).toEqual('')
})

test('bg-size', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      ['bg-size-[120px]', 'bg-size-[120px_120px]', 'bg-size-[var(--some-var)]'],
    ),
  ).toMatchInlineSnapshot(`
    ".bg-size-\\[120px\\] {
      background-size: 120px;
    }

    .bg-size-\\[120px_120px\\] {
      background-size: 120px 120px;
    }

    .bg-size-\\[var\\(--some-var\\)\\] {
      background-size: var(--some-var);
    }"
  `)
  expect(
    await run([
      'bg-size',
      'bg-size/foo',
      '-bg-size',
      '-bg-size/foo',

      'bg-size-[120px_120px]/foo',

      '-bg-size-[120px_120px]',
      '-bg-size-[120px_120px]/foo',
    ]),
  ).toEqual('')
})

test('from', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        // --tw-gradient-from
        'from-red-500',
        'from-red-500/50',
        'from-red-500/[0.5]',
        'from-red-500/[50%]',
        'from-current',
        'from-current/50',
        'from-current/[0.5]',
        'from-current/[50%]',
        'from-inherit',
        'from-transparent',
        'from-[#0088cc]',
        'from-[#0088cc]/50',
        'from-[#0088cc]/[0.5]',
        'from-[#0088cc]/[50%]',
        'from-[var(--my-color)]',
        'from-[var(--my-color)]/50',
        'from-[var(--my-color)]/[0.5]',
        'from-[var(--my-color)]/[50%]',
        'from-[color:var(--my-color)]',
        'from-[color:var(--my-color)]/50',
        'from-[color:var(--my-color)]/[0.5]',
        'from-[color:var(--my-color)]/[50%]',

        // --tw-gradient-from-position
        'from-0%',
        'from-5%',
        'from-100%',
        'from-[50%]',
        'from-[50px]',
        'from-[length:var(--my-position)]',
        'from-[percentage:var(--my-position)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-gradient-position: initial;
          --tw-gradient-from: #0000;
          --tw-gradient-via: #0000;
          --tw-gradient-to: #0000;
          --tw-gradient-stops: initial;
          --tw-gradient-via-stops: initial;
          --tw-gradient-from-position: 0%;
          --tw-gradient-via-position: 50%;
          --tw-gradient-to-position: 100%;
        }
      }
    }

    :root, :host {
      --color-red-500: #ef4444;
    }

    .from-\\[\\#0088cc\\] {
      --tw-gradient-from: #08c;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-\\[\\#0088cc\\]\\/50, .from-\\[\\#0088cc\\]\\/\\[0\\.5\\], .from-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-gradient-from: oklab(59.9824% -.067 -.124 / .5);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-\\[color\\:var\\(--my-color\\)\\], .from-\\[color\\:var\\(--my-color\\)\\]\\/50 {
      --tw-gradient-from: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .from-\\[color\\:var\\(--my-color\\)\\]\\/50 {
        --tw-gradient-from: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .from-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      --tw-gradient-from: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .from-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        --tw-gradient-from: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .from-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      --tw-gradient-from: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .from-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        --tw-gradient-from: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .from-\\[var\\(--my-color\\)\\], .from-\\[var\\(--my-color\\)\\]\\/50 {
      --tw-gradient-from: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .from-\\[var\\(--my-color\\)\\]\\/50 {
        --tw-gradient-from: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .from-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      --tw-gradient-from: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .from-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        --tw-gradient-from: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .from-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      --tw-gradient-from: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .from-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        --tw-gradient-from: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .from-current, .from-current\\/50 {
      --tw-gradient-from: currentcolor;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .from-current\\/50 {
        --tw-gradient-from: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .from-current\\/\\[0\\.5\\] {
      --tw-gradient-from: currentcolor;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .from-current\\/\\[0\\.5\\] {
        --tw-gradient-from: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .from-current\\/\\[50\\%\\] {
      --tw-gradient-from: currentcolor;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .from-current\\/\\[50\\%\\] {
        --tw-gradient-from: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .from-inherit {
      --tw-gradient-from: inherit;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-red-500 {
      --tw-gradient-from: var(--color-red-500);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-red-500\\/50 {
      --tw-gradient-from: #ef444480;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .from-red-500\\/50 {
        --tw-gradient-from: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .from-red-500\\/\\[0\\.5\\] {
      --tw-gradient-from: #ef444480;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .from-red-500\\/\\[0\\.5\\] {
        --tw-gradient-from: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .from-red-500\\/\\[50\\%\\] {
      --tw-gradient-from: #ef444480;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .from-red-500\\/\\[50\\%\\] {
        --tw-gradient-from: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .from-transparent {
      --tw-gradient-from: transparent;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-0\\% {
      --tw-gradient-from-position: 0%;
    }

    .from-5\\% {
      --tw-gradient-from-position: 5%;
    }

    .from-100\\% {
      --tw-gradient-from-position: 100%;
    }

    .from-\\[50\\%\\] {
      --tw-gradient-from-position: 50%;
    }

    .from-\\[50px\\] {
      --tw-gradient-from-position: 50px;
    }

    .from-\\[length\\:var\\(--my-position\\)\\], .from-\\[percentage\\:var\\(--my-position\\)\\] {
      --tw-gradient-from-position: var(--my-position);
    }

    @property --tw-gradient-position {
      syntax: "*";
      inherits: false
    }

    @property --tw-gradient-from {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-via {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-to {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-stops {
      syntax: "*";
      inherits: false
    }

    @property --tw-gradient-via-stops {
      syntax: "*";
      inherits: false
    }

    @property --tw-gradient-from-position {
      syntax: "<length-percentage>";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-gradient-via-position {
      syntax: "<length-percentage>";
      inherits: false;
      initial-value: 50%;
    }

    @property --tw-gradient-to-position {
      syntax: "<length-percentage>";
      inherits: false;
      initial-value: 100%;
    }"
  `)
  expect(
    await run([
      'from',
      'from-25.%',
      'from-25.0%',
      'from-123',
      'from--123',
      'from--5%',
      'from-unknown',
      'from-unknown%',

      // --tw-gradient-from
      '-from-red-500',
      '-from-red-500/50',
      '-from-red-500/[0.5]',
      '-from-red-500/[50%]',
      '-from-current',
      '-from-current/50',
      '-from-current/[0.5]',
      '-from-current/[50%]',
      '-from-inherit',
      '-from-transparent',
      '-from-[#0088cc]',
      '-from-[#0088cc]/50',
      '-from-[#0088cc]/[0.5]',
      '-from-[#0088cc]/[50%]',

      // --tw-gradient-from-position
      '-from-0%',
      '-from-5%',
      '-from-100%',
    ]),
  ).toEqual('')
})

test('via', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        // --tw-gradient-stops
        'via-red-500',
        'via-red-500/50',
        'via-red-500/[0.5]',
        'via-red-500/[50%]',
        'via-current',
        'via-current/50',
        'via-current/[0.5]',
        'via-current/[50%]',
        'via-inherit',
        'via-transparent',
        'via-[#0088cc]',
        'via-[#0088cc]/50',
        'via-[#0088cc]/[0.5]',
        'via-[#0088cc]/[50%]',
        'via-[var(--my-color)]',
        'via-[var(--my-color)]/50',
        'via-[var(--my-color)]/[0.5]',
        'via-[var(--my-color)]/[50%]',
        'via-[color:var(--my-color)]',
        'via-[color:var(--my-color)]/50',
        'via-[color:var(--my-color)]/[0.5]',
        'via-[color:var(--my-color)]/[50%]',

        // --tw-gradient-via-position
        'via-0%',
        'via-5%',
        'via-100%',
        'via-[50%]',
        'via-[50px]',
        'via-[length:var(--my-position)]',
        'via-[percentage:var(--my-position)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-gradient-position: initial;
          --tw-gradient-from: #0000;
          --tw-gradient-via: #0000;
          --tw-gradient-to: #0000;
          --tw-gradient-stops: initial;
          --tw-gradient-via-stops: initial;
          --tw-gradient-from-position: 0%;
          --tw-gradient-via-position: 50%;
          --tw-gradient-to-position: 100%;
        }
      }
    }

    :root, :host {
      --color-red-500: #ef4444;
    }

    .via-\\[\\#0088cc\\] {
      --tw-gradient-via: #08c;
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-\\[\\#0088cc\\]\\/50, .via-\\[\\#0088cc\\]\\/\\[0\\.5\\], .via-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-gradient-via: oklab(59.9824% -.067 -.124 / .5);
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-\\[color\\:var\\(--my-color\\)\\], .via-\\[color\\:var\\(--my-color\\)\\]\\/50 {
      --tw-gradient-via: var(--my-color);
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .via-\\[color\\:var\\(--my-color\\)\\]\\/50 {
        --tw-gradient-via: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .via-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      --tw-gradient-via: var(--my-color);
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .via-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        --tw-gradient-via: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .via-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      --tw-gradient-via: var(--my-color);
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .via-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        --tw-gradient-via: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .via-\\[var\\(--my-color\\)\\], .via-\\[var\\(--my-color\\)\\]\\/50 {
      --tw-gradient-via: var(--my-color);
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .via-\\[var\\(--my-color\\)\\]\\/50 {
        --tw-gradient-via: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .via-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      --tw-gradient-via: var(--my-color);
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .via-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        --tw-gradient-via: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .via-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      --tw-gradient-via: var(--my-color);
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .via-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        --tw-gradient-via: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .via-current, .via-current\\/50 {
      --tw-gradient-via: currentcolor;
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .via-current\\/50 {
        --tw-gradient-via: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .via-current\\/\\[0\\.5\\] {
      --tw-gradient-via: currentcolor;
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .via-current\\/\\[0\\.5\\] {
        --tw-gradient-via: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .via-current\\/\\[50\\%\\] {
      --tw-gradient-via: currentcolor;
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .via-current\\/\\[50\\%\\] {
        --tw-gradient-via: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .via-inherit {
      --tw-gradient-via: inherit;
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-red-500 {
      --tw-gradient-via: var(--color-red-500);
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-red-500\\/50 {
      --tw-gradient-via: #ef444480;
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .via-red-500\\/50 {
        --tw-gradient-via: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .via-red-500\\/\\[0\\.5\\] {
      --tw-gradient-via: #ef444480;
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .via-red-500\\/\\[0\\.5\\] {
        --tw-gradient-via: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .via-red-500\\/\\[50\\%\\] {
      --tw-gradient-via: #ef444480;
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .via-red-500\\/\\[50\\%\\] {
        --tw-gradient-via: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .via-transparent {
      --tw-gradient-via: transparent;
      --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-0\\% {
      --tw-gradient-via-position: 0%;
    }

    .via-5\\% {
      --tw-gradient-via-position: 5%;
    }

    .via-100\\% {
      --tw-gradient-via-position: 100%;
    }

    .via-\\[50\\%\\] {
      --tw-gradient-via-position: 50%;
    }

    .via-\\[50px\\] {
      --tw-gradient-via-position: 50px;
    }

    .via-\\[length\\:var\\(--my-position\\)\\], .via-\\[percentage\\:var\\(--my-position\\)\\] {
      --tw-gradient-via-position: var(--my-position);
    }

    @property --tw-gradient-position {
      syntax: "*";
      inherits: false
    }

    @property --tw-gradient-from {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-via {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-to {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-stops {
      syntax: "*";
      inherits: false
    }

    @property --tw-gradient-via-stops {
      syntax: "*";
      inherits: false
    }

    @property --tw-gradient-from-position {
      syntax: "<length-percentage>";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-gradient-via-position {
      syntax: "<length-percentage>";
      inherits: false;
      initial-value: 50%;
    }

    @property --tw-gradient-to-position {
      syntax: "<length-percentage>";
      inherits: false;
      initial-value: 100%;
    }"
  `)
  expect(
    await run([
      'via',
      'via-123',
      'via--123',
      'via--5%',
      'via-unknown',
      'via-unknown%',

      // --tw-gradient-stops
      '-via-red-500',
      '-via-red-500/50',
      '-via-red-500/[0.5]',
      '-via-red-500/[50%]',
      '-via-current',
      '-via-current/50',
      '-via-current/[0.5]',
      '-via-current/[50%]',
      '-via-inherit',
      '-via-transparent',
      '-via-[#0088cc]',
      '-via-[#0088cc]/50',
      '-via-[#0088cc]/[0.5]',
      '-via-[#0088cc]/[50%]',

      // --tw-gradient-via-position
      '-via-0%',
      '-via-5%',
      '-via-100%',
    ]),
  ).toEqual('')
})

test('to', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        // --tw-gradient-to
        'to-red-500',
        'to-red-500/50',
        'to-red-500/[0.5]',
        'to-red-500/[50%]',
        'to-current',
        'to-current/50',
        'to-current/[0.5]',
        'to-current/[50%]',
        'to-inherit',
        'to-transparent',
        'to-[#0088cc]',
        'to-[#0088cc]/50',
        'to-[#0088cc]/[0.5]',
        'to-[#0088cc]/[50%]',
        'to-[var(--my-color)]',
        'to-[var(--my-color)]/50',
        'to-[var(--my-color)]/[0.5]',
        'to-[var(--my-color)]/[50%]',
        'to-[color:var(--my-color)]',
        'to-[color:var(--my-color)]/50',
        'to-[color:var(--my-color)]/[0.5]',
        'to-[color:var(--my-color)]/[50%]',

        // --tw-gradient-to-position
        'to-0%',
        'to-5%',
        'to-100%',
        'to-[50%]',
        'to-[50px]',
        'to-[length:var(--my-position)]',
        'to-[percentage:var(--my-position)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-gradient-position: initial;
          --tw-gradient-from: #0000;
          --tw-gradient-via: #0000;
          --tw-gradient-to: #0000;
          --tw-gradient-stops: initial;
          --tw-gradient-via-stops: initial;
          --tw-gradient-from-position: 0%;
          --tw-gradient-via-position: 50%;
          --tw-gradient-to-position: 100%;
        }
      }
    }

    :root, :host {
      --color-red-500: #ef4444;
    }

    .to-\\[\\#0088cc\\] {
      --tw-gradient-to: #08c;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-\\[\\#0088cc\\]\\/50, .to-\\[\\#0088cc\\]\\/\\[0\\.5\\], .to-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-gradient-to: oklab(59.9824% -.067 -.124 / .5);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-\\[color\\:var\\(--my-color\\)\\], .to-\\[color\\:var\\(--my-color\\)\\]\\/50 {
      --tw-gradient-to: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .to-\\[color\\:var\\(--my-color\\)\\]\\/50 {
        --tw-gradient-to: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .to-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      --tw-gradient-to: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .to-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        --tw-gradient-to: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .to-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      --tw-gradient-to: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .to-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        --tw-gradient-to: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .to-\\[var\\(--my-color\\)\\], .to-\\[var\\(--my-color\\)\\]\\/50 {
      --tw-gradient-to: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .to-\\[var\\(--my-color\\)\\]\\/50 {
        --tw-gradient-to: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .to-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      --tw-gradient-to: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .to-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        --tw-gradient-to: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .to-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      --tw-gradient-to: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .to-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        --tw-gradient-to: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .to-current, .to-current\\/50 {
      --tw-gradient-to: currentcolor;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .to-current\\/50 {
        --tw-gradient-to: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .to-current\\/\\[0\\.5\\] {
      --tw-gradient-to: currentcolor;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .to-current\\/\\[0\\.5\\] {
        --tw-gradient-to: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .to-current\\/\\[50\\%\\] {
      --tw-gradient-to: currentcolor;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .to-current\\/\\[50\\%\\] {
        --tw-gradient-to: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .to-inherit {
      --tw-gradient-to: inherit;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-red-500 {
      --tw-gradient-to: var(--color-red-500);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-red-500\\/50 {
      --tw-gradient-to: #ef444480;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .to-red-500\\/50 {
        --tw-gradient-to: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .to-red-500\\/\\[0\\.5\\] {
      --tw-gradient-to: #ef444480;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .to-red-500\\/\\[0\\.5\\] {
        --tw-gradient-to: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .to-red-500\\/\\[50\\%\\] {
      --tw-gradient-to: #ef444480;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    @supports (color: color-mix(in lab, red, red)) {
      .to-red-500\\/\\[50\\%\\] {
        --tw-gradient-to: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .to-transparent {
      --tw-gradient-to: transparent;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-0\\% {
      --tw-gradient-to-position: 0%;
    }

    .to-5\\% {
      --tw-gradient-to-position: 5%;
    }

    .to-100\\% {
      --tw-gradient-to-position: 100%;
    }

    .to-\\[50\\%\\] {
      --tw-gradient-to-position: 50%;
    }

    .to-\\[50px\\] {
      --tw-gradient-to-position: 50px;
    }

    .to-\\[length\\:var\\(--my-position\\)\\], .to-\\[percentage\\:var\\(--my-position\\)\\] {
      --tw-gradient-to-position: var(--my-position);
    }

    @property --tw-gradient-position {
      syntax: "*";
      inherits: false
    }

    @property --tw-gradient-from {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-via {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-to {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-stops {
      syntax: "*";
      inherits: false
    }

    @property --tw-gradient-via-stops {
      syntax: "*";
      inherits: false
    }

    @property --tw-gradient-from-position {
      syntax: "<length-percentage>";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-gradient-via-position {
      syntax: "<length-percentage>";
      inherits: false;
      initial-value: 50%;
    }

    @property --tw-gradient-to-position {
      syntax: "<length-percentage>";
      inherits: false;
      initial-value: 100%;
    }"
  `)
  expect(
    await run([
      'to',
      'to-123',
      'to--123',
      'to--5%',
      'to-unknown',
      'to-unknown%',

      // --tw-gradient-to
      '-to-red-500',
      '-to-red-500/50',
      '-to-red-500/[0.5]',
      '-to-red-500/[50%]',
      '-to-current',
      '-to-current/50',
      '-to-current/[0.5]',
      '-to-current/[50%]',
      '-to-inherit',
      '-to-transparent',
      '-to-[#0088cc]',
      '-to-[#0088cc]/50',
      '-to-[#0088cc]/[0.5]',
      '-to-[#0088cc]/[50%]',

      // --tw-gradient-to-position
      '-to-0%',
      '-to-5%',
      '-to-100%',
    ]),
  ).toEqual('')
})

test('mask', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        // mask-image
        'mask-none',
        'mask-[linear-gradient(#ffff,#0000)]',
        'mask-[url(http://example.com)]',
        'mask-[var(--some-var)]',
        'mask-[image:var(--some-var)]',
        'mask-[url:var(--some-var)]',

        // mask-composite
        'mask-add',
        'mask-subtract',
        'mask-intersect',
        'mask-exclude',

        // mask-mode
        'mask-alpha',
        'mask-luminance',
        'mask-match',

        // mask-type
        'mask-type-alpha',
        'mask-type-luminance',

        // mask-size
        'mask-auto',
        'mask-cover',
        'mask-contain',
        'mask-[cover]',
        'mask-[contain]',
        'mask-[size:120px_120px]',

        // mask-position
        'mask-center',
        'mask-top',
        'mask-top-right',
        'mask-top-left',
        'mask-bottom',
        'mask-bottom-right',
        'mask-bottom-left',
        'mask-left',
        'mask-right',
        'mask-center',
        'mask-[50%]',
        'mask-[120px]',
        'mask-[120px_120px]',
        'mask-[length:120px_120px]',
        'mask-[position:120px_120px]',

        // mask-repeat
        'mask-repeat',
        'mask-no-repeat',
        'mask-repeat-x',
        'mask-repeat-y',
        'mask-repeat-round',
        'mask-repeat-space',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ".mask-\\[image\\:var\\(--some-var\\)\\] {
      -webkit-mask-image: var(--some-var);
      -webkit-mask-image: var(--some-var);
      mask-image: var(--some-var);
    }

    .mask-\\[linear-gradient\\(\\#ffff\\,\\#0000\\)\\] {
      -webkit-mask-image: linear-gradient(#fff, #0000);
      mask-image: linear-gradient(#fff, #0000);
    }

    .mask-\\[url\\(http\\:\\/\\/example\\.com\\)\\] {
      -webkit-mask-image: url("http://example.com");
      mask-image: url("http://example.com");
    }

    .mask-\\[url\\:var\\(--some-var\\)\\], .mask-\\[var\\(--some-var\\)\\] {
      -webkit-mask-image: var(--some-var);
      -webkit-mask-image: var(--some-var);
      mask-image: var(--some-var);
    }

    .mask-none {
      -webkit-mask-image: none;
      mask-image: none;
    }

    .mask-add {
      -webkit-mask-composite: source-over;
      -webkit-mask-composite: source-over;
      mask-composite: add;
    }

    .mask-exclude {
      -webkit-mask-composite: xor;
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }

    .mask-intersect {
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-subtract {
      -webkit-mask-composite: source-out;
      -webkit-mask-composite: source-out;
      mask-composite: subtract;
    }

    .mask-alpha {
      -webkit-mask-source-type: alpha;
      -webkit-mask-source-type: alpha;
      mask-mode: alpha;
    }

    .mask-luminance {
      -webkit-mask-source-type: luminance;
      -webkit-mask-source-type: luminance;
      mask-mode: luminance;
    }

    .mask-match {
      -webkit-mask-source-type: auto;
      -webkit-mask-source-type: auto;
      mask-mode: match-source;
    }

    .mask-type-alpha {
      mask-type: alpha;
    }

    .mask-type-luminance {
      mask-type: luminance;
    }

    .mask-\\[contain\\] {
      -webkit-mask-size: contain;
      mask-size: contain;
    }

    .mask-\\[cover\\] {
      -webkit-mask-size: cover;
      mask-size: cover;
    }

    .mask-\\[length\\:120px_120px\\], .mask-\\[size\\:120px_120px\\] {
      -webkit-mask-size: 120px 120px;
      mask-size: 120px 120px;
    }

    .mask-auto {
      -webkit-mask-size: auto;
      mask-size: auto;
    }

    .mask-contain {
      -webkit-mask-size: contain;
      mask-size: contain;
    }

    .mask-cover {
      -webkit-mask-size: cover;
      mask-size: cover;
    }

    .mask-\\[50\\%\\] {
      -webkit-mask-position: 50%;
      mask-position: 50%;
    }

    .mask-\\[120px\\] {
      -webkit-mask-position: 120px;
      mask-position: 120px;
    }

    .mask-\\[120px_120px\\], .mask-\\[position\\:120px_120px\\] {
      -webkit-mask-position: 120px 120px;
      mask-position: 120px 120px;
    }

    .mask-bottom {
      -webkit-mask-position: bottom;
      mask-position: bottom;
    }

    .mask-bottom-left {
      -webkit-mask-position: 0 100%;
      mask-position: 0 100%;
    }

    .mask-bottom-right {
      -webkit-mask-position: 100% 100%;
      mask-position: 100% 100%;
    }

    .mask-center {
      -webkit-mask-position: center;
      mask-position: center;
    }

    .mask-left {
      -webkit-mask-position: 0;
      mask-position: 0;
    }

    .mask-right {
      -webkit-mask-position: 100%;
      mask-position: 100%;
    }

    .mask-top {
      -webkit-mask-position: top;
      mask-position: top;
    }

    .mask-top-left {
      -webkit-mask-position: 0 0;
      mask-position: 0 0;
    }

    .mask-top-right {
      -webkit-mask-position: 100% 0;
      mask-position: 100% 0;
    }

    .mask-no-repeat {
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
    }

    .mask-repeat {
      -webkit-mask-repeat: repeat;
      mask-repeat: repeat;
    }

    .mask-repeat-round {
      -webkit-mask-repeat: round;
      mask-repeat: round;
    }

    .mask-repeat-space {
      -webkit-mask-repeat: space;
      mask-repeat: space;
    }

    .mask-repeat-x {
      -webkit-mask-repeat: repeat-x;
      mask-repeat: repeat-x;
    }

    .mask-repeat-y {
      -webkit-mask-repeat: repeat-y;
      mask-repeat: repeat-y;
    }"
  `)
  expect(
    await run([
      'mask',
      'mask-unknown',

      // mask-image
      '-mask-none',
      'mask-none/foo',
      '-mask-[var(--some-var)]',
      'mask-[var(--some-var)]/foo',
      '-mask-[image:var(--some-var)]',
      'mask-[image:var(--some-var)]/foo',
      '-mask-[url:var(--some-var)]',
      'mask-[url:var(--some-var)]/foo',

      // mask-composite
      '-mask-add',
      '-mask-subtract',
      '-mask-intersect',
      '-mask-exclude',
      'mask-add/foo',
      'mask-subtract/foo',
      'mask-intersect/foo',
      'mask-exclude/foo',

      // mask-mode
      '-mask-alpha',
      '-mask-luminance',
      '-mask-match',
      'mask-alpha/foo',
      'mask-luminance/foo',
      'mask-match/foo',

      // mask-type
      '-mask-type-alpha',
      '-mask-type-luminance',
      'mask-type-alpha/foo',
      'mask-type-luminance/foo',

      // mask-size
      '-mask-auto',
      '-mask-cover',
      '-mask-contain',
      '-mask-auto/foo',
      '-mask-cover/foo',
      '-mask-contain/foo',

      // mask-position
      '-mask-center',
      '-mask-top',
      '-mask-right-top',
      '-mask-right-bottom',
      '-mask-bottom',
      '-mask-left-bottom',
      '-mask-left',
      '-mask-left-top',
      '-mask-center/foo',
      '-mask-top/foo',
      '-mask-right-top/foo',
      '-mask-right-bottom/foo',
      '-mask-bottom/foo',
      '-mask-left-bottom/foo',
      '-mask-left/foo',
      '-mask-left-top/foo',

      // mask-repeat
      'mask-repeat/foo',
      'mask-no-repeat/foo',
      'mask-repeat-x/foo',
      'mask-repeat-y/foo',
      'mask-round/foo',
      'mask-space/foo',
      '-mask-repeat',
      '-mask-no-repeat',
      '-mask-repeat-x',
      '-mask-repeat-y',
      '-mask-round',
      '-mask-space',
      '-mask-repeat/foo',
      '-mask-no-repeat/foo',
      '-mask-repeat-x/foo',
      '-mask-repeat-y/foo',
      '-mask-round/foo',
      '-mask-space/foo',
    ]),
  ).toEqual('')

  expect(
    await compileCss(
      css`
        @theme reference {
          --opacity-half: 0.5;
          --opacity-custom: var(--custom-opacity);
        }
        @tailwind utilities;
      `,
      ['mask-current/half', 'mask-current/custom', '[color:red]/half'],
    ),
  ).toMatchInlineSnapshot(`
    ".\\[color\\:red\\]\\/half {
      color: color-mix(in srgb, red .5, transparent);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .\\[color\\:red\\]\\/half {
        color: color-mix(in oklab, red var(--opacity-half, .5), transparent);
      }
    }"
  `)
})

test('mask-position', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      ['mask-position-[120px]', 'mask-position-[120px_120px]', 'mask-position-[var(--some-var)]'],
    ),
  ).toMatchInlineSnapshot(`
    ".mask-position-\\[120px\\] {
      -webkit-mask-position: 120px;
      mask-position: 120px;
    }

    .mask-position-\\[120px_120px\\] {
      -webkit-mask-position: 120px 120px;
      mask-position: 120px 120px;
    }

    .mask-position-\\[var\\(--some-var\\)\\] {
      -webkit-mask-position: var(--some-var);
      -webkit-mask-position: var(--some-var);
      mask-position: var(--some-var);
    }"
  `)
  expect(
    await run([
      'mask-position',
      'mask-position/foo',
      '-mask-position',
      '-mask-position/foo',

      'mask-position-[120px_120px]/foo',

      '-mask-position-[120px_120px]',
      '-mask-position-[120px_120px]/foo',
    ]),
  ).toEqual('')
})

test('mask-size', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      ['mask-size-[120px]', 'mask-size-[120px_120px]', 'mask-size-[var(--some-var)]'],
    ),
  ).toMatchInlineSnapshot(`
    ".mask-size-\\[120px\\] {
      -webkit-mask-size: 120px;
      mask-size: 120px;
    }

    .mask-size-\\[120px_120px\\] {
      -webkit-mask-size: 120px 120px;
      mask-size: 120px 120px;
    }

    .mask-size-\\[var\\(--some-var\\)\\] {
      -webkit-mask-size: var(--some-var);
      -webkit-mask-size: var(--some-var);
      mask-size: var(--some-var);
    }"
  `)
  expect(
    await run([
      'mask-size',
      'mask-size/foo',
      '-mask-size',
      '-mask-size/foo',

      'mask-size-[120px_120px]/foo',

      '-mask-size-[120px_120px]',
      '-mask-size-[120px_120px]/foo',
    ]),
  ).toEqual('')
})

test('mask-t-from', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-t-from-0',
        'mask-t-from-1.5',
        'mask-t-from-2',
        'mask-t-from-0%',
        'mask-t-from-2%',
        'mask-t-from-[0px]',
        'mask-t-from-[0%]',
        'mask-t-from-(--my-var)',
        'mask-t-from-(color:--my-var)',
        'mask-t-from-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-left: linear-gradient(#fff, #fff);
          --tw-mask-right: linear-gradient(#fff, #fff);
          --tw-mask-bottom: linear-gradient(#fff, #fff);
          --tw-mask-top: linear-gradient(#fff, #fff);
          --tw-mask-top-from-position: 0%;
          --tw-mask-top-to-position: 100%;
          --tw-mask-top-from-color: black;
          --tw-mask-top-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-t-from-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-from-\\(--my-var\\), .mask-t-from-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-from-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-from-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-from-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-from-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-from-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-from-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-from-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-top-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-top-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-top-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-t-from',
        'mask-t-from-2.8175',
        'mask-t-from--1.5',
        'mask-t-from--2',

        'mask-t-from-2.5%',
        'mask-t-from--5%',
        'mask-t-from-unknown',
        'mask-t-from-unknown%',

        '-mask-t-from-0',
        '-mask-t-from-1.5',
        '-mask-t-from-2',
        '-mask-t-from-0%',
        '-mask-t-from-2%',
        '-mask-t-from-[0px]',
        '-mask-t-from-[0%]',

        '-mask-t-from-(--my-var)',
        '-mask-t-from-(color:--my-var)',
        '-mask-t-from-(length:--my-var)',

        'mask-l-from-[-25%]',
        'mask-l-from-[25%]/foo',
        'mask-l-from-[-25%]/foo',
        '-mask-l-from-[-25%]',
        '-mask-l-from-[25%]/foo',
        '-mask-l-from-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-t-to', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-t-to-0',
        'mask-t-to-1.5',
        'mask-t-to-2',
        'mask-t-to-0%',
        'mask-t-to-2%',
        'mask-t-to-[0px]',
        'mask-t-to-[0%]',
        'mask-t-to-(--my-var)',
        'mask-t-to-(color:--my-var)',
        'mask-t-to-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-left: linear-gradient(#fff, #fff);
          --tw-mask-right: linear-gradient(#fff, #fff);
          --tw-mask-bottom: linear-gradient(#fff, #fff);
          --tw-mask-top: linear-gradient(#fff, #fff);
          --tw-mask-top-from-position: 0%;
          --tw-mask-top-to-position: 100%;
          --tw-mask-top-from-color: black;
          --tw-mask-top-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-t-to-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-to-\\(--my-var\\), .mask-t-to-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-to-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-to-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-to-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-to-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-to-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-to-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-t-to-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-top-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-top-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-top-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-t-to',
        'mask-t-to-2.8175',
        'mask-t-to--1.5',
        'mask-t-to--2',

        'mask-t-to-2.5%',
        'mask-t-to--5%',
        'mask-t-to-unknown',
        'mask-t-to-unknown%',

        '-mask-t-to-0',
        '-mask-t-to-1.5',
        '-mask-t-to-2',
        '-mask-t-to-0%',
        '-mask-t-to-2%',
        '-mask-t-to-[0px]',
        '-mask-t-to-[0%]',

        '-mask-t-to-(--my-var)',
        '-mask-t-to-(color:--my-var)',
        '-mask-t-to-(length:--my-var)',

        'mask-l-from-[-25%]',
        'mask-l-from-[25%]/foo',
        'mask-l-from-[-25%]/foo',
        '-mask-l-from-[-25%]',
        '-mask-l-from-[25%]/foo',
        '-mask-l-from-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-r-from', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-r-from-0',
        'mask-r-from-1.5',
        'mask-r-from-2',
        'mask-r-from-0%',
        'mask-r-from-2%',
        'mask-r-from-[0px]',
        'mask-r-from-[0%]',

        'mask-r-from-(--my-var)',
        'mask-r-from-(color:--my-var)',
        'mask-r-from-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-left: linear-gradient(#fff, #fff);
          --tw-mask-right: linear-gradient(#fff, #fff);
          --tw-mask-bottom: linear-gradient(#fff, #fff);
          --tw-mask-top: linear-gradient(#fff, #fff);
          --tw-mask-right-from-position: 0%;
          --tw-mask-right-to-position: 100%;
          --tw-mask-right-from-color: black;
          --tw-mask-right-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-r-from-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-from-\\(--my-var\\), .mask-r-from-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-from-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-from-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-from-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-from-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-from-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-from-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-from-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-right-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-right-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-right-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-r-from',
        'mask-r-from-2.8175',
        'mask-r-from--1.5',
        'mask-r-from--2',

        'mask-r-from-2.5%',
        'mask-r-from--5%',
        'mask-r-from-unknown',
        'mask-r-from-unknown%',

        '-mask-r-from-0',
        '-mask-r-from-1.5',
        '-mask-r-from-2',
        '-mask-r-from-0%',
        '-mask-r-from-2%',
        '-mask-r-from-[0px]',
        '-mask-r-from-[0%]',

        '-mask-r-from-(--my-var)',
        '-mask-r-from-(color:--my-var)',
        '-mask-r-from-(length:--my-var)',

        'mask-r-from-[-25%]',
        'mask-r-from-[25%]/foo',
        'mask-r-from-[-25%]/foo',
        '-mask-r-from-[-25%]',
        '-mask-r-from-[25%]/foo',
        '-mask-r-from-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-r-to', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-r-to-0',
        'mask-r-to-1.5',
        'mask-r-to-2',
        'mask-r-to-0%',
        'mask-r-to-2%',
        'mask-r-to-[0px]',
        'mask-r-to-[0%]',

        'mask-r-to-(--my-var)',
        'mask-r-to-(color:--my-var)',
        'mask-r-to-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-left: linear-gradient(#fff, #fff);
          --tw-mask-right: linear-gradient(#fff, #fff);
          --tw-mask-bottom: linear-gradient(#fff, #fff);
          --tw-mask-top: linear-gradient(#fff, #fff);
          --tw-mask-right-from-position: 0%;
          --tw-mask-right-to-position: 100%;
          --tw-mask-right-from-color: black;
          --tw-mask-right-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-r-to-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-to-\\(--my-var\\), .mask-r-to-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-to-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-to-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-to-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-to-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-to-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-to-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-r-to-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-right-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-right-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-right-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-r-to',
        'mask-r-to-2.8175',
        'mask-r-to--1.5',
        'mask-r-to--2',

        'mask-r-to-2.5%',
        'mask-r-to--5%',
        'mask-r-to-unknown',
        'mask-r-to-unknown%',

        '-mask-r-to-0',
        '-mask-r-to-1.5',
        '-mask-r-to-2',
        '-mask-r-to-0%',
        '-mask-r-to-2%',
        '-mask-r-to-[0px]',
        '-mask-r-to-[0%]',

        '-mask-r-to-(--my-var)',
        '-mask-r-to-(color:--my-var)',
        '-mask-r-to-(length:--my-var)',

        'mask-r-to-[-25%]',
        'mask-r-to-[25%]/foo',
        'mask-r-to-[-25%]/foo',
        '-mask-r-to-[-25%]',
        '-mask-r-to-[25%]/foo',
        '-mask-r-to-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-b-from', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-b-from-0',
        'mask-b-from-1.5',
        'mask-b-from-2',
        'mask-b-from-0%',
        'mask-b-from-2%',
        'mask-b-from-[0px]',
        'mask-b-from-[0%]',

        'mask-b-from-(--my-var)',
        'mask-b-from-(color:--my-var)',
        'mask-b-from-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-left: linear-gradient(#fff, #fff);
          --tw-mask-right: linear-gradient(#fff, #fff);
          --tw-mask-bottom: linear-gradient(#fff, #fff);
          --tw-mask-top: linear-gradient(#fff, #fff);
          --tw-mask-bottom-from-position: 0%;
          --tw-mask-bottom-to-position: 100%;
          --tw-mask-bottom-from-color: black;
          --tw-mask-bottom-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-b-from-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-from-\\(--my-var\\), .mask-b-from-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-from-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-from-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-from-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-from-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-from-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-from-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-from-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-bottom-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-bottom-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-bottom-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-b-from',
        'mask-b-from-2.8175',
        'mask-b-from--1.5',
        'mask-b-from--2',

        'mask-b-from-2.5%',
        'mask-b-from--5%',
        'mask-b-from-unknown',
        'mask-b-from-unknown%',

        '-mask-b-from-0',
        '-mask-b-from-1.5',
        '-mask-b-from-2',
        '-mask-b-from-0%',
        '-mask-b-from-2%',
        '-mask-b-from-[0px]',
        '-mask-b-from-[0%]',

        '-mask-b-from-(--my-var)',
        '-mask-b-from-(color:--my-var)',
        '-mask-b-from-(length:--my-var)',

        'mask-b-from-[-25%]',
        'mask-b-from-[25%]/foo',
        'mask-b-from-[-25%]/foo',
        '-mask-b-from-[-25%]',
        '-mask-b-from-[25%]/foo',
        '-mask-b-from-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-b-to', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-b-to-0',
        'mask-b-to-1.5',
        'mask-b-to-2',
        'mask-b-to-0%',
        'mask-b-to-2%',
        'mask-b-to-[0px]',
        'mask-b-to-[0%]',

        'mask-b-to-(--my-var)',
        'mask-b-to-(color:--my-var)',
        'mask-b-to-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-left: linear-gradient(#fff, #fff);
          --tw-mask-right: linear-gradient(#fff, #fff);
          --tw-mask-bottom: linear-gradient(#fff, #fff);
          --tw-mask-top: linear-gradient(#fff, #fff);
          --tw-mask-bottom-from-position: 0%;
          --tw-mask-bottom-to-position: 100%;
          --tw-mask-bottom-from-color: black;
          --tw-mask-bottom-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-b-to-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-to-\\(--my-var\\), .mask-b-to-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-to-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-to-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-to-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-to-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-to-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-to-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-b-to-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-bottom-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-bottom-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-bottom-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-b-to',
        'mask-b-to-2.8175',
        'mask-b-to--1.5',
        'mask-b-to--2',

        'mask-b-to-2.5%',
        'mask-b-to--5%',
        'mask-b-to-unknown',
        'mask-b-to-unknown%',

        '-mask-b-to-0',
        '-mask-b-to-1.5',
        '-mask-b-to-2',
        '-mask-b-to-0%',
        '-mask-b-to-2%',
        '-mask-b-to-[0px]',
        '-mask-b-to-[0%]',

        '-mask-b-to-(--my-var)',
        '-mask-b-to-(color:--my-var)',
        '-mask-b-to-(length:--my-var)',

        'mask-b-to-[-25%]',
        'mask-b-to-[25%]/foo',
        'mask-b-to-[-25%]/foo',
        '-mask-b-to-[-25%]',
        '-mask-b-to-[25%]/foo',
        '-mask-b-to-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-l-from', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-l-from-0',
        'mask-l-from-1.5',
        'mask-l-from-2',
        'mask-l-from-0%',
        'mask-l-from-2%',
        'mask-l-from-[0px]',
        'mask-l-from-[0%]',

        'mask-l-from-(--my-var)',
        'mask-l-from-(color:--my-var)',
        'mask-l-from-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-left: linear-gradient(#fff, #fff);
          --tw-mask-right: linear-gradient(#fff, #fff);
          --tw-mask-bottom: linear-gradient(#fff, #fff);
          --tw-mask-top: linear-gradient(#fff, #fff);
          --tw-mask-left-from-position: 0%;
          --tw-mask-left-to-position: 100%;
          --tw-mask-left-from-color: black;
          --tw-mask-left-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-l-from-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-from-\\(--my-var\\), .mask-l-from-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-from-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-from-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-from-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-from-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-from-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-from-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-from-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-left-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-left-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-left-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-l-from',
        'mask-l-from-2.8175',
        'mask-l-from--1.5',
        'mask-l-from--2',

        'mask-l-from-2.5%',
        'mask-l-from--5%',
        'mask-l-from-unknown',
        'mask-l-from-unknown%',

        '-mask-l-from-0',
        '-mask-l-from-1.5',
        '-mask-l-from-2',
        '-mask-l-from-0%',
        '-mask-l-from-2%',
        '-mask-l-from-[0px]',
        '-mask-l-from-[0%]',

        '-mask-l-from-(--my-var)',
        '-mask-l-from-(color:--my-var)',
        '-mask-l-from-(length:--my-var)',

        'mask-l-from-[-25%]',
        'mask-l-from-[25%]/foo',
        'mask-l-from-[-25%]/foo',
        '-mask-l-from-[-25%]',
        '-mask-l-from-[25%]/foo',
        '-mask-l-from-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-l-to', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-l-to-0',
        'mask-l-to-1.5',
        'mask-l-to-2',
        'mask-l-to-0%',
        'mask-l-to-2%',
        'mask-l-to-[0px]',
        'mask-l-to-[0%]',

        'mask-l-to-(--my-var)',
        'mask-l-to-(color:--my-var)',
        'mask-l-to-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-left: linear-gradient(#fff, #fff);
          --tw-mask-right: linear-gradient(#fff, #fff);
          --tw-mask-bottom: linear-gradient(#fff, #fff);
          --tw-mask-top: linear-gradient(#fff, #fff);
          --tw-mask-left-from-position: 0%;
          --tw-mask-left-to-position: 100%;
          --tw-mask-left-from-color: black;
          --tw-mask-left-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-l-to-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-to-\\(--my-var\\), .mask-l-to-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-to-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-to-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-to-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-to-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-to-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-to-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-l-to-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-left-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-left-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-left-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-l-to',
        'mask-l-to-2.8175',
        'mask-l-to--1.5',
        'mask-l-to--2',

        'mask-l-to-2.5%',
        'mask-l-to--5%',
        'mask-l-to-unknown',
        'mask-l-to-unknown%',

        '-mask-l-to-0',
        '-mask-l-to-1.5',
        '-mask-l-to-2',
        '-mask-l-to-0%',
        '-mask-l-to-2%',
        '-mask-l-to-[0px]',
        '-mask-l-to-[0%]',

        '-mask-l-to-(--my-var)',
        '-mask-l-to-(color:--my-var)',
        '-mask-l-to-(length:--my-var)',

        'mask-l-to-[-25%]',
        'mask-l-to-[25%]/foo',
        'mask-l-to-[-25%]/foo',
        '-mask-l-to-[-25%]',
        '-mask-l-to-[25%]/foo',
        '-mask-l-to-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-x-from', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-x-from-0',
        'mask-x-from-1.5',
        'mask-x-from-2',
        'mask-x-from-0%',
        'mask-x-from-2%',
        'mask-x-from-[0px]',
        'mask-x-from-[0%]',

        'mask-x-from-(--my-var)',
        'mask-x-from-(color:--my-var)',
        'mask-x-from-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-left: linear-gradient(#fff, #fff);
          --tw-mask-right: linear-gradient(#fff, #fff);
          --tw-mask-bottom: linear-gradient(#fff, #fff);
          --tw-mask-top: linear-gradient(#fff, #fff);
          --tw-mask-right-from-position: 0%;
          --tw-mask-right-to-position: 100%;
          --tw-mask-right-from-color: black;
          --tw-mask-right-to-color: transparent;
          --tw-mask-left-from-position: 0%;
          --tw-mask-left-to-position: 100%;
          --tw-mask-left-from-color: black;
          --tw-mask-left-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-x-from-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-color: var(--my-var);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-from-\\(--my-var\\), .mask-x-from-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: var(--my-var);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-from-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: calc(var(--spacing) * 0);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-from-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: 0%;
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-from-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: calc(var(--spacing) * 1.5);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-from-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: calc(var(--spacing) * 2);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-from-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: 2%;
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-from-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: 0%;
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-from-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-from-position: 0px;
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-from-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-right-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-right-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-right-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }

    @property --tw-mask-left-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-left-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-left-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-left-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-x-from',
        'mask-x-from-2.8175',
        'mask-x-from--1.5',
        'mask-x-from--2',

        'mask-x-from-2.5%',
        'mask-x-from--5%',
        'mask-x-from-unknown',
        'mask-x-from-unknown%',

        '-mask-x-from-0',
        '-mask-x-from-1.5',
        '-mask-x-from-2',
        '-mask-x-from-0%',
        '-mask-x-from-2%',
        '-mask-x-from-[0px]',
        '-mask-x-from-[0%]',

        '-mask-x-from-(--my-var)',
        '-mask-x-from-(color:--my-var)',
        '-mask-x-from-(length:--my-var)',

        'mask-x-from-[-25%]',
        'mask-x-from-[25%]/foo',
        'mask-x-from-[-25%]/foo',
        '-mask-x-from-[-25%]',
        '-mask-x-from-[25%]/foo',
        '-mask-x-from-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-x-to', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-x-to-0',
        'mask-x-to-1.5',
        'mask-x-to-2',
        'mask-x-to-0%',
        'mask-x-to-2%',
        'mask-x-to-[0px]',
        'mask-x-to-[0%]',

        'mask-x-to-(--my-var)',
        'mask-x-to-(color:--my-var)',
        'mask-x-to-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-left: linear-gradient(#fff, #fff);
          --tw-mask-right: linear-gradient(#fff, #fff);
          --tw-mask-bottom: linear-gradient(#fff, #fff);
          --tw-mask-top: linear-gradient(#fff, #fff);
          --tw-mask-right-from-position: 0%;
          --tw-mask-right-to-position: 100%;
          --tw-mask-right-from-color: black;
          --tw-mask-right-to-color: transparent;
          --tw-mask-left-from-position: 0%;
          --tw-mask-left-to-position: 100%;
          --tw-mask-left-from-color: black;
          --tw-mask-left-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-x-to-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-color: var(--my-var);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-to-\\(--my-var\\), .mask-x-to-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: var(--my-var);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-to-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: calc(var(--spacing) * 0);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-to-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: 0%;
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-to-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: calc(var(--spacing) * 1.5);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-to-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: calc(var(--spacing) * 2);
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-to-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: 2%;
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-to-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: 0%;
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-x-to-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-right: linear-gradient(to right, var(--tw-mask-right-from-color) var(--tw-mask-right-from-position), var(--tw-mask-right-to-color) var(--tw-mask-right-to-position));
      --tw-mask-right-to-position: 0px;
      --tw-mask-left: linear-gradient(to left, var(--tw-mask-left-from-color) var(--tw-mask-left-from-position), var(--tw-mask-left-to-color) var(--tw-mask-left-to-position));
      --tw-mask-left-to-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-right-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-right-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-right-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }

    @property --tw-mask-left-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-left-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-left-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-left-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-x-to',
        'mask-x-to-2.8175',
        'mask-x-to--1.5',
        'mask-x-to--2',

        'mask-x-to-2.5%',
        'mask-x-to--5%',
        'mask-x-to-unknown',
        'mask-x-to-unknown%',

        '-mask-x-to-0',
        '-mask-x-to-1.5',
        '-mask-x-to-2',
        '-mask-x-to-0%',
        '-mask-x-to-2%',
        '-mask-x-to-[0px]',
        '-mask-x-to-[0%]',

        '-mask-x-to-(--my-var)',
        '-mask-x-to-(color:--my-var)',
        '-mask-x-to-(length:--my-var)',

        'mask-x-to-[-25%]',
        'mask-x-to-[25%]/foo',
        'mask-x-to-[-25%]/foo',
        '-mask-x-to-[-25%]',
        '-mask-x-to-[25%]/foo',
        '-mask-x-to-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-y-from', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-y-from-0',
        'mask-y-from-1.5',
        'mask-y-from-2',
        'mask-y-from-0%',
        'mask-y-from-2%',
        'mask-y-from-[0px]',
        'mask-y-from-[0%]',

        'mask-y-from-(--my-var)',
        'mask-y-from-(color:--my-var)',
        'mask-y-from-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-left: linear-gradient(#fff, #fff);
          --tw-mask-right: linear-gradient(#fff, #fff);
          --tw-mask-bottom: linear-gradient(#fff, #fff);
          --tw-mask-top: linear-gradient(#fff, #fff);
          --tw-mask-top-from-position: 0%;
          --tw-mask-top-to-position: 100%;
          --tw-mask-top-from-color: black;
          --tw-mask-top-to-color: transparent;
          --tw-mask-bottom-from-position: 0%;
          --tw-mask-bottom-to-position: 100%;
          --tw-mask-bottom-from-color: black;
          --tw-mask-bottom-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-y-from-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-color: var(--my-var);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-from-\\(--my-var\\), .mask-y-from-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: var(--my-var);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-from-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: calc(var(--spacing) * 0);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-from-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: 0%;
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-from-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: calc(var(--spacing) * 1.5);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-from-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: calc(var(--spacing) * 2);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-from-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: 2%;
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-from-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: 0%;
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-from-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-from-position: 0px;
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-from-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-top-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-top-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-top-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }

    @property --tw-mask-bottom-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-bottom-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-bottom-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-bottom-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-y-from',
        'mask-y-from-2.8175',
        'mask-y-from--1.5',
        'mask-y-from--2',

        'mask-y-from-2.5%',
        'mask-y-from--5%',
        'mask-y-from-unknown',
        'mask-y-from-unknown%',

        '-mask-y-from-0',
        '-mask-y-from-1.5',
        '-mask-y-from-2',
        '-mask-y-from-0%',
        '-mask-y-from-2%',
        '-mask-y-from-[0px]',
        '-mask-y-from-[0%]',

        '-mask-y-from-(--my-var)',
        '-mask-y-from-(color:--my-var)',
        '-mask-y-from-(length:--my-var)',

        'mask-y-from-[-25%]',
        'mask-y-from-[25%]/foo',
        'mask-y-from-[-25%]/foo',
        '-mask-y-from-[-25%]',
        '-mask-y-from-[25%]/foo',
        '-mask-y-from-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-y-to', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-y-to-0',
        'mask-y-to-1.5',
        'mask-y-to-2',
        'mask-y-to-0%',
        'mask-y-to-2%',
        'mask-y-to-[0px]',
        'mask-y-to-[0%]',

        'mask-y-to-(--my-var)',
        'mask-y-to-(color:--my-var)',
        'mask-y-to-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-left: linear-gradient(#fff, #fff);
          --tw-mask-right: linear-gradient(#fff, #fff);
          --tw-mask-bottom: linear-gradient(#fff, #fff);
          --tw-mask-top: linear-gradient(#fff, #fff);
          --tw-mask-top-from-position: 0%;
          --tw-mask-top-to-position: 100%;
          --tw-mask-top-from-color: black;
          --tw-mask-top-to-color: transparent;
          --tw-mask-bottom-from-position: 0%;
          --tw-mask-bottom-to-position: 100%;
          --tw-mask-bottom-from-color: black;
          --tw-mask-bottom-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-y-to-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-color: var(--my-var);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-to-\\(--my-var\\), .mask-y-to-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: var(--my-var);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-to-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: calc(var(--spacing) * 0);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-to-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: 0%;
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-to-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: calc(var(--spacing) * 1.5);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-to-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: calc(var(--spacing) * 2);
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-to-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: 2%;
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-to-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: 0%;
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-y-to-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top);
      --tw-mask-top: linear-gradient(to top, var(--tw-mask-top-from-color) var(--tw-mask-top-from-position), var(--tw-mask-top-to-color) var(--tw-mask-top-to-position));
      --tw-mask-top-to-position: 0px;
      --tw-mask-bottom: linear-gradient(to bottom, var(--tw-mask-bottom-from-color) var(--tw-mask-bottom-from-position), var(--tw-mask-bottom-to-color) var(--tw-mask-bottom-to-position));
      --tw-mask-bottom-to-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-left {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-right {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-bottom {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-top-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-top-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-top-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-top-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }

    @property --tw-mask-bottom-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-bottom-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-bottom-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-bottom-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-y-to',
        'mask-y-to-2.8175',
        'mask-y-to--1.5',
        'mask-y-to--2',

        'mask-y-to-2.5%',
        'mask-y-to--5%',
        'mask-y-to-unknown',
        'mask-y-to-unknown%',

        '-mask-y-to-0',
        '-mask-y-to-1.5',
        '-mask-y-to-2',
        '-mask-y-to-0%',
        '-mask-y-to-2%',
        '-mask-y-to-[0px]',
        '-mask-y-to-[0%]',

        '-mask-y-to-(--my-var)',
        '-mask-y-to-(color:--my-var)',
        '-mask-y-to-(length:--my-var)',

        'mask-y-to-[-25%]',
        'mask-y-to-[25%]/foo',
        'mask-y-to-[-25%]/foo',
        '-mask-y-to-[-25%]',
        '-mask-y-to-[25%]/foo',
        '-mask-y-to-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-linear', async () => {
  expect(
    await compileCss(
      css`
        @tailwind utilities;
      `,
      ['mask-linear-45', 'mask-linear-[3rad]', '-mask-linear-45'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-linear-position: 0deg;
          --tw-mask-linear-from-position: 0%;
          --tw-mask-linear-to-position: 100%;
          --tw-mask-linear-from-color: black;
          --tw-mask-linear-to-color: transparent;
        }
      }
    }

    .-mask-linear-45 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops, var(--tw-mask-linear-position)));
      --tw-mask-linear-position: calc(1deg * -45);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-45 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops, var(--tw-mask-linear-position)));
      --tw-mask-linear-position: calc(1deg * 45);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-\\[3rad\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops, var(--tw-mask-linear-position)));
      --tw-mask-linear-position: 171.887deg;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-linear-position {
      syntax: "*";
      inherits: false;
      initial-value: 0deg;
    }

    @property --tw-mask-linear-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-linear-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-linear-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-linear-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await run([
      'mask-linear',
      '-mask-linear',

      'mask-linear--75',
      'mask-linear-unknown',
      'mask-linear--75/foo',
      'mask-linear-unknown/foo',

      'mask-linear-45/foo',
      '-mask-linear-45/foo',

      'mask-linear-[3rad]/foo',
      '-mask-linear-[3rad]/foo',
    ]),
  ).toEqual('')
})

test('mask-linear-from', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-linear-from-0',
        'mask-linear-from-1.5',
        'mask-linear-from-2',
        'mask-linear-from-0%',
        'mask-linear-from-2%',
        'mask-linear-from-[0px]',
        'mask-linear-from-[0%]',

        'mask-linear-from-(--my-var)',
        'mask-linear-from-(color:--my-var)',
        'mask-linear-from-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-linear-position: 0deg;
          --tw-mask-linear-from-position: 0%;
          --tw-mask-linear-to-position: 100%;
          --tw-mask-linear-from-color: black;
          --tw-mask-linear-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-linear-from-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-from-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-from-\\(--my-var\\), .mask-linear-from-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-from-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-from-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-from-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-from-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-from-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-from-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-from-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-from-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-from-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-from-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-from-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-from-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-from-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-linear-position {
      syntax: "*";
      inherits: false;
      initial-value: 0deg;
    }

    @property --tw-mask-linear-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-linear-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-linear-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-linear-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-linear-from',
        'mask-linear-from-2.8175',
        'mask-linear-from--1.5',
        'mask-linear-from--2',

        'mask-linear-from-2.5%',
        'mask-linear-from--5%',
        'mask-linear-from-unknown',
        'mask-linear-from-unknown%',

        '-mask-linear-from-0',
        '-mask-linear-from-1.5',
        '-mask-linear-from-2',
        '-mask-linear-from-0%',
        '-mask-linear-from-2%',
        '-mask-linear-from-[0px]',
        '-mask-linear-from-[0%]',

        '-mask-linear-from-(--my-var)',
        '-mask-linear-from-(color:--my-var)',
        '-mask-linear-from-(length:--my-var)',

        'mask-linear-from-[-25%]',
        'mask-linear-from-[25%]/foo',
        'mask-linear-from-[-25%]/foo',
        '-mask-linear-from-[-25%]',
        '-mask-linear-from-[25%]/foo',
        '-mask-linear-from-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-linear-to', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-linear-to-0',
        'mask-linear-to-1.5',
        'mask-linear-to-2',
        'mask-linear-to-0%',
        'mask-linear-to-2%',
        'mask-linear-to-[0px]',
        'mask-linear-to-[0%]',

        'mask-linear-to-(--my-var)',
        'mask-linear-to-(color:--my-var)',
        'mask-linear-to-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-linear-position: 0deg;
          --tw-mask-linear-from-position: 0%;
          --tw-mask-linear-to-position: 100%;
          --tw-mask-linear-from-color: black;
          --tw-mask-linear-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-linear-to-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-to-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-to-\\(--my-var\\), .mask-linear-to-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-to-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-to-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-to-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-to-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-to-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-to-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-to-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-to-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-to-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-to-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-to-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-linear-to-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-linear-stops: var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position);
      --tw-mask-linear: linear-gradient(var(--tw-mask-linear-stops));
      --tw-mask-linear-to-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-linear-position {
      syntax: "*";
      inherits: false;
      initial-value: 0deg;
    }

    @property --tw-mask-linear-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-linear-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-linear-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-linear-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-linear-to',
        'mask-linear-to-2.8175',
        'mask-linear-to--1.5',
        'mask-linear-to--2',

        'mask-linear-to-2.5%',
        'mask-linear-to--5%',
        'mask-linear-to-unknown',
        'mask-linear-to-unknown%',

        '-mask-linear-to-0',
        '-mask-linear-to-1.5',
        '-mask-linear-to-2',
        '-mask-linear-to-0%',
        '-mask-linear-to-2%',
        '-mask-linear-to-[0px]',
        '-mask-linear-to-[0%]',

        '-mask-linear-to-(--my-var)',
        '-mask-linear-to-(color:--my-var)',
        '-mask-linear-to-(length:--my-var)',

        'mask-linear-to-[-25%]',
        'mask-linear-to-[25%]/foo',
        'mask-linear-to-[-25%]/foo',
        '-mask-linear-to-[-25%]',
        '-mask-linear-to-[25%]/foo',
        '-mask-linear-to-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-radial', async () => {
  expect(
    await compileCss(
      css`
        @tailwind utilities;
      `,
      [
        'mask-circle',
        'mask-ellipse',
        'mask-radial-closest-side',
        'mask-radial-farthest-side',
        'mask-radial-closest-corner',
        'mask-radial-farthest-corner',
        'mask-radial-[25%_25%]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-radial-from-position: 0%;
          --tw-mask-radial-to-position: 100%;
          --tw-mask-radial-from-color: black;
          --tw-mask-radial-to-color: transparent;
          --tw-mask-radial-shape: ellipse;
          --tw-mask-radial-size: farthest-corner;
          --tw-mask-radial-position: center;
        }
      }
    }

    .mask-radial-\\[25\\%_25\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops, var(--tw-mask-radial-size)));
      --tw-mask-radial-size: 25% 25%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-circle {
      --tw-mask-radial-shape: circle;
    }

    .mask-ellipse {
      --tw-mask-radial-shape: ellipse;
    }

    .mask-radial-closest-corner {
      --tw-mask-radial-size: closest-corner;
    }

    .mask-radial-closest-side {
      --tw-mask-radial-size: closest-side;
    }

    .mask-radial-farthest-corner {
      --tw-mask-radial-size: farthest-corner;
    }

    .mask-radial-farthest-side {
      --tw-mask-radial-size: farthest-side;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-radial-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-radial-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-radial-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }

    @property --tw-mask-radial-shape {
      syntax: "*";
      inherits: false;
      initial-value: ellipse;
    }

    @property --tw-mask-radial-size {
      syntax: "*";
      inherits: false;
      initial-value: farthest-corner;
    }

    @property --tw-mask-radial-position {
      syntax: "*";
      inherits: false;
      initial-value: center;
    }"
  `)
  expect(
    await run([
      'mask-radial',
      'mask-radial-[25%_25%]/foo',
      'mask-radial/foo',
      '-mask-radial',
      '-mask-radial-[25%_25%]',
      '-mask-radial/foo',
      '-mask-radial-[25%_25%]/foo',

      'mask-radial-from-[-25%]',
      'mask-radial-from-[25%]/foo',
      'mask-radial-from-[-25%]/foo',
      '-mask-radial-from-[-25%]',
      '-mask-radial-from-[25%]/foo',
      '-mask-radial-from-[-25%]/foo',
    ]),
  ).toEqual('')
})

test('mask-radial-at', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-radial-at-top',
        'mask-radial-at-top-left',
        'mask-radial-at-top-right',
        'mask-radial-at-bottom',
        'mask-radial-at-bottom-left',
        'mask-radial-at-bottom-right',
        'mask-radial-at-left',
        'mask-radial-at-right',
        'mask-radial-at-[25%]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ".mask-radial-at-\\[25\\%\\] {
      --tw-mask-radial-position: 25%;
    }

    .mask-radial-at-bottom {
      --tw-mask-radial-position: bottom;
    }

    .mask-radial-at-bottom-left {
      --tw-mask-radial-position: bottom left;
    }

    .mask-radial-at-bottom-right {
      --tw-mask-radial-position: bottom right;
    }

    .mask-radial-at-left {
      --tw-mask-radial-position: left;
    }

    .mask-radial-at-right {
      --tw-mask-radial-position: right;
    }

    .mask-radial-at-top {
      --tw-mask-radial-position: top;
    }

    .mask-radial-at-top-left {
      --tw-mask-radial-position: top left;
    }

    .mask-radial-at-top-right {
      --tw-mask-radial-position: top right;
    }"
  `)
  expect(
    await run([
      'mask-radial-at',
      'mask-radial-at/foo',
      'mask-radial-at-25',
      'mask-radial-at-unknown',
      'mask-radial-at-[25%]/foo',
      'mask-radial-at-top/foo',
      'mask-radial-at-top-left/foo',
      'mask-radial-at-top-right/foo',
      'mask-radial-at-bottom/foo',
      'mask-radial-at-bottom-left/foo',
      'mask-radial-at-bottom-right/foo',
      'mask-radial-at-left/foo',
      'mask-radial-at-right/foo',

      '-mask-radial-at',
      '-mask-radial-at/foo',
      '-mask-radial-at-25',
      '-mask-radial-at-unknown',
      '-mask-radial-at-[25%]',
      '-mask-radial-at-[25%]/foo',

      '-mask-radial-at-top',
      '-mask-radial-at-top-left',
      '-mask-radial-at-top-right',
      '-mask-radial-at-bottom',
      '-mask-radial-at-bottom-left',
      '-mask-radial-at-bottom-right',
      '-mask-radial-at-left',
      '-mask-radial-at-right',

      'mask-radial-at-[25%]/foo',
      'mask-radial-at-[-25%]/foo',
      '-mask-radial-at-[-25%]',
      '-mask-radial-at-[25%]/foo',
      '-mask-radial-at-[-25%]/foo',
    ]),
  ).toEqual('')
})

test('mask-radial-from', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-radial-from-0',
        'mask-radial-from-1.5',
        'mask-radial-from-2',
        'mask-radial-from-0%',
        'mask-radial-from-2%',
        'mask-radial-from-[0px]',
        'mask-radial-from-[0%]',

        'mask-radial-from-(--my-var)',
        'mask-radial-from-(color:--my-var)',
        'mask-radial-from-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-radial-from-position: 0%;
          --tw-mask-radial-to-position: 100%;
          --tw-mask-radial-from-color: black;
          --tw-mask-radial-to-color: transparent;
          --tw-mask-radial-shape: ellipse;
          --tw-mask-radial-size: farthest-corner;
          --tw-mask-radial-position: center;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-radial-from-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-from-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-from-\\(--my-var\\), .mask-radial-from-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-from-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-from-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-from-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-from-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-from-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-from-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-from-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-from-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-from-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-from-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-from-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-from-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-from-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-radial-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-radial-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-radial-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }

    @property --tw-mask-radial-shape {
      syntax: "*";
      inherits: false;
      initial-value: ellipse;
    }

    @property --tw-mask-radial-size {
      syntax: "*";
      inherits: false;
      initial-value: farthest-corner;
    }

    @property --tw-mask-radial-position {
      syntax: "*";
      inherits: false;
      initial-value: center;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-radial-from',
        'mask-radial-from-2.8175',
        'mask-radial-from--1.5',
        'mask-radial-from--2',

        'mask-radial-from-2.5%',
        'mask-radial-from--5%',
        'mask-radial-from-unknown',
        'mask-radial-from-unknown%',

        '-mask-radial-from-0',
        '-mask-radial-from-1.5',
        '-mask-radial-from-2',
        '-mask-radial-from-0%',
        '-mask-radial-from-2%',
        '-mask-radial-from-[0px]',
        '-mask-radial-from-[0%]',

        '-mask-radial-from-(--my-var)',
        '-mask-radial-from-(color:--my-var)',
        '-mask-radial-from-(length:--my-var)',

        'mask-radial-from-[-25%]',
        'mask-radial-from-[25%]/foo',
        'mask-radial-from-[-25%]/foo',
        '-mask-radial-from-[-25%]',
        '-mask-radial-from-[25%]/foo',
        '-mask-radial-from-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-radial-to', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-radial-to-0',
        'mask-radial-to-1.5',
        'mask-radial-to-2',
        'mask-radial-to-0%',
        'mask-radial-to-2%',
        'mask-radial-to-[0px]',
        'mask-radial-to-[0%]',

        'mask-radial-to-(--my-var)',
        'mask-radial-to-(color:--my-var)',
        'mask-radial-to-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-radial-from-position: 0%;
          --tw-mask-radial-to-position: 100%;
          --tw-mask-radial-from-color: black;
          --tw-mask-radial-to-color: transparent;
          --tw-mask-radial-shape: ellipse;
          --tw-mask-radial-size: farthest-corner;
          --tw-mask-radial-position: center;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-radial-to-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-to-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-to-\\(--my-var\\), .mask-radial-to-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-to-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-to-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-to-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-to-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-to-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-to-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-to-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-to-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-to-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-to-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-to-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-radial-to-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-radial-stops: var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position);
      --tw-mask-radial: radial-gradient(var(--tw-mask-radial-stops));
      --tw-mask-radial-to-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-radial-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-radial-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-radial-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }

    @property --tw-mask-radial-shape {
      syntax: "*";
      inherits: false;
      initial-value: ellipse;
    }

    @property --tw-mask-radial-size {
      syntax: "*";
      inherits: false;
      initial-value: farthest-corner;
    }

    @property --tw-mask-radial-position {
      syntax: "*";
      inherits: false;
      initial-value: center;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-radial-to',
        'mask-radial-to-2.8175',
        'mask-radial-to--1.5',
        'mask-radial-to--2',

        'mask-radial-to-2.5%',
        'mask-radial-to--5%',
        'mask-radial-to-unknown',
        'mask-radial-to-unknown%',

        '-mask-radial-to-0',
        '-mask-radial-to-1.5',
        '-mask-radial-to-2',
        '-mask-radial-to-0%',
        '-mask-radial-to-2%',
        '-mask-radial-to-[0px]',
        '-mask-radial-to-[0%]',

        '-mask-radial-to-(--my-var)',
        '-mask-radial-to-(color:--my-var)',
        '-mask-radial-to-(length:--my-var)',

        'mask-radial-to-[-25%]',
        'mask-radial-to-[25%]/foo',
        'mask-radial-to-[-25%]/foo',
        '-mask-radial-to-[-25%]',
        '-mask-radial-to-[25%]/foo',
        '-mask-radial-to-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-conic', async () => {
  expect(
    await compileCss(
      css`
        @tailwind utilities;
      `,
      ['mask-conic-45', 'mask-conic-[3rad]', '-mask-conic-45'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-conic-position: 0deg;
          --tw-mask-conic-from-position: 0%;
          --tw-mask-conic-to-position: 100%;
          --tw-mask-conic-from-color: black;
          --tw-mask-conic-to-color: transparent;
        }
      }
    }

    .-mask-conic-45 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops, var(--tw-mask-conic-position)));
      --tw-mask-conic-position: calc(1deg * -45);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-45 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops, var(--tw-mask-conic-position)));
      --tw-mask-conic-position: calc(1deg * 45);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-\\[3rad\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops, var(--tw-mask-conic-position)));
      --tw-mask-conic-position: 171.887deg;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic-position {
      syntax: "*";
      inherits: false;
      initial-value: 0deg;
    }

    @property --tw-mask-conic-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-conic-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-conic-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-conic-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await run([
      'mask-conic',
      '-mask-conic',

      'mask-conic--75',
      'mask-conic-unknown',
      'mask-conic--75/foo',
      'mask-conic-unknown/foo',

      'mask-conic-45/foo',
      '-mask-conic-45/foo',

      'mask-conic-[3rad]/foo',
      '-mask-conic-[3rad]/foo',
    ]),
  ).toEqual('')
})

test('mask-conic-from', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-conic-from-0',
        'mask-conic-from-1.5',
        'mask-conic-from-2',
        'mask-conic-from-0%',
        'mask-conic-from-2%',
        'mask-conic-from-[0px]',
        'mask-conic-from-[0%]',

        'mask-conic-from-(--my-var)',
        'mask-conic-from-(color:--my-var)',
        'mask-conic-from-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-conic-position: 0deg;
          --tw-mask-conic-from-position: 0%;
          --tw-mask-conic-to-position: 100%;
          --tw-mask-conic-from-color: black;
          --tw-mask-conic-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-conic-from-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-from-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-from-\\(--my-var\\), .mask-conic-from-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-from-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-from-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-from-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-from-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-from-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-from-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-from-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-from-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-from-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-from-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-from-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-from-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-from-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-from-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic-position {
      syntax: "*";
      inherits: false;
      initial-value: 0deg;
    }

    @property --tw-mask-conic-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-conic-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-conic-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-conic-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-conic-from',
        'mask-conic-from-2.8175',
        'mask-conic-from--1.5',
        'mask-conic-from--2',

        'mask-conic-from-2.5%',
        'mask-conic-from--5%',
        'mask-conic-from-unknown',
        'mask-conic-from-unknown%',

        '-mask-conic-from-0',
        '-mask-conic-from-1.5',
        '-mask-conic-from-2',
        '-mask-conic-from-0%',
        '-mask-conic-from-2%',
        '-mask-conic-from-[0px]',
        '-mask-conic-from-[0%]',

        '-mask-conic-from-(--my-var)',
        '-mask-conic-from-(color:--my-var)',
        '-mask-conic-from-(length:--my-var)',

        'mask-conic-from-[-25%]',
        'mask-conic-from-[25%]/foo',
        'mask-conic-from-[-25%]/foo',
        '-mask-conic-from-[-25%]',
        '-mask-conic-from-[25%]/foo',
        '-mask-conic-from-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('mask-conic-to', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-conic-to-0',
        'mask-conic-to-1.5',
        'mask-conic-to-2',
        'mask-conic-to-0%',
        'mask-conic-to-2%',
        'mask-conic-to-[0px]',
        'mask-conic-to-[0%]',

        'mask-conic-to-(--my-var)',
        'mask-conic-to-(color:--my-var)',
        'mask-conic-to-(length:--my-var)',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-mask-linear: linear-gradient(#fff, #fff);
          --tw-mask-radial: linear-gradient(#fff, #fff);
          --tw-mask-conic: linear-gradient(#fff, #fff);
          --tw-mask-conic-position: 0deg;
          --tw-mask-conic-from-position: 0%;
          --tw-mask-conic-to-position: 100%;
          --tw-mask-conic-from-color: black;
          --tw-mask-conic-to-color: transparent;
        }
      }
    }

    :root, :host {
      --spacing: .25rem;
    }

    .mask-conic-to-\\(color\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-to-color: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-to-\\(--my-var\\), .mask-conic-to-\\(length\\:--my-var\\) {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-to-position: var(--my-var);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-to-0 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-to-position: calc(var(--spacing) * 0);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-to-0\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-to-1\\.5 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-to-position: calc(var(--spacing) * 1.5);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-to-2 {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-to-position: calc(var(--spacing) * 2);
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-to-2\\% {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-to-position: 2%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-to-\\[0\\%\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-to-position: 0%;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    .mask-conic-to-\\[0px\\] {
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      -webkit-mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      mask-image: var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic);
      --tw-mask-conic-stops: from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position);
      --tw-mask-conic: conic-gradient(var(--tw-mask-conic-stops));
      --tw-mask-conic-to-position: 0px;
      -webkit-mask-composite: source-in;
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
    }

    @property --tw-mask-linear {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-radial {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic {
      syntax: "*";
      inherits: false;
      initial-value: linear-gradient(#fff, #fff);
    }

    @property --tw-mask-conic-position {
      syntax: "*";
      inherits: false;
      initial-value: 0deg;
    }

    @property --tw-mask-conic-from-position {
      syntax: "*";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-mask-conic-to-position {
      syntax: "*";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-mask-conic-from-color {
      syntax: "*";
      inherits: false;
      initial-value: black;
    }

    @property --tw-mask-conic-to-color {
      syntax: "*";
      inherits: false;
      initial-value: transparent;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
        }
        @tailwind utilities;
      `,
      [
        'mask-conic-to',
        'mask-conic-to-2.8175',
        'mask-conic-to--1.5',
        'mask-conic-to--2',

        'mask-conic-to-2.5%',
        'mask-conic-to--5%',
        'mask-conic-to-unknown',
        'mask-conic-to-unknown%',

        '-mask-conic-to-0',
        '-mask-conic-to-1.5',
        '-mask-conic-to-2',
        '-mask-conic-to-0%',
        '-mask-conic-to-2%',
        '-mask-conic-to-[0px]',
        '-mask-conic-to-[0%]',

        '-mask-conic-to-(--my-var)',
        '-mask-conic-to-(color:--my-var)',
        '-mask-conic-to-(length:--my-var)',

        'mask-conic-to-[-25%]',
        'mask-conic-to-[25%]/foo',
        'mask-conic-to-[-25%]/foo',
        '-mask-conic-to-[-25%]',
        '-mask-conic-to-[25%]/foo',
        '-mask-conic-to-[-25%]/foo',
      ],
    ),
  ).toEqual('')
})

test('box-decoration', async () => {
  expect(await run(['box-decoration-slice', 'box-decoration-clone'])).toMatchInlineSnapshot(`
    ".box-decoration-clone {
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
    }

    .box-decoration-slice {
      -webkit-box-decoration-break: slice;
      box-decoration-break: slice;
    }"
  `)
  expect(
    await run([
      'box',
      'box-decoration',
      '-box-decoration-slice',
      '-box-decoration-clone',
      'box-decoration-slice/foo',
      'box-decoration-clone/foo',
    ]),
  ).toEqual('')
})

test('bg-clip', async () => {
  expect(await run(['bg-clip-border', 'bg-clip-padding', 'bg-clip-content', 'bg-clip-text']))
    .toMatchInlineSnapshot(`
      ".bg-clip-border {
        background-clip: border-box;
      }

      .bg-clip-content {
        background-clip: content-box;
      }

      .bg-clip-padding {
        background-clip: padding-box;
      }

      .bg-clip-text {
        -webkit-background-clip: text;
        background-clip: text;
      }"
    `)
  expect(
    await run([
      'bg-clip',
      '-bg-clip-border',
      '-bg-clip-padding',
      '-bg-clip-content',
      '-bg-clip-text',
      'bg-clip-border/foo',
      'bg-clip-padding/foo',
      'bg-clip-content/foo',
      'bg-clip-text/foo',
    ]),
  ).toEqual('')
})

test('bg-origin', async () => {
  expect(await run(['bg-origin-border', 'bg-origin-padding', 'bg-origin-content']))
    .toMatchInlineSnapshot(`
      ".bg-origin-border {
        background-origin: border-box;
      }

      .bg-origin-content {
        background-origin: content-box;
      }

      .bg-origin-padding {
        background-origin: padding-box;
      }"
    `)
  expect(
    await run([
      'bg-origin',
      '-bg-origin-border',
      '-bg-origin-padding',
      '-bg-origin-content',
      'bg-origin-border/foo',
      'bg-origin-padding/foo',
      'bg-origin-content/foo',
    ]),
  ).toEqual('')
})

test('mask-clip', async () => {
  expect(
    await run([
      'mask-clip-border',
      'mask-clip-padding',
      'mask-clip-content',
      'mask-clip-fill',
      'mask-clip-stroke',
      'mask-clip-view',
      'mask-no-clip',
    ]),
  ).toMatchInlineSnapshot(`
    ".mask-clip-border {
      -webkit-mask-clip: border-box;
      mask-clip: border-box;
    }

    .mask-clip-content {
      -webkit-mask-clip: content-box;
      mask-clip: content-box;
    }

    .mask-clip-fill {
      -webkit-mask-clip: fill-box;
      mask-clip: fill-box;
    }

    .mask-clip-padding {
      -webkit-mask-clip: padding-box;
      mask-clip: padding-box;
    }

    .mask-clip-stroke {
      -webkit-mask-clip: stroke-box;
      mask-clip: stroke-box;
    }

    .mask-clip-view {
      -webkit-mask-clip: view-box;
      mask-clip: view-box;
    }

    .mask-no-clip {
      -webkit-mask-clip: no-clip;
      mask-clip: no-clip;
    }"
  `)
  expect(
    await run([
      'mask-clip',
      '-mask-clip-border',
      '-mask-clip-padding',
      '-mask-clip-content',
      '-mask-clip-fill',
      '-mask-clip-stroke',
      '-mask-clip-view',
      '-mask-no-clip',
      'mask-clip-border/foo',
      'mask-clip-padding/foo',
      'mask-clip-content/foo',
      'mask-clip-fill/foo',
      'mask-clip-stroke/foo',
      'mask-clip-view/foo',
      'mask-no-clip/foo',
    ]),
  ).toEqual('')
})

test('mask-origin', async () => {
  expect(
    await run([
      'mask-origin-border',
      'mask-origin-padding',
      'mask-origin-content',
      'mask-origin-fill',
      'mask-origin-stroke',
      'mask-origin-view',
    ]),
  ).toMatchInlineSnapshot(`
    ".mask-origin-border {
      -webkit-mask-origin: border-box;
      mask-origin: border-box;
    }

    .mask-origin-content {
      -webkit-mask-origin: content-box;
      mask-origin: content-box;
    }

    .mask-origin-fill {
      -webkit-mask-origin: fill-box;
      mask-origin: fill-box;
    }

    .mask-origin-padding {
      -webkit-mask-origin: padding-box;
      mask-origin: padding-box;
    }

    .mask-origin-stroke {
      -webkit-mask-origin: stroke-box;
      mask-origin: stroke-box;
    }

    .mask-origin-view {
      -webkit-mask-origin: view-box;
      mask-origin: view-box;
    }"
  `)
  expect(
    await run([
      'mask-origin',
      '-mask-origin-border',
      '-mask-origin-padding',
      '-mask-origin-content',
      '-mask-origin-fill',
      '-mask-origin-stroke',
      '-mask-origin-view',
      'mask-origin-border/foo',
      'mask-origin-padding/foo',
      'mask-origin-content/foo',
      'mask-origin-fill/foo',
      'mask-origin-stroke/foo',
      'mask-origin-view/foo',
    ]),
  ).toEqual('')
})

test('bg-blend', async () => {
  expect(
    await run([
      'bg-blend-normal',
      'bg-blend-multiply',
      'bg-blend-screen',
      'bg-blend-overlay',
      'bg-blend-darken',
      'bg-blend-lighten',
      'bg-blend-color-dodge',
      'bg-blend-color-burn',
      'bg-blend-hard-light',
      'bg-blend-soft-light',
      'bg-blend-difference',
      'bg-blend-exclusion',
      'bg-blend-hue',
      'bg-blend-saturation',
      'bg-blend-color',
      'bg-blend-luminosity',
    ]),
  ).toMatchInlineSnapshot(`
    ".bg-blend-color {
      background-blend-mode: color;
    }

    .bg-blend-color-burn {
      background-blend-mode: color-burn;
    }

    .bg-blend-color-dodge {
      background-blend-mode: color-dodge;
    }

    .bg-blend-darken {
      background-blend-mode: darken;
    }

    .bg-blend-difference {
      background-blend-mode: difference;
    }

    .bg-blend-exclusion {
      background-blend-mode: exclusion;
    }

    .bg-blend-hard-light {
      background-blend-mode: hard-light;
    }

    .bg-blend-hue {
      background-blend-mode: hue;
    }

    .bg-blend-lighten {
      background-blend-mode: lighten;
    }

    .bg-blend-luminosity {
      background-blend-mode: luminosity;
    }

    .bg-blend-multiply {
      background-blend-mode: multiply;
    }

    .bg-blend-normal {
      background-blend-mode: normal;
    }

    .bg-blend-overlay {
      background-blend-mode: overlay;
    }

    .bg-blend-saturation {
      background-blend-mode: saturation;
    }

    .bg-blend-screen {
      background-blend-mode: screen;
    }

    .bg-blend-soft-light {
      background-blend-mode: soft-light;
    }"
  `)
  expect(
    await run([
      'bg-blend',
      '-bg-blend-normal',
      '-bg-blend-multiply',
      '-bg-blend-screen',
      '-bg-blend-overlay',
      '-bg-blend-darken',
      '-bg-blend-lighten',
      '-bg-blend-color-dodge',
      '-bg-blend-color-burn',
      '-bg-blend-hard-light',
      '-bg-blend-soft-light',
      '-bg-blend-difference',
      '-bg-blend-exclusion',
      '-bg-blend-hue',
      '-bg-blend-saturation',
      '-bg-blend-color',
      '-bg-blend-luminosity',
      'bg-blend-normal/foo',
      'bg-blend-multiply/foo',
      'bg-blend-screen/foo',
      'bg-blend-overlay/foo',
      'bg-blend-darken/foo',
      'bg-blend-lighten/foo',
      'bg-blend-color-dodge/foo',
      'bg-blend-color-burn/foo',
      'bg-blend-hard-light/foo',
      'bg-blend-soft-light/foo',
      'bg-blend-difference/foo',
      'bg-blend-exclusion/foo',
      'bg-blend-hue/foo',
      'bg-blend-saturation/foo',
      'bg-blend-color/foo',
      'bg-blend-luminosity/foo',
    ]),
  ).toEqual('')
})

test('mix-blend', async () => {
  expect(
    await run([
      'mix-blend-normal',
      'mix-blend-multiply',
      'mix-blend-screen',
      'mix-blend-overlay',
      'mix-blend-darken',
      'mix-blend-lighten',
      'mix-blend-color-dodge',
      'mix-blend-color-burn',
      'mix-blend-hard-light',
      'mix-blend-soft-light',
      'mix-blend-difference',
      'mix-blend-exclusion',
      'mix-blend-hue',
      'mix-blend-saturation',
      'mix-blend-color',
      'mix-blend-luminosity',
      'mix-blend-plus-darker',
      'mix-blend-plus-lighter',
    ]),
  ).toMatchInlineSnapshot(`
    ".mix-blend-color {
      mix-blend-mode: color;
    }

    .mix-blend-color-burn {
      mix-blend-mode: color-burn;
    }

    .mix-blend-color-dodge {
      mix-blend-mode: color-dodge;
    }

    .mix-blend-darken {
      mix-blend-mode: darken;
    }

    .mix-blend-difference {
      mix-blend-mode: difference;
    }

    .mix-blend-exclusion {
      mix-blend-mode: exclusion;
    }

    .mix-blend-hard-light {
      mix-blend-mode: hard-light;
    }

    .mix-blend-hue {
      mix-blend-mode: hue;
    }

    .mix-blend-lighten {
      mix-blend-mode: lighten;
    }

    .mix-blend-luminosity {
      mix-blend-mode: luminosity;
    }

    .mix-blend-multiply {
      mix-blend-mode: multiply;
    }

    .mix-blend-normal {
      mix-blend-mode: normal;
    }

    .mix-blend-overlay {
      mix-blend-mode: overlay;
    }

    .mix-blend-plus-darker {
      mix-blend-mode: plus-darker;
    }

    .mix-blend-plus-lighter {
      mix-blend-mode: plus-lighter;
    }

    .mix-blend-saturation {
      mix-blend-mode: saturation;
    }

    .mix-blend-screen {
      mix-blend-mode: screen;
    }

    .mix-blend-soft-light {
      mix-blend-mode: soft-light;
    }"
  `)
  expect(
    await run([
      'mix-blend',
      '-mix-blend-normal',
      '-mix-blend-multiply',
      '-mix-blend-screen',
      '-mix-blend-overlay',
      '-mix-blend-darken',
      '-mix-blend-lighten',
      '-mix-blend-color-dodge',
      '-mix-blend-color-burn',
      '-mix-blend-hard-light',
      '-mix-blend-soft-light',
      '-mix-blend-difference',
      '-mix-blend-exclusion',
      '-mix-blend-hue',
      '-mix-blend-saturation',
      '-mix-blend-color',
      '-mix-blend-luminosity',
      '-mix-blend-plus-lighter',
      'mix-blend-normal/foo',
      'mix-blend-multiply/foo',
      'mix-blend-screen/foo',
      'mix-blend-overlay/foo',
      'mix-blend-darken/foo',
      'mix-blend-lighten/foo',
      'mix-blend-color-dodge/foo',
      'mix-blend-color-burn/foo',
      'mix-blend-hard-light/foo',
      'mix-blend-soft-light/foo',
      'mix-blend-difference/foo',
      'mix-blend-exclusion/foo',
      'mix-blend-hue/foo',
      'mix-blend-saturation/foo',
      'mix-blend-color/foo',
      'mix-blend-luminosity/foo',
      'mix-blend-plus-darker/foo',
      'mix-blend-plus-lighter/foo',
    ]),
  ).toEqual('')
})

test('fill', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --fill-blue-500: #3b82f6;
        }
        @tailwind utilities;
      `,
      [
        'fill-red-500',
        'fill-red-500/50',
        'fill-red-500/2.25',
        'fill-red-500/2.5',
        'fill-red-500/2.75',
        'fill-red-500/[0.5]',
        'fill-red-500/[50%]',
        'fill-blue-500',
        'fill-current',
        'fill-current/50',
        'fill-current/[0.5]',
        'fill-current/[50%]',
        'fill-inherit',
        'fill-transparent',
        'fill-[#0088cc]',
        'fill-[#0088cc]/50',
        'fill-[#0088cc]/[0.5]',
        'fill-[#0088cc]/[50%]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --color-red-500: #ef4444;
      --fill-blue-500: #3b82f6;
    }

    .fill-\\[\\#0088cc\\] {
      fill: #08c;
    }

    .fill-\\[\\#0088cc\\]\\/50, .fill-\\[\\#0088cc\\]\\/\\[0\\.5\\], .fill-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      fill: oklab(59.9824% -.067 -.124 / .5);
    }

    .fill-blue-500 {
      fill: var(--fill-blue-500);
    }

    .fill-current, .fill-current\\/50 {
      fill: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .fill-current\\/50 {
        fill: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .fill-current\\/\\[0\\.5\\] {
      fill: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .fill-current\\/\\[0\\.5\\] {
        fill: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .fill-current\\/\\[50\\%\\] {
      fill: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .fill-current\\/\\[50\\%\\] {
        fill: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .fill-inherit {
      fill: inherit;
    }

    .fill-red-500 {
      fill: var(--color-red-500);
    }

    .fill-red-500\\/2\\.5 {
      fill: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .fill-red-500\\/2\\.5 {
        fill: color-mix(in oklab, var(--color-red-500) 2.5%, transparent);
      }
    }

    .fill-red-500\\/2\\.25 {
      fill: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .fill-red-500\\/2\\.25 {
        fill: color-mix(in oklab, var(--color-red-500) 2.25%, transparent);
      }
    }

    .fill-red-500\\/2\\.75 {
      fill: #ef444407;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .fill-red-500\\/2\\.75 {
        fill: color-mix(in oklab, var(--color-red-500) 2.75%, transparent);
      }
    }

    .fill-red-500\\/50 {
      fill: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .fill-red-500\\/50 {
        fill: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .fill-red-500\\/\\[0\\.5\\] {
      fill: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .fill-red-500\\/\\[0\\.5\\] {
        fill: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .fill-red-500\\/\\[50\\%\\] {
      fill: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .fill-red-500\\/\\[50\\%\\] {
        fill: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .fill-transparent {
      fill: #0000;
    }"
  `)
  expect(
    await run([
      'fill',
      'fill-unknown',
      '-fill-red-500',
      '-fill-red-500/50',
      '-fill-red-500/[0.5]',
      '-fill-red-500/[50%]',
      '-fill-current',
      '-fill-current/50',
      '-fill-current/[0.5]',
      '-fill-current/[50%]',
      '-fill-inherit',
      '-fill-transparent',
      '-fill-[#0088cc]',
      '-fill-[#0088cc]/50',
      '-fill-[#0088cc]/[0.5]',
      '-fill-[#0088cc]/[50%]',
    ]),
  ).toEqual('')
})

test('stroke', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --stroke-blue-500: #3b82f6;
        }
        @tailwind utilities;
      `,
      [
        // Color
        'stroke-red-500',
        'stroke-red-500/50',
        'stroke-red-500/2.25',
        'stroke-red-500/2.5',
        'stroke-red-500/2.75',
        'stroke-red-500/[0.5]',
        'stroke-red-500/[50%]',
        'stroke-blue-500',
        'stroke-current',
        'stroke-current/50',
        'stroke-current/[0.5]',
        'stroke-current/[50%]',
        'stroke-inherit',
        'stroke-transparent',
        'stroke-[#0088cc]',
        'stroke-[#0088cc]/50',
        'stroke-[#0088cc]/[0.5]',
        'stroke-[#0088cc]/[50%]',
        'stroke-[var(--my-color)]',
        'stroke-[var(--my-color)]/50',
        'stroke-[var(--my-color)]/[0.5]',
        'stroke-[var(--my-color)]/[50%]',
        'stroke-[color:var(--my-color)]',
        'stroke-[color:var(--my-color)]/50',
        'stroke-[color:var(--my-color)]/[0.5]',
        'stroke-[color:var(--my-color)]/[50%]',
        'stroke-none',

        // Width
        'stroke-0',
        'stroke-1',
        'stroke-2',
        'stroke-[1.5]',
        'stroke-[12px]',
        'stroke-[50%]',
        'stroke-[number:var(--my-width)]',
        'stroke-[length:var(--my-width)]',
        'stroke-[percentage:var(--my-width)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --color-red-500: #ef4444;
      --stroke-blue-500: #3b82f6;
    }

    .stroke-\\[\\#0088cc\\] {
      stroke: #08c;
    }

    .stroke-\\[\\#0088cc\\]\\/50, .stroke-\\[\\#0088cc\\]\\/\\[0\\.5\\], .stroke-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      stroke: oklab(59.9824% -.067 -.124 / .5);
    }

    .stroke-\\[color\\:var\\(--my-color\\)\\], .stroke-\\[color\\:var\\(--my-color\\)\\]\\/50 {
      stroke: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-\\[color\\:var\\(--my-color\\)\\]\\/50 {
        stroke: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .stroke-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      stroke: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        stroke: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .stroke-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      stroke: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        stroke: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .stroke-\\[var\\(--my-color\\)\\], .stroke-\\[var\\(--my-color\\)\\]\\/50 {
      stroke: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-\\[var\\(--my-color\\)\\]\\/50 {
        stroke: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .stroke-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      stroke: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        stroke: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .stroke-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      stroke: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        stroke: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .stroke-blue-500 {
      stroke: var(--stroke-blue-500);
    }

    .stroke-current, .stroke-current\\/50 {
      stroke: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-current\\/50 {
        stroke: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .stroke-current\\/\\[0\\.5\\] {
      stroke: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-current\\/\\[0\\.5\\] {
        stroke: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .stroke-current\\/\\[50\\%\\] {
      stroke: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-current\\/\\[50\\%\\] {
        stroke: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .stroke-inherit {
      stroke: inherit;
    }

    .stroke-none {
      stroke: none;
    }

    .stroke-red-500 {
      stroke: var(--color-red-500);
    }

    .stroke-red-500\\/2\\.5 {
      stroke: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-red-500\\/2\\.5 {
        stroke: color-mix(in oklab, var(--color-red-500) 2.5%, transparent);
      }
    }

    .stroke-red-500\\/2\\.25 {
      stroke: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-red-500\\/2\\.25 {
        stroke: color-mix(in oklab, var(--color-red-500) 2.25%, transparent);
      }
    }

    .stroke-red-500\\/2\\.75 {
      stroke: #ef444407;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-red-500\\/2\\.75 {
        stroke: color-mix(in oklab, var(--color-red-500) 2.75%, transparent);
      }
    }

    .stroke-red-500\\/50 {
      stroke: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-red-500\\/50 {
        stroke: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .stroke-red-500\\/\\[0\\.5\\] {
      stroke: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-red-500\\/\\[0\\.5\\] {
        stroke: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .stroke-red-500\\/\\[50\\%\\] {
      stroke: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .stroke-red-500\\/\\[50\\%\\] {
        stroke: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .stroke-transparent {
      stroke: #0000;
    }

    .stroke-0 {
      stroke-width: 0;
    }

    .stroke-1 {
      stroke-width: 1px;
    }

    .stroke-2 {
      stroke-width: 2px;
    }

    .stroke-\\[1\\.5\\] {
      stroke-width: 1.5px;
    }

    .stroke-\\[12px\\] {
      stroke-width: 12px;
    }

    .stroke-\\[50\\%\\] {
      stroke-width: 50%;
    }

    .stroke-\\[length\\:var\\(--my-width\\)\\], .stroke-\\[number\\:var\\(--my-width\\)\\], .stroke-\\[percentage\\:var\\(--my-width\\)\\] {
      stroke-width: var(--my-width);
    }"
  `)
  expect(
    await run([
      'stroke',
      'stroke-unknown',

      // Color
      '-stroke-red-500',
      '-stroke-red-500/50',
      '-stroke-red-500/[0.5]',
      '-stroke-red-500/[50%]',
      '-stroke-current',
      '-stroke-current/50',
      '-stroke-current/[0.5]',
      '-stroke-current/[50%]',
      '-stroke-inherit',
      '-stroke-transparent',
      '-stroke-[#0088cc]',
      '-stroke-[#0088cc]/50',
      '-stroke-[#0088cc]/[0.5]',
      '-stroke-[#0088cc]/[50%]',

      // Width
      '-stroke-0',
      'stroke--1',
    ]),
  ).toEqual('')
})

test('object', async () => {
  expect(
    await run([
      // object-fit
      'object-contain',
      'object-cover',
      'object-fill',
      'object-none',
      'object-scale-down',

      // object-position
      'object-[var(--value)]',
      'object-top',
      'object-top-left',
      'object-top-right',
      'object-bottom',
      'object-bottom-left',
      'object-bottom-right',
      'object-left',
      'object-right',
      'object-center',

      // Legacy versions in v4.0 and earlier
      'object-left-bottom',
      'object-left-top',
      'object-right-bottom',
      'object-right-top',
    ]),
  ).toMatchInlineSnapshot(`
    ".object-contain {
      object-fit: contain;
    }

    .object-cover {
      object-fit: cover;
    }

    .object-fill {
      object-fit: fill;
    }

    .object-none {
      object-fit: none;
    }

    .object-scale-down {
      object-fit: scale-down;
    }

    .object-\\[var\\(--value\\)\\] {
      object-position: var(--value);
    }

    .object-bottom {
      object-position: bottom;
    }

    .object-bottom-left {
      object-position: left bottom;
    }

    .object-bottom-right {
      object-position: right bottom;
    }

    .object-center {
      object-position: center;
    }

    .object-left {
      object-position: left;
    }

    .object-left-bottom {
      object-position: left bottom;
    }

    .object-left-top {
      object-position: left top;
    }

    .object-right {
      object-position: right;
    }

    .object-right-bottom {
      object-position: right bottom;
    }

    .object-right-top {
      object-position: right top;
    }

    .object-top {
      object-position: top;
    }

    .object-top-left {
      object-position: left top;
    }

    .object-top-right {
      object-position: right top;
    }"
  `)
  expect(
    await run([
      'object',
      // object-fit
      '-object-contain',
      '-object-cover',
      '-object-fill',
      '-object-none',
      '-object-scale-down',

      // object-position
      '-object-[var(--value)]',
      '-object-bottom',

      'object-contain/foo',
      'object-cover/foo',
      'object-fill/foo',
      'object-none/foo',
      'object-scale-down/foo',
      'object-[var(--value)]/foo',
      'object-bottom/foo',
      'object-center/foo',
      'object-left/foo',
      'object-left-bottom/foo',
      'object-left-top/foo',
      'object-right/foo',
      'object-right-bottom/foo',
      'object-right-top/foo',
      'object-top/foo',
    ]),
  ).toEqual('')
})

test('p', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      ['p-1', 'p-4', 'p-99', 'p-big', 'p-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .p-1 {
      padding: calc(var(--spacing) * 1);
    }

    .p-4 {
      padding: calc(var(--spacing) * 4);
    }

    .p-99 {
      padding: calc(var(--spacing) * 99);
    }

    .p-\\[4px\\] {
      padding: 4px;
    }

    .p-big {
      padding: var(--spacing-big);
    }"
  `)
  expect(await run(['p', '-p-4', '-p-[4px]', 'p-4/foo', 'p-[4px]/foo'])).toEqual('')
})

test('px', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      ['px-1', 'px-99', 'px-2.5', 'px-big', 'px-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .px-1 {
      padding-inline: calc(var(--spacing) * 1);
    }

    .px-2\\.5 {
      padding-inline: calc(var(--spacing) * 2.5);
    }

    .px-99 {
      padding-inline: calc(var(--spacing) * 99);
    }

    .px-\\[4px\\] {
      padding-inline: 4px;
    }

    .px-big {
      padding-inline: var(--spacing-big);
    }"
  `)
  expect(await run(['px', '-px-4', '-px-[4px]', 'px-4/foo', 'px-[4px]/foo'])).toEqual('')
})

test('py', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      ['py-1', 'py-4', 'py-99', 'py-big', 'py-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .py-1 {
      padding-block: calc(var(--spacing) * 1);
    }

    .py-4 {
      padding-block: calc(var(--spacing) * 4);
    }

    .py-99 {
      padding-block: calc(var(--spacing) * 99);
    }

    .py-\\[4px\\] {
      padding-block: 4px;
    }

    .py-big {
      padding-block: var(--spacing-big);
    }"
  `)
  expect(await run(['py', '-py-4', '-py-[4px]', 'py-4/foo', 'py-[4px]/foo'])).toEqual('')
})

test('pt', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      ['pt-1', 'pt-4', 'pt-99', 'pt-big', 'pt-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .pt-1 {
      padding-top: calc(var(--spacing) * 1);
    }

    .pt-4 {
      padding-top: calc(var(--spacing) * 4);
    }

    .pt-99 {
      padding-top: calc(var(--spacing) * 99);
    }

    .pt-\\[4px\\] {
      padding-top: 4px;
    }

    .pt-big {
      padding-top: var(--spacing-big);
    }"
  `)
  expect(await run(['pt', '-pt-4', '-pt-[4px]', 'pt-4/foo', 'pt-[4px]/foo'])).toEqual('')
})

test('ps', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      ['ps-1', 'ps-4', 'ps-99', 'ps-big', 'ps-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .ps-1 {
      padding-inline-start: calc(var(--spacing) * 1);
    }

    .ps-4 {
      padding-inline-start: calc(var(--spacing) * 4);
    }

    .ps-99 {
      padding-inline-start: calc(var(--spacing) * 99);
    }

    .ps-\\[4px\\] {
      padding-inline-start: 4px;
    }

    .ps-big {
      padding-inline-start: var(--spacing-big);
    }"
  `)
  expect(await run(['ps', '-ps-4', '-ps-[4px]', 'ps-4/foo', 'ps-[4px]/foo'])).toEqual('')
})

test('pe', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      ['pe-1', 'pe-4', 'pe-99', 'pe-big', 'pe-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .pe-1 {
      padding-inline-end: calc(var(--spacing) * 1);
    }

    .pe-4 {
      padding-inline-end: calc(var(--spacing) * 4);
    }

    .pe-99 {
      padding-inline-end: calc(var(--spacing) * 99);
    }

    .pe-\\[4px\\] {
      padding-inline-end: 4px;
    }

    .pe-big {
      padding-inline-end: var(--spacing-big);
    }"
  `)
  expect(await run(['pe', '-pe-4', '-pe-[4px]', 'pe-4/foo', 'pe-[4px]/foo'])).toEqual('')
})

test('pr', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      ['pr-1', 'pr-4', 'pr-99', 'pr-big', 'pr-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .pr-1 {
      padding-right: calc(var(--spacing) * 1);
    }

    .pr-4 {
      padding-right: calc(var(--spacing) * 4);
    }

    .pr-99 {
      padding-right: calc(var(--spacing) * 99);
    }

    .pr-\\[4px\\] {
      padding-right: 4px;
    }

    .pr-big {
      padding-right: var(--spacing-big);
    }"
  `)
  expect(await run(['pr', '-pr-4', '-pr-[4px]', 'pr-4/foo', 'pr-[4px]/foo'])).toEqual('')
})

test('pb', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      ['pb-1', 'pb-4', 'pb-99', 'pb-big', 'pb-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .pb-1 {
      padding-bottom: calc(var(--spacing) * 1);
    }

    .pb-4 {
      padding-bottom: calc(var(--spacing) * 4);
    }

    .pb-99 {
      padding-bottom: calc(var(--spacing) * 99);
    }

    .pb-\\[4px\\] {
      padding-bottom: 4px;
    }

    .pb-big {
      padding-bottom: var(--spacing-big);
    }"
  `)
  expect(await run(['pb', '-pb-4', '-pb-[4px]', 'pb-4/foo', 'pb-[4px]/foo'])).toEqual('')
})

test('pl', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --spacing-big: 100rem;
        }
        @tailwind utilities;
      `,
      ['pl-1', 'pl-4', 'pl-99', 'pl-big', 'pl-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --spacing-big: 100rem;
    }

    .pl-1 {
      padding-left: calc(var(--spacing) * 1);
    }

    .pl-4 {
      padding-left: calc(var(--spacing) * 4);
    }

    .pl-99 {
      padding-left: calc(var(--spacing) * 99);
    }

    .pl-\\[4px\\] {
      padding-left: 4px;
    }

    .pl-big {
      padding-left: var(--spacing-big);
    }"
  `)
  expect(await run(['pl', '-pl-4', '-pl-[4px]', 'pl-4/foo', 'pl-[4px]/foo'])).toEqual('')
})

test('text-align', async () => {
  expect(
    await run(['text-left', 'text-center', 'text-right', 'text-justify', 'text-start', 'text-end']),
  ).toMatchInlineSnapshot(`
    ".text-center {
      text-align: center;
    }

    .text-end {
      text-align: end;
    }

    .text-justify {
      text-align: justify;
    }

    .text-left {
      text-align: left;
    }

    .text-right {
      text-align: right;
    }

    .text-start {
      text-align: start;
    }"
  `)
  expect(
    await run([
      '-text-left',
      '-text-center',
      '-text-right',
      '-text-justify',
      '-text-start',
      '-text-end',
      'text-left/foo',
      'text-center/foo',
      'text-right/foo',
      'text-justify/foo',
      'text-start/foo',
      'text-end/foo',
    ]),
  ).toEqual('')
})

test('indent', async () => {
  expect(await run(['indent-[4px]', '-indent-[4px]'])).toMatchInlineSnapshot(`
    ".-indent-\\[4px\\] {
      text-indent: -4px;
    }

    .indent-\\[4px\\] {
      text-indent: 4px;
    }"
  `)
  expect(await run(['indent', 'indent-[4px]/foo', '-indent-[4px]/foo'])).toEqual('')
})

test('align', async () => {
  expect(
    await run([
      'align-baseline',
      'align-top',
      'align-middle',
      'align-bottom',
      'align-text-top',
      'align-text-bottom',
      'align-sub',
      'align-super',

      'align-[var(--value)]',
    ]),
  ).toMatchInlineSnapshot(`
    ".align-\\[var\\(--value\\)\\] {
      vertical-align: var(--value);
    }

    .align-baseline {
      vertical-align: baseline;
    }

    .align-bottom {
      vertical-align: bottom;
    }

    .align-middle {
      vertical-align: middle;
    }

    .align-sub {
      vertical-align: sub;
    }

    .align-super {
      vertical-align: super;
    }

    .align-text-bottom {
      vertical-align: text-bottom;
    }

    .align-text-top {
      vertical-align: text-top;
    }

    .align-top {
      vertical-align: top;
    }"
  `)
  expect(
    await run([
      'align',
      '-align-baseline',
      '-align-top',
      '-align-middle',
      '-align-bottom',
      '-align-text-top',
      '-align-text-bottom',
      '-align-sub',
      '-align-super',

      '-align-[var(--value)]',

      'align-baseline/foo',
      'align-top/foo',
      'align-middle/foo',
      'align-bottom/foo',
      'align-text-top/foo',
      'align-text-bottom/foo',
      'align-sub/foo',
      'align-super/foo',
      'align-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('font', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --font-sans:
            ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
            'Segoe UI Symbol', 'Noto Color Emoji';
          --font-weight-bold: 650;
        }
        @tailwind utilities;
      `,
      [
        // font-family
        'font-sans',
        'font-["arial_rounded"]',
        'font-[ui-sans-serif]',
        'font-[var(--my-family)]',
        'font-[family-name:var(--my-family)]',
        'font-[generic-name:var(--my-family)]',

        // font-weight
        'font-bold',
        'font-[100]',
        'font-[number:var(--my-weight)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-font-weight: initial;
        }
      }
    }

    :root, :host {
      --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      --font-weight-bold: 650;
    }

    .font-\\[\\"arial_rounded\\"\\] {
      font-family: arial rounded;
    }

    .font-\\[family-name\\:var\\(--my-family\\)\\], .font-\\[generic-name\\:var\\(--my-family\\)\\] {
      font-family: var(--my-family);
    }

    .font-\\[ui-sans-serif\\] {
      font-family: ui-sans-serif;
    }

    .font-sans {
      font-family: var(--font-sans);
    }

    .font-\\[100\\] {
      --tw-font-weight: 100;
      font-weight: 100;
    }

    .font-\\[number\\:var\\(--my-weight\\)\\] {
      --tw-font-weight: var(--my-weight);
      font-weight: var(--my-weight);
    }

    .font-\\[var\\(--my-family\\)\\] {
      --tw-font-weight: var(--my-family);
      font-weight: var(--my-family);
    }

    .font-bold {
      --tw-font-weight: var(--font-weight-bold);
      font-weight: var(--font-weight-bold);
    }

    @property --tw-font-weight {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme reference {
          --font-sans:
            ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
            'Segoe UI Symbol', 'Noto Color Emoji';
          --font-weight-bold: 650;
        }
        @tailwind utilities;
      `,
      [
        'font',
        // font-family
        '-font-sans',

        // font-weight
        '-font-bold',

        'font-weight-bold',
        'font-sans/foo',
        'font-["arial_rounded"]/foo',
        'font-[ui-sans-serif]/foo',
        'font-[var(--my-family)]/foo',
        'font-[family-name:var(--my-family)]/foo',
        'font-[generic-name:var(--my-family)]/foo',
        'font-bold/foo',
        'font-[100]/foo',
        'font-[number:var(--my-weight)]/foo',
      ],
    ),
  ).toEqual('')
})

test('text-transform', async () => {
  expect(await run(['uppercase', 'lowercase', 'capitalize', 'normal-case'])).toMatchInlineSnapshot(`
    ".capitalize {
      text-transform: capitalize;
    }

    .lowercase {
      text-transform: lowercase;
    }

    .normal-case {
      text-transform: none;
    }

    .uppercase {
      text-transform: uppercase;
    }"
  `)
  expect(
    await run([
      '-uppercase',
      '-lowercase',
      '-capitalize',
      '-normal-case',
      'uppercase/foo',
      'lowercase/foo',
      'capitalize/foo',
      'normal-case/foo',
    ]),
  ).toEqual('')
})

test('font-style', async () => {
  expect(await run(['italic', 'not-italic'])).toMatchInlineSnapshot(`
    ".italic {
      font-style: italic;
    }

    .not-italic {
      font-style: normal;
    }"
  `)
  expect(await run(['-italic', '-not-italic', 'italic/foo', 'not-italic/foo'])).toEqual('')
})

test('font-stretch', async () => {
  expect(await run(['font-stretch-ultra-expanded', 'font-stretch-50%', 'font-stretch-200%']))
    .toMatchInlineSnapshot(`
      ".font-stretch-50\\% {
        font-stretch: 50%;
      }

      .font-stretch-200\\% {
        font-stretch: 200%;
      }

      .font-stretch-ultra-expanded {
        font-stretch: ultra-expanded;
      }"
    `)
  expect(
    await run([
      'font-stretch',
      'font-stretch-20%',
      'font-stretch-50',
      'font-stretch-400%',
      'font-stretch-50.5%',
      'font-stretch-potato',
      'font-stretch-ultra-expanded/foo',
      'font-stretch-50%/foo',
      'font-stretch-200%/foo',
    ]),
  ).toEqual('')
})

test('text-decoration-line', async () => {
  expect(await run(['underline', 'overline', 'line-through', 'no-underline']))
    .toMatchInlineSnapshot(`
      ".line-through {
        text-decoration-line: line-through;
      }

      .no-underline {
        text-decoration-line: none;
      }

      .overline {
        text-decoration-line: overline;
      }

      .underline {
        text-decoration-line: underline;
      }"
    `)
  expect(
    await run([
      '-underline',
      '-overline',
      '-line-through',
      '-no-underline',
      'underline/foo',
      'overline/foo',
      'line-through/foo',
      'no-underline/foo',
    ]),
  ).toEqual('')
})

test('placeholder', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        'placeholder-red-500',
        'placeholder-red-500/50',
        'placeholder-red-500/2.25',
        'placeholder-red-500/2.5',
        'placeholder-red-500/2.75',
        'placeholder-red-500/[0.5]',
        'placeholder-red-500/[50%]',
        'placeholder-current',
        'placeholder-current/50',
        'placeholder-current/[0.5]',
        'placeholder-current/[50%]',
        'placeholder-inherit',
        'placeholder-transparent',
        'placeholder-[#0088cc]',
        'placeholder-[#0088cc]/50',
        'placeholder-[#0088cc]/[0.5]',
        'placeholder-[#0088cc]/[50%]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --color-red-500: #ef4444;
    }

    .placeholder-\\[\\#0088cc\\]::placeholder {
      color: #08c;
    }

    .placeholder-\\[\\#0088cc\\]\\/50::placeholder, .placeholder-\\[\\#0088cc\\]\\/\\[0\\.5\\]::placeholder, .placeholder-\\[\\#0088cc\\]\\/\\[50\\%\\]::placeholder {
      color: oklab(59.9824% -.067 -.124 / .5);
    }

    .placeholder-current::placeholder, .placeholder-current\\/50::placeholder {
      color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .placeholder-current\\/50::placeholder {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .placeholder-current\\/\\[0\\.5\\]::placeholder {
      color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .placeholder-current\\/\\[0\\.5\\]::placeholder {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .placeholder-current\\/\\[50\\%\\]::placeholder {
      color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .placeholder-current\\/\\[50\\%\\]::placeholder {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .placeholder-inherit::placeholder {
      color: inherit;
    }

    .placeholder-red-500::placeholder {
      color: var(--color-red-500);
    }

    .placeholder-red-500\\/2\\.5::placeholder {
      color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .placeholder-red-500\\/2\\.5::placeholder {
        color: color-mix(in oklab, var(--color-red-500) 2.5%, transparent);
      }
    }

    .placeholder-red-500\\/2\\.25::placeholder {
      color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .placeholder-red-500\\/2\\.25::placeholder {
        color: color-mix(in oklab, var(--color-red-500) 2.25%, transparent);
      }
    }

    .placeholder-red-500\\/2\\.75::placeholder {
      color: #ef444407;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .placeholder-red-500\\/2\\.75::placeholder {
        color: color-mix(in oklab, var(--color-red-500) 2.75%, transparent);
      }
    }

    .placeholder-red-500\\/50::placeholder {
      color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .placeholder-red-500\\/50::placeholder {
        color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .placeholder-red-500\\/\\[0\\.5\\]::placeholder {
      color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .placeholder-red-500\\/\\[0\\.5\\]::placeholder {
        color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .placeholder-red-500\\/\\[50\\%\\]::placeholder {
      color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .placeholder-red-500\\/\\[50\\%\\]::placeholder {
        color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .placeholder-transparent::placeholder {
      color: #0000;
    }"
  `)
  expect(
    await run([
      'placeholder',
      '-placeholder-red-500',
      '-placeholder-red-500/50',
      '-placeholder-red-500/[0.5]',
      '-placeholder-red-500/[50%]',
      '-placeholder-current',
      '-placeholder-current/50',
      '-placeholder-current/[0.5]',
      '-placeholder-current/[50%]',
      '-placeholder-inherit',
      '-placeholder-transparent',
      '-placeholder-[#0088cc]',
      '-placeholder-[#0088cc]/50',
      '-placeholder-[#0088cc]/[0.5]',
      '-placeholder-[#0088cc]/[50%]',
    ]),
  ).toEqual('')
})

test('decoration', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --text-decoration-color-blue-500: #3b82f6;
        }
        @tailwind utilities;
      `,
      [
        // text-decoration-color
        'decoration-red-500',
        'decoration-red-500/50',
        'decoration-red-500/[0.5]',
        'decoration-red-500/[50%]',
        'decoration-blue-500',
        'decoration-current',
        'decoration-current/50',
        'decoration-current/[0.5]',
        'decoration-current/[50%]',
        'decoration-inherit',
        'decoration-transparent',
        'decoration-[#0088cc]',
        'decoration-[#0088cc]/50',
        'decoration-[#0088cc]/[0.5]',
        'decoration-[#0088cc]/[50%]',
        'decoration-[var(--my-color)]',
        'decoration-[var(--my-color)]/50',
        'decoration-[var(--my-color)]/[0.5]',
        'decoration-[var(--my-color)]/[50%]',
        'decoration-[color:var(--my-color)]',
        'decoration-[color:var(--my-color)]/50',
        'decoration-[color:var(--my-color)]/[0.5]',
        'decoration-[color:var(--my-color)]/[50%]',

        // text-decoration-style
        'decoration-solid',
        'decoration-double',
        'decoration-dotted',
        'decoration-dashed',
        'decoration-wavy',

        // text-decoration-thickness
        'decoration-auto',
        'decoration-from-font',
        'decoration-0',
        'decoration-1',
        'decoration-2',
        'decoration-4',
        'decoration-123',
        'decoration-[12px]',
        'decoration-[50%]',
        'decoration-[length:var(--my-thickness)]',
        'decoration-[percentage:var(--my-thickness)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --color-red-500: #ef4444;
      --text-decoration-color-blue-500: #3b82f6;
    }

    .decoration-\\[\\#0088cc\\] {
      text-decoration-color: #08c;
    }

    .decoration-\\[\\#0088cc\\]\\/50, .decoration-\\[\\#0088cc\\]\\/\\[0\\.5\\], .decoration-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      text-decoration-color: oklab(59.9824% -.067 -.124 / .5);
    }

    .decoration-\\[color\\:var\\(--my-color\\)\\], .decoration-\\[color\\:var\\(--my-color\\)\\]\\/50 {
      -webkit-text-decoration-color: var(--my-color);
      -webkit-text-decoration-color: var(--my-color);
      text-decoration-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .decoration-\\[color\\:var\\(--my-color\\)\\]\\/50 {
        -webkit-text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        -webkit-text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .decoration-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      -webkit-text-decoration-color: var(--my-color);
      -webkit-text-decoration-color: var(--my-color);
      text-decoration-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .decoration-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        -webkit-text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        -webkit-text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .decoration-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      -webkit-text-decoration-color: var(--my-color);
      -webkit-text-decoration-color: var(--my-color);
      text-decoration-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .decoration-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        -webkit-text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        -webkit-text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .decoration-\\[var\\(--my-color\\)\\], .decoration-\\[var\\(--my-color\\)\\]\\/50 {
      -webkit-text-decoration-color: var(--my-color);
      -webkit-text-decoration-color: var(--my-color);
      text-decoration-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .decoration-\\[var\\(--my-color\\)\\]\\/50 {
        -webkit-text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        -webkit-text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .decoration-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      -webkit-text-decoration-color: var(--my-color);
      -webkit-text-decoration-color: var(--my-color);
      text-decoration-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .decoration-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        -webkit-text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        -webkit-text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .decoration-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      -webkit-text-decoration-color: var(--my-color);
      -webkit-text-decoration-color: var(--my-color);
      text-decoration-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .decoration-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        -webkit-text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        -webkit-text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        text-decoration-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .decoration-blue-500 {
      -webkit-text-decoration-color: var(--text-decoration-color-blue-500);
      -webkit-text-decoration-color: var(--text-decoration-color-blue-500);
      text-decoration-color: var(--text-decoration-color-blue-500);
    }

    .decoration-current, .decoration-current\\/50 {
      text-decoration-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .decoration-current\\/50 {
        -webkit-text-decoration-color: color-mix(in oklab, currentcolor 50%, transparent);
        -webkit-text-decoration-color: color-mix(in oklab, currentcolor 50%, transparent);
        text-decoration-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .decoration-current\\/\\[0\\.5\\] {
      text-decoration-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .decoration-current\\/\\[0\\.5\\] {
        -webkit-text-decoration-color: color-mix(in oklab, currentcolor 50%, transparent);
        -webkit-text-decoration-color: color-mix(in oklab, currentcolor 50%, transparent);
        text-decoration-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .decoration-current\\/\\[50\\%\\] {
      text-decoration-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .decoration-current\\/\\[50\\%\\] {
        -webkit-text-decoration-color: color-mix(in oklab, currentcolor 50%, transparent);
        -webkit-text-decoration-color: color-mix(in oklab, currentcolor 50%, transparent);
        text-decoration-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .decoration-inherit {
      -webkit-text-decoration-color: inherit;
      -webkit-text-decoration-color: inherit;
      text-decoration-color: inherit;
    }

    .decoration-red-500 {
      -webkit-text-decoration-color: var(--color-red-500);
      -webkit-text-decoration-color: var(--color-red-500);
      text-decoration-color: var(--color-red-500);
    }

    .decoration-red-500\\/50 {
      text-decoration-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .decoration-red-500\\/50 {
        -webkit-text-decoration-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
        -webkit-text-decoration-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
        text-decoration-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .decoration-red-500\\/\\[0\\.5\\] {
      text-decoration-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .decoration-red-500\\/\\[0\\.5\\] {
        -webkit-text-decoration-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
        -webkit-text-decoration-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
        text-decoration-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .decoration-red-500\\/\\[50\\%\\] {
      text-decoration-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .decoration-red-500\\/\\[50\\%\\] {
        -webkit-text-decoration-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
        -webkit-text-decoration-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
        text-decoration-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .decoration-transparent {
      text-decoration-color: #0000;
    }

    .decoration-dashed {
      text-decoration-style: dashed;
    }

    .decoration-dotted {
      text-decoration-style: dotted;
    }

    .decoration-double {
      text-decoration-style: double;
    }

    .decoration-solid {
      text-decoration-style: solid;
    }

    .decoration-wavy {
      text-decoration-style: wavy;
    }

    .decoration-0 {
      text-decoration-thickness: 0;
    }

    .decoration-1 {
      text-decoration-thickness: 1px;
    }

    .decoration-2 {
      text-decoration-thickness: 2px;
    }

    .decoration-4 {
      text-decoration-thickness: 4px;
    }

    .decoration-123 {
      text-decoration-thickness: 123px;
    }

    .decoration-\\[12px\\] {
      text-decoration-thickness: 12px;
    }

    .decoration-\\[50\\%\\] {
      text-decoration-thickness: .5em;
    }

    .decoration-\\[length\\:var\\(--my-thickness\\)\\], .decoration-\\[percentage\\:var\\(--my-thickness\\)\\] {
      text-decoration-thickness: var(--my-thickness);
    }

    .decoration-auto {
      text-decoration-thickness: auto;
    }

    .decoration-from-font {
      text-decoration-thickness: from-font;
    }"
  `)
  expect(
    await run([
      'decoration',
      // text-decoration-color
      '-decoration-red-500',
      '-decoration-red-500/50',
      '-decoration-red-500/[0.5]',
      '-decoration-red-500/[50%]',
      '-decoration-current',
      '-decoration-current/50',
      '-decoration-current/[0.5]',
      '-decoration-current/[50%]',
      '-decoration-transparent',
      '-decoration-[#0088cc]',
      '-decoration-[#0088cc]/50',
      '-decoration-[#0088cc]/[0.5]',
      '-decoration-[#0088cc]/[50%]',

      // text-decoration-style
      '-decoration-solid',
      '-decoration-double',
      '-decoration-dotted',
      '-decoration-dashed',
      '-decoration-wavy',

      // text-decoration-thickness
      'decoration--2',
      '-decoration-auto',
      '-decoration-from-font',
      '-decoration-0',
      '-decoration-1',
      '-decoration-2',
      '-decoration-4',
      '-decoration-123',

      'decoration-solid/foo',
      'decoration-double/foo',
      'decoration-dotted/foo',
      'decoration-dashed/foo',
      'decoration-wavy/foo',
      'decoration-auto/foo',
      'decoration-from-font/foo',
      'decoration-0/foo',
      'decoration-1/foo',
      'decoration-2/foo',
      'decoration-4/foo',
      'decoration-123/foo',
      'decoration-[12px]/foo',
      'decoration-[50%]/foo',
      'decoration-[length:var(--my-thickness)]/foo',
      'decoration-[percentage:var(--my-thickness)]/foo',
    ]),
  ).toEqual('')
})

test('animate', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --animate-spin: spin 1s linear infinite;
        }
        @tailwind utilities;
      `,
      ['animate-spin', 'animate-none', 'animate-[bounce_1s_infinite]', 'animate-not-found'],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --animate-spin: spin 1s linear infinite;
    }

    .animate-\\[bounce_1s_infinite\\] {
      animation: 1s infinite bounce;
    }

    .animate-none {
      animation: none;
    }

    .animate-spin {
      animation: var(--animate-spin);
    }"
  `)
  expect(
    await run([
      'animate',
      '-animate-spin',
      '-animate-none',
      '-animate-[bounce_1s_infinite]',
      '-animate-not-found',
      'animate-spin/foo',
      'animate-none/foo',
      'animate-[bounce_1s_infinite]/foo',
      'animate-not-found/foo',
    ]),
  ).toEqual('')
})

test('filter', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --blur-xl: 24px;
          --color-red-500: #ef4444;
          --drop-shadow: 0 1px 1px rgb(0 0 0 / 0.05);
          --drop-shadow-xl: 0 9px 7px rgb(0 0 0 / 0.1);
        }
        @theme inline {
          --drop-shadow-multi: 0 1px 1px rgb(0 0 0 / 0.05), 0 9px 7px rgb(0 0 0 / 0.1);
        }
        @tailwind utilities;
      `,
      [
        'filter',
        'filter-none',
        'filter-[var(--value)]',
        'blur-xl',
        'blur-none',
        'blur-[4px]',
        'brightness-50',
        'brightness-[1.23]',
        'contrast-50',
        'contrast-[1.23]',
        'grayscale',
        'grayscale-0',
        'grayscale-[var(--value)]',
        'hue-rotate-15',
        'hue-rotate-[45deg]',
        '-hue-rotate-15',
        '-hue-rotate-[45deg]',
        'invert',
        'invert-0',
        'invert-[var(--value)]',
        'drop-shadow',
        'drop-shadow/25',
        'drop-shadow-xl',
        'drop-shadow-multi',
        'drop-shadow-[0_0_red]',
        'drop-shadow-red-500',
        'drop-shadow-red-500/50',
        'drop-shadow-none',
        'drop-shadow-inherit',
        'saturate-0',
        'saturate-[1.75]',
        'saturate-[var(--value)]',
        'sepia',
        'sepia-0',
        'sepia-[50%]',
        'sepia-[var(--value)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-blur: initial;
          --tw-brightness: initial;
          --tw-contrast: initial;
          --tw-grayscale: initial;
          --tw-hue-rotate: initial;
          --tw-invert: initial;
          --tw-opacity: initial;
          --tw-saturate: initial;
          --tw-sepia: initial;
          --tw-drop-shadow: initial;
          --tw-drop-shadow-color: initial;
          --tw-drop-shadow-alpha: 100%;
          --tw-drop-shadow-size: initial;
        }
      }
    }

    :root, :host {
      --blur-xl: 24px;
      --color-red-500: #ef4444;
      --drop-shadow: 0 1px 1px #0000000d;
      --drop-shadow-xl: 0 9px 7px #0000001a;
    }

    .blur-\\[4px\\] {
      --tw-blur: blur(4px);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .blur-none {
      --tw-blur: ;
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .blur-xl {
      --tw-blur: blur(var(--blur-xl));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .brightness-50 {
      --tw-brightness: brightness(50%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .brightness-\\[1\\.23\\] {
      --tw-brightness: brightness(1.23);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .contrast-50 {
      --tw-contrast: contrast(50%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .contrast-\\[1\\.23\\] {
      --tw-contrast: contrast(1.23);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .drop-shadow\\/25 {
      --tw-drop-shadow-alpha: 25%;
      --tw-drop-shadow-size: drop-shadow(0 1px 1px var(--tw-drop-shadow-color, oklab(0% 0 0 / .25)));
      --tw-drop-shadow: drop-shadow(var(--drop-shadow));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .drop-shadow {
      --tw-drop-shadow-size: drop-shadow(0 1px 1px var(--tw-drop-shadow-color, #0000000d));
      --tw-drop-shadow: drop-shadow(var(--drop-shadow));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .drop-shadow-\\[0_0_red\\] {
      --tw-drop-shadow-size: drop-shadow(0 0 var(--tw-drop-shadow-color, red));
      --tw-drop-shadow: var(--tw-drop-shadow-size);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .drop-shadow-multi {
      --tw-drop-shadow-size: drop-shadow(0 1px 1px var(--tw-drop-shadow-color, #0000000d)) drop-shadow(0 9px 7px var(--tw-drop-shadow-color, #0000001a));
      --tw-drop-shadow: drop-shadow(0 1px 1px #0000000d) drop-shadow(0 9px 7px #0000001a);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .drop-shadow-xl {
      --tw-drop-shadow-size: drop-shadow(0 9px 7px var(--tw-drop-shadow-color, #0000001a));
      --tw-drop-shadow: drop-shadow(var(--drop-shadow-xl));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .drop-shadow-none {
      --tw-drop-shadow: ;
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .drop-shadow-inherit {
      --tw-drop-shadow-color: inherit;
      --tw-drop-shadow: var(--tw-drop-shadow-size);
    }

    .drop-shadow-red-500 {
      --tw-drop-shadow-color: #ef4444;
      --tw-drop-shadow: var(--tw-drop-shadow-size);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .drop-shadow-red-500 {
        --tw-drop-shadow-color: color-mix(in oklab, var(--color-red-500) var(--tw-drop-shadow-alpha), transparent);
      }
    }

    .drop-shadow-red-500\\/50 {
      --tw-drop-shadow-color: #ef444480;
      --tw-drop-shadow: var(--tw-drop-shadow-size);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .drop-shadow-red-500\\/50 {
        --tw-drop-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 50%, transparent) var(--tw-drop-shadow-alpha), transparent);
      }
    }

    .grayscale {
      --tw-grayscale: grayscale(100%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .grayscale-0 {
      --tw-grayscale: grayscale(0%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .grayscale-\\[var\\(--value\\)\\] {
      --tw-grayscale: grayscale(var(--value));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .-hue-rotate-15 {
      --tw-hue-rotate: hue-rotate(calc(15deg * -1));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .-hue-rotate-\\[45deg\\] {
      --tw-hue-rotate: hue-rotate(calc(45deg * -1));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .hue-rotate-15 {
      --tw-hue-rotate: hue-rotate(15deg);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .hue-rotate-\\[45deg\\] {
      --tw-hue-rotate: hue-rotate(45deg);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .invert {
      --tw-invert: invert(100%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .invert-0 {
      --tw-invert: invert(0%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .invert-\\[var\\(--value\\)\\] {
      --tw-invert: invert(var(--value));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .saturate-0 {
      --tw-saturate: saturate(0%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .saturate-\\[1\\.75\\] {
      --tw-saturate: saturate(1.75);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .saturate-\\[var\\(--value\\)\\] {
      --tw-saturate: saturate(var(--value));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .sepia {
      --tw-sepia: sepia(100%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .sepia-0 {
      --tw-sepia: sepia(0%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .sepia-\\[50\\%\\] {
      --tw-sepia: sepia(50%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .sepia-\\[var\\(--value\\)\\] {
      --tw-sepia: sepia(var(--value));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .filter {
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .filter-\\[var\\(--value\\)\\] {
      filter: var(--value);
    }

    .filter-none {
      filter: none;
    }

    @property --tw-blur {
      syntax: "*";
      inherits: false
    }

    @property --tw-brightness {
      syntax: "*";
      inherits: false
    }

    @property --tw-contrast {
      syntax: "*";
      inherits: false
    }

    @property --tw-grayscale {
      syntax: "*";
      inherits: false
    }

    @property --tw-hue-rotate {
      syntax: "*";
      inherits: false
    }

    @property --tw-invert {
      syntax: "*";
      inherits: false
    }

    @property --tw-opacity {
      syntax: "*";
      inherits: false
    }

    @property --tw-saturate {
      syntax: "*";
      inherits: false
    }

    @property --tw-sepia {
      syntax: "*";
      inherits: false
    }

    @property --tw-drop-shadow {
      syntax: "*";
      inherits: false
    }

    @property --tw-drop-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-drop-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-drop-shadow-size {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      '-filter',
      '-filter-none',
      '-filter-[var(--value)]',
      '-blur-xl',
      '-blur-[4px]',
      'brightness--50',
      '-brightness-50',
      '-brightness-[1.23]',
      'brightness-unknown',
      'contrast--50',
      '-contrast-50',
      '-contrast-[1.23]',
      'contrast-unknown',
      '-grayscale',
      '-grayscale-0',
      'grayscale--1',
      '-grayscale-[var(--value)]',
      'grayscale-unknown',
      'hue-rotate--5',
      'hue-rotate-unknown',
      '-invert',
      'invert--5',
      '-invert-0',
      '-invert-[var(--value)]',
      'invert-unknown',
      '-drop-shadow-xl',
      '-drop-shadow-[0_0_red]',

      'drop-shadow/foo',
      '-drop-shadow/foo',
      '-drop-shadow/25',
      '-drop-shadow-red-500',
      'drop-shadow-red-500/foo',
      '-drop-shadow-red-500/foo',
      '-drop-shadow-red-500/50',

      '-saturate-0',
      'saturate--5',
      '-saturate-[1.75]',
      '-saturate-[var(--value)]',
      'saturate-saturate',
      '-sepia',
      'sepia--50',
      '-sepia-0',
      '-sepia-[50%]',
      '-sepia-[var(--value)]',
      'sepia-unknown',
      'filter/foo',
      'filter-none/foo',
      'filter-[var(--value)]/foo',
      'blur-xl/foo',
      'blur-none/foo',
      'blur-[4px]/foo',
      'brightness-50/foo',
      'brightness-[1.23]/foo',
      'contrast-50/foo',
      'contrast-[1.23]/foo',
      'grayscale/foo',
      'grayscale-0/foo',
      'grayscale-[var(--value)]/foo',
      'hue-rotate-15/foo',
      'hue-rotate-[45deg]/foo',
      'invert/foo',
      'invert-0/foo',
      'invert-[var(--value)]/foo',
      'drop-shadow-xl/foo',
      'drop-shadow-[0_0_red]/foo',
      'saturate-0/foo',
      'saturate-[1.75]/foo',
      'saturate-[var(--value)]/foo',
      'sepia/foo',
      'sepia-0/foo',
      'sepia-[50%]/foo',
      'sepia-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('backdrop-filter', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --blur-xl: 24px;
        }
        @tailwind utilities;
      `,
      [
        'backdrop-filter',
        'backdrop-filter-none',
        'backdrop-filter-[var(--value)]',
        'backdrop-blur-none',
        'backdrop-blur-xl',
        'backdrop-blur-[4px]',
        'backdrop-brightness-50',
        'backdrop-brightness-[1.23]',
        'backdrop-contrast-50',
        'backdrop-contrast-[1.23]',
        'backdrop-grayscale',
        'backdrop-grayscale-0',
        'backdrop-grayscale-[var(--value)]',
        'backdrop-hue-rotate-15',
        'backdrop-hue-rotate-[45deg]',
        '-backdrop-hue-rotate-15',
        '-backdrop-hue-rotate-[45deg]',
        'backdrop-invert',
        'backdrop-invert-0',
        'backdrop-invert-[var(--value)]',
        'backdrop-opacity-50',
        'backdrop-opacity-71',
        'backdrop-opacity-1.25',
        'backdrop-opacity-2.5',
        'backdrop-opacity-3.75',
        'backdrop-opacity-[0.5]',
        'backdrop-saturate-0',
        'backdrop-saturate-[1.75]',
        'backdrop-saturate-[var(--value)]',
        'backdrop-sepia',
        'backdrop-sepia-0',
        'backdrop-sepia-[50%]',
        'backdrop-sepia-[var(--value)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-backdrop-blur: initial;
          --tw-backdrop-brightness: initial;
          --tw-backdrop-contrast: initial;
          --tw-backdrop-grayscale: initial;
          --tw-backdrop-hue-rotate: initial;
          --tw-backdrop-invert: initial;
          --tw-backdrop-opacity: initial;
          --tw-backdrop-saturate: initial;
          --tw-backdrop-sepia: initial;
        }
      }
    }

    :root, :host {
      --blur-xl: 24px;
    }

    .backdrop-blur-\\[4px\\] {
      --tw-backdrop-blur: blur(4px);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-blur-none {
      --tw-backdrop-blur: ;
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-blur-xl {
      --tw-backdrop-blur: blur(var(--blur-xl));
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-brightness-50 {
      --tw-backdrop-brightness: brightness(50%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-brightness-\\[1\\.23\\] {
      --tw-backdrop-brightness: brightness(1.23);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-contrast-50 {
      --tw-backdrop-contrast: contrast(50%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-contrast-\\[1\\.23\\] {
      --tw-backdrop-contrast: contrast(1.23);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-grayscale {
      --tw-backdrop-grayscale: grayscale(100%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-grayscale-0 {
      --tw-backdrop-grayscale: grayscale(0%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-grayscale-\\[var\\(--value\\)\\] {
      --tw-backdrop-grayscale: grayscale(var(--value));
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .-backdrop-hue-rotate-15 {
      --tw-backdrop-hue-rotate: hue-rotate(calc(15deg * -1));
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .-backdrop-hue-rotate-\\[45deg\\] {
      --tw-backdrop-hue-rotate: hue-rotate(calc(45deg * -1));
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-hue-rotate-15 {
      --tw-backdrop-hue-rotate: hue-rotate(15deg);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-hue-rotate-\\[45deg\\] {
      --tw-backdrop-hue-rotate: hue-rotate(45deg);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-invert {
      --tw-backdrop-invert: invert(100%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-invert-0 {
      --tw-backdrop-invert: invert(0%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-invert-\\[var\\(--value\\)\\] {
      --tw-backdrop-invert: invert(var(--value));
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-opacity-1\\.25 {
      --tw-backdrop-opacity: opacity(1.25%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-opacity-2\\.5 {
      --tw-backdrop-opacity: opacity(2.5%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-opacity-3\\.75 {
      --tw-backdrop-opacity: opacity(3.75%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-opacity-50 {
      --tw-backdrop-opacity: opacity(50%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-opacity-71 {
      --tw-backdrop-opacity: opacity(71%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-opacity-\\[0\\.5\\] {
      --tw-backdrop-opacity: opacity(.5);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-saturate-0 {
      --tw-backdrop-saturate: saturate(0%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-saturate-\\[1\\.75\\] {
      --tw-backdrop-saturate: saturate(1.75);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-saturate-\\[var\\(--value\\)\\] {
      --tw-backdrop-saturate: saturate(var(--value));
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-sepia {
      --tw-backdrop-sepia: sepia(100%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-sepia-0 {
      --tw-backdrop-sepia: sepia(0%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-sepia-\\[50\\%\\] {
      --tw-backdrop-sepia: sepia(50%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-sepia-\\[var\\(--value\\)\\] {
      --tw-backdrop-sepia: sepia(var(--value));
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-filter {
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-filter-\\[var\\(--value\\)\\] {
      -webkit-backdrop-filter: var(--value);
      backdrop-filter: var(--value);
    }

    .backdrop-filter-none {
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }

    @property --tw-backdrop-blur {
      syntax: "*";
      inherits: false
    }

    @property --tw-backdrop-brightness {
      syntax: "*";
      inherits: false
    }

    @property --tw-backdrop-contrast {
      syntax: "*";
      inherits: false
    }

    @property --tw-backdrop-grayscale {
      syntax: "*";
      inherits: false
    }

    @property --tw-backdrop-hue-rotate {
      syntax: "*";
      inherits: false
    }

    @property --tw-backdrop-invert {
      syntax: "*";
      inherits: false
    }

    @property --tw-backdrop-opacity {
      syntax: "*";
      inherits: false
    }

    @property --tw-backdrop-saturate {
      syntax: "*";
      inherits: false
    }

    @property --tw-backdrop-sepia {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      '-backdrop-filter',
      '-backdrop-filter-none',
      '-backdrop-filter-[var(--value)]',
      '-backdrop-blur-xl',
      '-backdrop-blur-[4px]',
      'backdrop-brightness--50',
      '-backdrop-brightness-50',
      '-backdrop-brightness-[1.23]',
      'backdrop-brightness-unknown',
      'backdrop-contrast--50',
      '-backdrop-contrast-50',
      '-backdrop-contrast-[1.23]',
      'backdrop-contrast-unknown',
      '-backdrop-grayscale',
      'backdrop-grayscale--1',
      '-backdrop-grayscale-0',
      '-backdrop-grayscale-[var(--value)]',
      'backdrop-grayscale-unknown',
      'backdrop-hue-rotate-unknown',
      '-backdrop-invert',
      'backdrop-invert--1',
      '-backdrop-invert-0',
      '-backdrop-invert-[var(--value)]',
      'backdrop-invert-unknown',
      'backdrop-opacity--50',
      '-backdrop-opacity-50',
      '-backdrop-opacity-[0.5]',
      'backdrop-opacity-unknown',
      '-backdrop-saturate-0',
      'backdrop-saturate--50',
      '-backdrop-saturate-[1.75]',
      '-backdrop-saturate-[var(--value)]',
      'backdrop-saturate-unknown',
      '-backdrop-sepia',
      'backdrop-sepia--50',
      '-backdrop-sepia-0',
      '-backdrop-sepia-[50%]',
      '-backdrop-sepia-[var(--value)]',
      'backdrop-sepia-unknown',
      'backdrop-filter/foo',
      'backdrop-filter-none/foo',
      'backdrop-filter-[var(--value)]/foo',
      'backdrop-blur-none/foo',
      'backdrop-blur-xl/foo',
      'backdrop-blur-[4px]/foo',
      'backdrop-brightness-50/foo',
      'backdrop-brightness-[1.23]/foo',
      'backdrop-contrast-50/foo',
      'backdrop-contrast-[1.23]/foo',
      'backdrop-grayscale/foo',
      'backdrop-grayscale-0/foo',
      'backdrop-grayscale-[var(--value)]/foo',
      'backdrop-hue-rotate--15',
      'backdrop-hue-rotate-15/foo',
      'backdrop-hue-rotate-[45deg]/foo',
      'backdrop-invert/foo',
      'backdrop-invert-0/foo',
      'backdrop-invert-[var(--value)]/foo',
      'backdrop-opacity-50/foo',
      'backdrop-opacity-71/foo',
      'backdrop-opacity-[0.5]/foo',
      'backdrop-saturate-0/foo',
      'backdrop-saturate-[1.75]/foo',
      'backdrop-saturate-[var(--value)]/foo',
      'backdrop-sepia/foo',
      'backdrop-sepia-0/foo',
      'backdrop-sepia-[50%]/foo',
      'backdrop-sepia-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('transition', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --default-transition-timing-function: ease;
          --default-transition-duration: 100ms;
          --transition-property:
            color, background-color, border-color, text-decoration-color, fill, stroke, opacity,
            box-shadow, transform, filter, backdrop-filter;
          --transition-property-opacity: opacity;
        }
        @tailwind utilities;
      `,
      [
        'transition',
        'transition-none',
        'transition-all',
        'transition-transform',
        'transition-shadow',
        'transition-colors',
        'transition-opacity',
        'transition-[var(--value)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --default-transition-timing-function: ease;
      --default-transition-duration: .1s;
      --transition-property-opacity: opacity;
    }

    .transition {
      transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter;
      transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
      transition-duration: var(--tw-duration, var(--default-transition-duration));
    }

    .transition-\\[var\\(--value\\)\\] {
      transition-property: var(--value);
      transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
      transition-duration: var(--tw-duration, var(--default-transition-duration));
    }

    .transition-all {
      transition-property: all;
      transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
      transition-duration: var(--tw-duration, var(--default-transition-duration));
    }

    .transition-colors {
      transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;
      transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
      transition-duration: var(--tw-duration, var(--default-transition-duration));
    }

    .transition-opacity {
      transition-property: opacity;
      transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
      transition-duration: var(--tw-duration, var(--default-transition-duration));
      transition-property: var(--transition-property-opacity);
      transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
      transition-duration: var(--tw-duration, var(--default-transition-duration));
    }

    .transition-shadow {
      transition-property: box-shadow;
      transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
      transition-duration: var(--tw-duration, var(--default-transition-duration));
    }

    .transition-transform {
      transition-property: transform, translate, scale, rotate;
      transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
      transition-duration: var(--tw-duration, var(--default-transition-duration));
    }

    .transition-none {
      transition-property: none;
    }"
  `)

  expect(
    await compileCss(
      css`
        @theme inline {
          --default-transition-timing-function: ease;
          --default-transition-duration: 100ms;
        }
        @tailwind utilities;
      `,
      ['transition', 'transition-all', 'transition-colors'],
    ),
  ).toMatchInlineSnapshot(`
    ".transition {
      transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter;
      transition-timing-function: var(--tw-ease, ease);
      transition-duration: var(--tw-duration, .1s);
    }

    .transition-all {
      transition-property: all;
      transition-timing-function: var(--tw-ease, ease);
      transition-duration: var(--tw-duration, .1s);
    }

    .transition-colors {
      transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;
      transition-timing-function: var(--tw-ease, ease);
      transition-duration: var(--tw-duration, .1s);
    }"
  `)

  expect(
    await compileCss(
      css`
        @tailwind utilities;
      `,
      ['transition-all'],
    ),
  ).toMatchInlineSnapshot(`
    ".transition-all {
      transition-property: all;
      transition-timing-function: var(--tw-ease, ease);
      transition-duration: var(--tw-duration, 0s);
    }"
  `)

  expect(
    await run([
      '-transition',
      '-transition-none',
      '-transition-all',
      '-transition-opacity',
      '-transition-[var(--value)]',
      'transition/foo',
      'transition-none/foo',
      'transition-all/foo',
      'transition-transform/foo',
      'transition-shadow/foo',
      'transition-colors/foo',
      'transition-opacity/foo',
      'transition-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('transition-behavior', async () => {
  expect(await run(['transition-discrete', 'transition-normal'])).toMatchInlineSnapshot(`
    ".transition-discrete {
      transition-behavior: allow-discrete;
    }

    .transition-normal {
      transition-behavior: normal;
    }"
  `)

  expect(await run(['-transition-discrete', '-transition-normal'])).toEqual('')
})

test('delay', async () => {
  expect(await run(['delay-123', 'delay-200', 'delay-[300ms]'])).toMatchInlineSnapshot(`
    ".delay-123 {
      transition-delay: .123s;
    }

    .delay-200 {
      transition-delay: .2s;
    }

    .delay-\\[300ms\\] {
      transition-delay: .3s;
    }"
  `)
  expect(
    await run([
      'delay',
      'delay--200',
      '-delay-200',
      '-delay-[300ms]',
      'delay-unknown',
      'delay-123/foo',
      'delay-200/foo',
      'delay-[300ms]/foo',
    ]),
  ).toEqual('')
})

test('duration', async () => {
  expect(await run(['duration-123', 'duration-200', 'duration-[300ms]'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-duration: initial;
        }
      }
    }

    .duration-123 {
      --tw-duration: .123s;
      transition-duration: .123s;
    }

    .duration-200 {
      --tw-duration: .2s;
      transition-duration: .2s;
    }

    .duration-\\[300ms\\] {
      --tw-duration: .3s;
      transition-duration: .3s;
    }

    @property --tw-duration {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      'duration',
      'duration--200',
      '-duration-200',
      '-duration-[300ms]',
      'duration-123/foo',
      'duration-200/foo',
      'duration-[300ms]/foo',
    ]),
  ).toEqual('')
})

test('ease', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --ease-in: cubic-bezier(0.4, 0, 1, 1);
          --ease-out: cubic-bezier(0, 0, 0.2, 1);
        }
        @tailwind utilities;
      `,
      ['ease-in', 'ease-out', 'ease-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-ease: initial;
        }
      }
    }

    :root, :host {
      --ease-in: cubic-bezier(.4, 0, 1, 1);
      --ease-out: cubic-bezier(0, 0, .2, 1);
    }

    .ease-\\[var\\(--value\\)\\] {
      --tw-ease: var(--value);
      transition-timing-function: var(--value);
    }

    .ease-in {
      --tw-ease: var(--ease-in);
      transition-timing-function: var(--ease-in);
    }

    .ease-out {
      --tw-ease: var(--ease-out);
      transition-timing-function: var(--ease-out);
    }

    @property --tw-ease {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      '-ease-in',
      '-ease-out',
      '-ease-[var(--value)]',
      'ease-in/foo',
      'ease-out/foo',
      'ease-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('will-change', async () => {
  expect(
    await run([
      'will-change-auto',
      'will-change-contents',
      'will-change-transform',
      'will-change-scroll',
      'will-change-[var(--value)]',
    ]),
  ).toMatchInlineSnapshot(`
    ".will-change-\\[var\\(--value\\)\\] {
      will-change: var(--value);
    }

    .will-change-auto {
      will-change: auto;
    }

    .will-change-contents {
      will-change: contents;
    }

    .will-change-scroll {
      will-change: scroll-position;
    }

    .will-change-transform {
      will-change: transform;
    }"
  `)
  expect(
    await run([
      'will-change',
      '-will-change-auto',
      '-will-change-contents',
      '-will-change-transform',
      '-will-change-scroll',
      '-will-change-[var(--value)]',
      'will-change-auto/foo',
      'will-change-contents/foo',
      'will-change-transform/foo',
      'will-change-scroll/foo',
      'will-change-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('contain', async () => {
  expect(
    await run([
      'contain-none',
      'contain-content',
      'contain-strict',
      'contain-size',
      'contain-inline-size',
      'contain-layout',
      'contain-paint',
      'contain-style',
      'contain-[unset]',
    ]),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-contain-size: initial;
          --tw-contain-layout: initial;
          --tw-contain-paint: initial;
          --tw-contain-style: initial;
        }
      }
    }

    .contain-inline-size {
      --tw-contain-size: inline-size;
      contain: var(--tw-contain-size, ) var(--tw-contain-layout, ) var(--tw-contain-paint, ) var(--tw-contain-style, );
    }

    .contain-layout {
      --tw-contain-layout: layout;
      contain: var(--tw-contain-size, ) var(--tw-contain-layout, ) var(--tw-contain-paint, ) var(--tw-contain-style, );
    }

    .contain-paint {
      --tw-contain-paint: paint;
      contain: var(--tw-contain-size, ) var(--tw-contain-layout, ) var(--tw-contain-paint, ) var(--tw-contain-style, );
    }

    .contain-size {
      --tw-contain-size: size;
      contain: var(--tw-contain-size, ) var(--tw-contain-layout, ) var(--tw-contain-paint, ) var(--tw-contain-style, );
    }

    .contain-style {
      --tw-contain-style: style;
      contain: var(--tw-contain-size, ) var(--tw-contain-layout, ) var(--tw-contain-paint, ) var(--tw-contain-style, );
    }

    .contain-\\[unset\\] {
      contain: unset;
    }

    .contain-content {
      contain: content;
    }

    .contain-none {
      contain: none;
    }

    .contain-strict {
      contain: strict;
    }

    @property --tw-contain-size {
      syntax: "*";
      inherits: false
    }

    @property --tw-contain-layout {
      syntax: "*";
      inherits: false
    }

    @property --tw-contain-paint {
      syntax: "*";
      inherits: false
    }

    @property --tw-contain-style {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      'contain-none/foo',
      'contain-content/foo',
      'contain-strict/foo',
      'contain-size/foo',
      'contain-inline-size/foo',
      'contain-layout/foo',
      'contain-paint/foo',
      'contain-style/foo',
      'contain-[unset]/foo',
    ]),
  ).toEqual('')
})

test('content', async () => {
  expect(await run(['content-["hello_world"]'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-content: "";
        }
      }
    }

    .content-\\[\\"hello_world\\"\\] {
      --tw-content: "hello world";
      content: var(--tw-content);
    }

    @property --tw-content {
      syntax: "*";
      inherits: false;
      initial-value: "";
    }"
  `)
  expect(await run(['content', '-content-["hello_world"]', 'content-["hello_world"]/foo'])).toEqual(
    '',
  )
})

test('forced-color-adjust', async () => {
  expect(await run(['forced-color-adjust-none', 'forced-color-adjust-auto']))
    .toMatchInlineSnapshot(`
      ".forced-color-adjust-auto {
        forced-color-adjust: auto;
      }

      .forced-color-adjust-none {
        forced-color-adjust: none;
      }"
    `)
  expect(
    await run([
      'forced',
      'forced-color',
      'forced-color-adjust',
      '-forced-color-adjust-none',
      '-forced-color-adjust-auto',
      'forced-color-adjust-none/foo',
      'forced-color-adjust-auto/foo',
    ]),
  ).toEqual('')
})

test('leading', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --leading-tight: 1.25;
          --leading-6: 1.5rem;
        }
        @tailwind utilities;
      `,
      ['leading-tight', 'leading-6', 'leading-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-leading: initial;
        }
      }
    }

    :root, :host {
      --leading-tight: 1.25;
      --leading-6: 1.5rem;
    }

    .leading-6 {
      --tw-leading: var(--leading-6);
      line-height: var(--leading-6);
    }

    .leading-\\[var\\(--value\\)\\] {
      --tw-leading: var(--value);
      line-height: var(--value);
    }

    .leading-tight {
      --tw-leading: var(--leading-tight);
      line-height: var(--leading-tight);
    }

    @property --tw-leading {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      'leading',
      '-leading-tight',
      '-leading-6',
      '-leading-[var(--value)]',
      'leading-tight/foo',
      'leading-6/foo',
      'leading-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('tracking', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --tracking-normal: 0em;
          --tracking-wide: 0.025em;
        }
        @tailwind utilities;
      `,
      ['tracking-normal', 'tracking-wide', 'tracking-[var(--value)]', '-tracking-[var(--value)]'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-tracking: initial;
        }
      }
    }

    :root, :host {
      --tracking-normal: 0em;
      --tracking-wide: .025em;
    }

    .-tracking-\\[var\\(--value\\)\\] {
      --tw-tracking: calc(var(--value) * -1);
      letter-spacing: calc(var(--value) * -1);
    }

    .tracking-\\[var\\(--value\\)\\] {
      --tw-tracking: var(--value);
      letter-spacing: var(--value);
    }

    .tracking-normal {
      --tw-tracking: var(--tracking-normal);
      letter-spacing: var(--tracking-normal);
    }

    .tracking-wide {
      --tw-tracking: var(--tracking-wide);
      letter-spacing: var(--tracking-wide);
    }

    @property --tw-tracking {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      'tracking',
      'tracking-normal/foo',
      'tracking-wide/foo',
      'tracking-[var(--value)]/foo',
      '-tracking-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('font-smoothing', async () => {
  expect(await run(['antialiased', 'subpixel-antialiased'])).toMatchInlineSnapshot(`
    ".antialiased {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .subpixel-antialiased {
      -webkit-font-smoothing: auto;
      -moz-osx-font-smoothing: auto;
    }"
  `)
  expect(
    await run([
      '-antialiased',
      '-subpixel-antialiased',
      'antialiased/foo',
      'subpixel-antialiased/foo',
    ]),
  ).toEqual('')
})

test('font-variant-numeric', async () => {
  expect(
    await run([
      'normal-nums',
      'ordinal',
      'slashed-zero',
      'lining-nums',
      'oldstyle-nums',
      'proportional-nums',
      'tabular-nums',
      'diagonal-fractions',
      'stacked-fractions',
    ]),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-ordinal: initial;
          --tw-slashed-zero: initial;
          --tw-numeric-figure: initial;
          --tw-numeric-spacing: initial;
          --tw-numeric-fraction: initial;
        }
      }
    }

    .diagonal-fractions {
      --tw-numeric-fraction: diagonal-fractions;
      font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );
    }

    .lining-nums {
      --tw-numeric-figure: lining-nums;
      font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );
    }

    .oldstyle-nums {
      --tw-numeric-figure: oldstyle-nums;
      font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );
    }

    .ordinal {
      --tw-ordinal: ordinal;
      font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );
    }

    .proportional-nums {
      --tw-numeric-spacing: proportional-nums;
      font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );
    }

    .slashed-zero {
      --tw-slashed-zero: slashed-zero;
      font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );
    }

    .stacked-fractions {
      --tw-numeric-fraction: stacked-fractions;
      font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );
    }

    .tabular-nums {
      --tw-numeric-spacing: tabular-nums;
      font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );
    }

    .normal-nums {
      font-variant-numeric: normal;
    }

    @property --tw-ordinal {
      syntax: "*";
      inherits: false
    }

    @property --tw-slashed-zero {
      syntax: "*";
      inherits: false
    }

    @property --tw-numeric-figure {
      syntax: "*";
      inherits: false
    }

    @property --tw-numeric-spacing {
      syntax: "*";
      inherits: false
    }

    @property --tw-numeric-fraction {
      syntax: "*";
      inherits: false
    }"
  `)
  expect(
    await run([
      '-normal-nums',
      '-ordinal',
      '-slashed-zero',
      '-lining-nums',
      '-oldstyle-nums',
      '-proportional-nums',
      '-tabular-nums',
      '-diagonal-fractions',
      '-stacked-fractions',
      'normal-nums/foo',
      'ordinal/foo',
      'slashed-zero/foo',
      'lining-nums/foo',
      'oldstyle-nums/foo',
      'proportional-nums/foo',
      'tabular-nums/foo',
      'diagonal-fractions/foo',
      'stacked-fractions/foo',
    ]),
  ).toEqual('')
})

test('outline', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --outline-color-blue-500: #3b82f6;
        }
        @tailwind utilities;
      `,
      [
        'outline',
        'outline-hidden',

        // outline-style
        'outline-none',
        'outline-solid',
        'outline-dashed',
        'outline-dotted',
        'outline-double',

        // outline-color
        'outline-red-500',
        'outline-red-500/50',
        'outline-red-500/[0.5]',
        'outline-red-500/[50%]',
        'outline-blue-500',
        'outline-current',
        'outline-current/50',
        'outline-current/[0.5]',
        'outline-current/[50%]',
        'outline-inherit',
        'outline-transparent',
        'outline-[#0088cc]',
        'outline-[#0088cc]/50',
        'outline-[#0088cc]/[0.5]',
        'outline-[#0088cc]/[50%]',
        'outline-[black]',
        'outline-[black]/50',
        'outline-[black]/[0.5]',
        'outline-[black]/[50%]',
        'outline-[var(--value)]',
        'outline-[var(--value)]/50',
        'outline-[var(--value)]/[0.5]',
        'outline-[var(--value)]/[50%]',
        'outline-[color:var(--value)]',
        'outline-[color:var(--value)]/50',
        'outline-[color:var(--value)]/[0.5]',
        'outline-[color:var(--value)]/[50%]',

        // outline-width
        'outline-0',
        'outline-[1.5]',
        'outline-[12px]',
        'outline-[50%]',
        'outline-[number:var(--my-width)]',
        'outline-[length:var(--my-width)]',
        'outline-[percentage:var(--my-width)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-outline-style: solid;
        }
      }
    }

    :root, :host {
      --color-red-500: #ef4444;
      --outline-color-blue-500: #3b82f6;
    }

    .outline-hidden {
      --tw-outline-style: none;
      outline-style: none;
    }

    @media (forced-colors: active) {
      .outline-hidden {
        outline-offset: 2px;
        outline: 2px solid #0000;
      }
    }

    .outline {
      outline-style: var(--tw-outline-style);
      outline-width: 1px;
    }

    .outline-0 {
      outline-style: var(--tw-outline-style);
      outline-width: 0;
    }

    .outline-\\[1\\.5\\] {
      outline-style: var(--tw-outline-style);
      outline-width: 1.5px;
    }

    .outline-\\[12px\\] {
      outline-style: var(--tw-outline-style);
      outline-width: 12px;
    }

    .outline-\\[50\\%\\] {
      outline-style: var(--tw-outline-style);
      outline-width: 50%;
    }

    .outline-\\[length\\:var\\(--my-width\\)\\], .outline-\\[number\\:var\\(--my-width\\)\\], .outline-\\[percentage\\:var\\(--my-width\\)\\] {
      outline-style: var(--tw-outline-style);
      outline-width: var(--my-width);
    }

    .outline-\\[\\#0088cc\\] {
      outline-color: #08c;
    }

    .outline-\\[\\#0088cc\\]\\/50, .outline-\\[\\#0088cc\\]\\/\\[0\\.5\\], .outline-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      outline-color: oklab(59.9824% -.067 -.124 / .5);
    }

    .outline-\\[black\\] {
      outline-color: #000;
    }

    .outline-\\[black\\]\\/50 {
      outline-color: oklab(0% none none / .5);
    }

    .outline-\\[black\\]\\/\\[0\\.5\\] {
      outline-color: oklab(0% none none / .5);
    }

    .outline-\\[black\\]\\/\\[50\\%\\] {
      outline-color: oklab(0% none none / .5);
    }

    .outline-\\[color\\:var\\(--value\\)\\], .outline-\\[color\\:var\\(--value\\)\\]\\/50 {
      outline-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .outline-\\[color\\:var\\(--value\\)\\]\\/50 {
        outline-color: color-mix(in oklab, var(--value) 50%, transparent);
      }
    }

    .outline-\\[color\\:var\\(--value\\)\\]\\/\\[0\\.5\\] {
      outline-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .outline-\\[color\\:var\\(--value\\)\\]\\/\\[0\\.5\\] {
        outline-color: color-mix(in oklab, var(--value) 50%, transparent);
      }
    }

    .outline-\\[color\\:var\\(--value\\)\\]\\/\\[50\\%\\] {
      outline-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .outline-\\[color\\:var\\(--value\\)\\]\\/\\[50\\%\\] {
        outline-color: color-mix(in oklab, var(--value) 50%, transparent);
      }
    }

    .outline-\\[var\\(--value\\)\\], .outline-\\[var\\(--value\\)\\]\\/50 {
      outline-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .outline-\\[var\\(--value\\)\\]\\/50 {
        outline-color: color-mix(in oklab, var(--value) 50%, transparent);
      }
    }

    .outline-\\[var\\(--value\\)\\]\\/\\[0\\.5\\] {
      outline-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .outline-\\[var\\(--value\\)\\]\\/\\[0\\.5\\] {
        outline-color: color-mix(in oklab, var(--value) 50%, transparent);
      }
    }

    .outline-\\[var\\(--value\\)\\]\\/\\[50\\%\\] {
      outline-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .outline-\\[var\\(--value\\)\\]\\/\\[50\\%\\] {
        outline-color: color-mix(in oklab, var(--value) 50%, transparent);
      }
    }

    .outline-blue-500 {
      outline-color: var(--outline-color-blue-500);
    }

    .outline-current, .outline-current\\/50 {
      outline-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .outline-current\\/50 {
        outline-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .outline-current\\/\\[0\\.5\\] {
      outline-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .outline-current\\/\\[0\\.5\\] {
        outline-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .outline-current\\/\\[50\\%\\] {
      outline-color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .outline-current\\/\\[50\\%\\] {
        outline-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .outline-inherit {
      outline-color: inherit;
    }

    .outline-red-500 {
      outline-color: var(--color-red-500);
    }

    .outline-red-500\\/50 {
      outline-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .outline-red-500\\/50 {
        outline-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .outline-red-500\\/\\[0\\.5\\] {
      outline-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .outline-red-500\\/\\[0\\.5\\] {
        outline-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .outline-red-500\\/\\[50\\%\\] {
      outline-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .outline-red-500\\/\\[50\\%\\] {
        outline-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .outline-transparent {
      outline-color: #0000;
    }

    .outline-dashed {
      --tw-outline-style: dashed;
      outline-style: dashed;
    }

    .outline-dotted {
      --tw-outline-style: dotted;
      outline-style: dotted;
    }

    .outline-double {
      --tw-outline-style: double;
      outline-style: double;
    }

    .outline-none {
      --tw-outline-style: none;
      outline-style: none;
    }

    .outline-solid {
      --tw-outline-style: solid;
      outline-style: solid;
    }

    @property --tw-outline-style {
      syntax: "*";
      inherits: false;
      initial-value: solid;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --default-outline-width: 2px;
        }
        @tailwind utilities;
      `,
      ['outline'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-outline-style: solid;
        }
      }
    }

    .outline {
      outline-style: var(--tw-outline-style);
      outline-width: 2px;
    }

    @property --tw-outline-style {
      syntax: "*";
      inherits: false;
      initial-value: solid;
    }"
  `)
  expect(
    await run([
      '-outline',

      // outline-style
      '-outline-none',
      '-outline-dashed',
      '-outline-dotted',
      '-outline-double',

      // outline-color
      '-outline-red-500',
      '-outline-red-500/50',
      '-outline-red-500/[0.5]',
      '-outline-red-500/[50%]',
      '-outline-current',
      '-outline-current/50',
      '-outline-current/[0.5]',
      '-outline-current/[50%]',
      '-outline-inherit',
      '-outline-transparent',
      '-outline-[#0088cc]',
      '-outline-[#0088cc]/50',
      '-outline-[#0088cc]/[0.5]',
      '-outline-[#0088cc]/[50%]',
      '-outline-[black]',

      // outline-width
      '-outline-0',
      'outline--10',

      'outline/foo',
      'outline-none/foo',
      'outline-solid/foo',
      'outline-dashed/foo',
      'outline-dotted/foo',
      'outline-double/foo',
    ]),
  ).toEqual('')
})

test('outline-offset', async () => {
  expect(
    await run([
      'outline-offset-4',
      '-outline-offset-4',
      'outline-offset-[var(--value)]',
      '-outline-offset-[var(--value)]',
    ]),
  ).toMatchInlineSnapshot(`
    ".-outline-offset-4 {
      outline-offset: calc(4px * -1);
    }

    .-outline-offset-\\[var\\(--value\\)\\] {
      outline-offset: calc(var(--value) * -1);
    }

    .outline-offset-4 {
      outline-offset: 4px;
    }

    .outline-offset-\\[var\\(--value\\)\\] {
      outline-offset: var(--value);
    }"
  `)
  expect(
    await run([
      'outline-offset',
      'outline-offset--4',
      'outline-offset-unknown',
      'outline-offset-4/foo',
      '-outline-offset-4/foo',
      'outline-offset-[var(--value)]/foo',
      '-outline-offset-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('opacity', async () => {
  expect(
    await run([
      'opacity-15',
      'opacity-2.5',
      'opacity-3.25',
      'opacity-4.75',
      'opacity-[var(--value)]',
    ]),
  ).toMatchInlineSnapshot(`
    ".opacity-2\\.5 {
      opacity: .025;
    }

    .opacity-3\\.25 {
      opacity: .0325;
    }

    .opacity-4\\.75 {
      opacity: .0475;
    }

    .opacity-15 {
      opacity: .15;
    }

    .opacity-\\[var\\(--value\\)\\] {
      opacity: var(--value);
    }"
  `)
  expect(
    await run([
      'opacity',
      'opacity--15',
      'opacity-1.125',
      '-opacity-15',
      '-opacity-[var(--value)]',
      'opacity-unknown',
      'opacity-15/foo',
      'opacity-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('underline-offset', async () => {
  expect(
    await compileCss(
      css`
        @theme {
        }
        @tailwind utilities;
      `,
      [
        'underline-offset-auto',
        'underline-offset-4',
        '-underline-offset-4',
        'underline-offset-123',
        '-underline-offset-123',
        'underline-offset-[var(--value)]',
        '-underline-offset-[var(--value)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ".-underline-offset-4 {
      text-underline-offset: calc(4px * -1);
    }

    .-underline-offset-123 {
      text-underline-offset: calc(123px * -1);
    }

    .-underline-offset-\\[var\\(--value\\)\\] {
      text-underline-offset: calc(var(--value) * -1);
    }

    .underline-offset-4 {
      text-underline-offset: 4px;
    }

    .underline-offset-123 {
      text-underline-offset: 123px;
    }

    .underline-offset-\\[var\\(--value\\)\\] {
      text-underline-offset: var(--value);
    }

    .underline-offset-auto {
      text-underline-offset: auto;
    }"
  `)
  expect(
    await run([
      'underline-offset',
      'underline-offset--4',
      '-underline-offset-auto',
      'underline-offset-unknown',
      'underline-offset-auto/foo',
      'underline-offset-4/foo',
      '-underline-offset-4/foo',
      'underline-offset-123/foo',
      '-underline-offset-123/foo',
      'underline-offset-[var(--value)]/foo',
      '-underline-offset-[var(--value)]/foo',
    ]),
  ).toEqual('')
})

test('text', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --spacing: 0.25rem;
          --color-red-500: #ef4444;
          --text-color-blue-500: #3b82f6;
          --text-sm: 0.875rem;
          --text-sm--line-height: 1.25rem;
          --leading-snug: 1.375;
        }
        @tailwind utilities;
      `,
      [
        // color
        'text-red-500',
        'text-red-500/50',
        'text-red-500/2.25',
        'text-red-500/2.5',
        'text-red-500/2.75',
        'text-red-500/[0.5]',
        'text-red-500/[50%]',
        'text-blue-500',
        'text-current',
        'text-current/50',
        'text-current/[0.5]',
        'text-current/[50%]',
        'text-inherit',
        'text-transparent',
        'text-[#0088cc]',
        'text-[#0088cc]/50',
        'text-[#0088cc]/[0.5]',
        'text-[#0088cc]/[50%]',

        'text-[var(--my-color)]',
        'text-[var(--my-color)]/50',
        'text-[var(--my-color)]/[0.5]',
        'text-[var(--my-color)]/[50%]',
        'text-[color:var(--my-color)]',
        'text-[color:var(--my-color)]/50',
        'text-[color:var(--my-color)]/[0.5]',
        'text-[color:var(--my-color)]/[50%]',

        // font-size / line-height / letter-spacing / font-weight
        'text-sm',
        'text-sm/6',
        'text-sm/none',
        'text-[10px]/none',
        'text-sm/snug',
        'text-sm/[4px]',
        'text-[12px]',
        'text-[12px]/6',
        'text-[50%]',
        'text-[50%]/6',
        'text-[xx-large]',
        'text-[xx-large]/6',
        'text-[larger]',
        'text-[larger]/6',
        'text-[length:var(--my-size)]',
        'text-[percentage:var(--my-size)]',
        'text-[absolute-size:var(--my-size)]',
        'text-[relative-size:var(--my-size)]',
        'text-[clamp(1rem,2rem,3rem)]',
        'text-[clamp(1rem,var(--size),3rem)]',
        'text-[clamp(1rem,var(--size),3rem)]/9',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --spacing: .25rem;
      --color-red-500: #ef4444;
      --text-color-blue-500: #3b82f6;
      --text-sm: .875rem;
      --text-sm--line-height: 1.25rem;
      --leading-snug: 1.375;
    }

    .text-\\[10px\\]\\/none {
      font-size: 10px;
      line-height: 1;
    }

    .text-\\[12px\\]\\/6 {
      font-size: 12px;
      line-height: calc(var(--spacing) * 6);
    }

    .text-\\[50\\%\\]\\/6 {
      font-size: 50%;
      line-height: calc(var(--spacing) * 6);
    }

    .text-\\[clamp\\(1rem\\,var\\(--size\\)\\,3rem\\)\\]\\/9 {
      font-size: clamp(1rem, var(--size), 3rem);
      line-height: calc(var(--spacing) * 9);
    }

    .text-\\[larger\\]\\/6 {
      font-size: larger;
      line-height: calc(var(--spacing) * 6);
    }

    .text-\\[xx-large\\]\\/6 {
      font-size: xx-large;
      line-height: calc(var(--spacing) * 6);
    }

    .text-sm {
      font-size: var(--text-sm);
      line-height: var(--tw-leading, var(--text-sm--line-height));
    }

    .text-sm\\/6 {
      font-size: var(--text-sm);
      line-height: calc(var(--spacing) * 6);
    }

    .text-sm\\/\\[4px\\] {
      font-size: var(--text-sm);
      line-height: 4px;
    }

    .text-sm\\/none {
      font-size: var(--text-sm);
      line-height: 1;
    }

    .text-sm\\/snug {
      font-size: var(--text-sm);
      line-height: var(--leading-snug);
    }

    .text-\\[12px\\] {
      font-size: 12px;
    }

    .text-\\[50\\%\\] {
      font-size: 50%;
    }

    .text-\\[absolute-size\\:var\\(--my-size\\)\\] {
      font-size: var(--my-size);
    }

    .text-\\[clamp\\(1rem\\,2rem\\,3rem\\)\\] {
      font-size: 2rem;
    }

    .text-\\[clamp\\(1rem\\,var\\(--size\\)\\,3rem\\)\\] {
      font-size: clamp(1rem, var(--size), 3rem);
    }

    .text-\\[larger\\] {
      font-size: larger;
    }

    .text-\\[length\\:var\\(--my-size\\)\\], .text-\\[percentage\\:var\\(--my-size\\)\\], .text-\\[relative-size\\:var\\(--my-size\\)\\] {
      font-size: var(--my-size);
    }

    .text-\\[xx-large\\] {
      font-size: xx-large;
    }

    .text-\\[\\#0088cc\\] {
      color: #08c;
    }

    .text-\\[\\#0088cc\\]\\/50, .text-\\[\\#0088cc\\]\\/\\[0\\.5\\], .text-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      color: oklab(59.9824% -.067 -.124 / .5);
    }

    .text-\\[color\\:var\\(--my-color\\)\\], .text-\\[color\\:var\\(--my-color\\)\\]\\/50 {
      color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-\\[color\\:var\\(--my-color\\)\\]\\/50 {
        color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .text-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .text-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .text-\\[var\\(--my-color\\)\\], .text-\\[var\\(--my-color\\)\\]\\/50 {
      color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-\\[var\\(--my-color\\)\\]\\/50 {
        color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .text-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .text-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .text-blue-500 {
      color: var(--text-color-blue-500);
    }

    .text-current, .text-current\\/50 {
      color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-current\\/50 {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .text-current\\/\\[0\\.5\\] {
      color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-current\\/\\[0\\.5\\] {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .text-current\\/\\[50\\%\\] {
      color: currentColor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-current\\/\\[50\\%\\] {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .text-inherit {
      color: inherit;
    }

    .text-red-500 {
      color: var(--color-red-500);
    }

    .text-red-500\\/2\\.5 {
      color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-red-500\\/2\\.5 {
        color: color-mix(in oklab, var(--color-red-500) 2.5%, transparent);
      }
    }

    .text-red-500\\/2\\.25 {
      color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-red-500\\/2\\.25 {
        color: color-mix(in oklab, var(--color-red-500) 2.25%, transparent);
      }
    }

    .text-red-500\\/2\\.75 {
      color: #ef444407;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-red-500\\/2\\.75 {
        color: color-mix(in oklab, var(--color-red-500) 2.75%, transparent);
      }
    }

    .text-red-500\\/50 {
      color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-red-500\\/50 {
        color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .text-red-500\\/\\[0\\.5\\] {
      color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-red-500\\/\\[0\\.5\\] {
        color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .text-red-500\\/\\[50\\%\\] {
      color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-red-500\\/\\[50\\%\\] {
        color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .text-transparent {
      color: #0000;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme inline reference {
          --text-sm: 0.875rem;
        }
        @tailwind utilities;
      `,
      [
        'text',
        // color
        '-text-red-500',
        '-text-red-500/50',
        '-text-red-500/[0.5]',
        '-text-red-500/[50%]',
        '-text-current',
        '-text-current/50',
        '-text-current/[0.5]',
        '-text-current/[50%]',
        '-text-inherit',
        '-text-transparent',
        '-text-[#0088cc]',
        '-text-[#0088cc]/50',
        '-text-[#0088cc]/[0.5]',
        '-text-[#0088cc]/[50%]',

        // font-size / line-height / letter-spacing / font-weight
        '-text-sm',
        '-text-sm/6',
        'text-sm/foo',
        '-text-sm/[4px]',
        'text-[10px]/foo',
      ],
    ),
  ).toEqual('')
})

test('text-shadow', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --text-shadow-2xs: 0px 1px 0px rgb(0 0 0 / 0.1);
          --text-shadow-sm: 0px 1px 2px rgb(0 0 0 / 0.06), 0px 2px 2px rgb(0 0 0 / 0.06);
        }
        @tailwind utilities;
      `,
      [
        // Shadows
        'text-shadow-2xs',
        'text-shadow-sm',
        'text-shadow-none',
        'text-shadow-[12px_12px_#0088cc]',
        'text-shadow-[12px_12px_var(--value)]',
        'text-shadow-[10px_10px]',
        'text-shadow-[var(--value)]',
        'text-shadow-[shadow:var(--value)]',

        'text-shadow-sm/25',
        'text-shadow-[12px_12px_#0088cc]/25',
        'text-shadow-[12px_12px_var(--value)]/25',
        'text-shadow-[10px_10px]/25',

        // Colors
        'text-shadow-red-500',
        'text-shadow-red-500/50',
        'text-shadow-red-500/2.25',
        'text-shadow-red-500/2.5',
        'text-shadow-red-500/2.75',
        'text-shadow-red-500/[0.5]',
        'text-shadow-red-500/[50%]',
        'text-shadow-current',
        'text-shadow-current/50',
        'text-shadow-current/[0.5]',
        'text-shadow-current/[50%]',
        'text-shadow-inherit',
        'text-shadow-transparent',
        'text-shadow-[#0088cc]',
        'text-shadow-[#0088cc]/50',
        'text-shadow-[#0088cc]/[0.5]',
        'text-shadow-[#0088cc]/[50%]',
        'text-shadow-[color:var(--value)]',
        'text-shadow-[color:var(--value)]/50',
        'text-shadow-[color:var(--value)]/[0.5]',
        'text-shadow-[color:var(--value)]/[50%]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-text-shadow-color: initial;
          --tw-text-shadow-alpha: 100%;
        }
      }
    }

    :root, :host {
      --color-red-500: #ef4444;
    }

    .text-shadow-\\[12px_12px_var\\(--value\\)\\]\\/25 {
      --tw-text-shadow-alpha: 25%;
      text-shadow: 12px 12px var(--tw-text-shadow-color, var(--value));
    }

    @supports (color: lab(from red l a b)) {
      .text-shadow-\\[12px_12px_var\\(--value\\)\\]\\/25 {
        text-shadow: 12px 12px var(--tw-text-shadow-color, oklab(from var(--value) l a b / 25%));
      }
    }

    .text-shadow-\\[10px_10px\\]\\/25 {
      --tw-text-shadow-alpha: 25%;
      text-shadow: 10px 10px var(--tw-text-shadow-color, currentcolor);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-\\[10px_10px\\]\\/25 {
        text-shadow: 10px 10px var(--tw-text-shadow-color, color-mix(in oklab, currentcolor 25%, transparent));
      }
    }

    .text-shadow-\\[12px_12px_\\#0088cc\\]\\/25 {
      --tw-text-shadow-alpha: 25%;
      text-shadow: 12px 12px var(--tw-text-shadow-color, oklab(59.9824% -.067 -.124 / .25));
    }

    .text-shadow-sm\\/25 {
      --tw-text-shadow-alpha: 25%;
      text-shadow: 0px 1px 2px var(--tw-text-shadow-color, oklab(0% 0 0 / .25)), 0px 2px 2px var(--tw-text-shadow-color, oklab(0% 0 0 / .25));
    }

    .text-shadow-2xs {
      text-shadow: 0px 1px 0px var(--tw-text-shadow-color, #0000001a);
    }

    .text-shadow-\\[\\#0088cc\\] {
      --tw-text-shadow-color: #08c;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-\\[\\#0088cc\\] {
        --tw-text-shadow-color: color-mix(in oklab, #08c var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-\\[\\#0088cc\\]\\/50 {
      --tw-text-shadow-color: #0088cc80;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-\\[\\#0088cc\\]\\/50 {
        --tw-text-shadow-color: color-mix(in oklab, oklab(59.9824% -.067 -.124 / .5) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-\\[\\#0088cc\\]\\/\\[0\\.5\\] {
      --tw-text-shadow-color: #0088cc80;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-\\[\\#0088cc\\]\\/\\[0\\.5\\] {
        --tw-text-shadow-color: color-mix(in oklab, oklab(59.9824% -.067 -.124 / .5) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-text-shadow-color: #0088cc80;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-\\[\\#0088cc\\]\\/\\[50\\%\\] {
        --tw-text-shadow-color: color-mix(in oklab, oklab(59.9824% -.067 -.124 / .5) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-\\[10px_10px\\] {
      text-shadow: 10px 10px var(--tw-text-shadow-color, currentcolor);
    }

    .text-shadow-\\[12px_12px_\\#0088cc\\] {
      text-shadow: 12px 12px var(--tw-text-shadow-color, #08c);
    }

    .text-shadow-\\[12px_12px_var\\(--value\\)\\] {
      text-shadow: 12px 12px var(--tw-text-shadow-color, var(--value));
    }

    .text-shadow-\\[color\\:var\\(--value\\)\\] {
      --tw-text-shadow-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-\\[color\\:var\\(--value\\)\\] {
        --tw-text-shadow-color: color-mix(in oklab, var(--value) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-\\[color\\:var\\(--value\\)\\]\\/50 {
      --tw-text-shadow-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-\\[color\\:var\\(--value\\)\\]\\/50 {
        --tw-text-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--value) 50%, transparent) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-\\[color\\:var\\(--value\\)\\]\\/\\[0\\.5\\] {
      --tw-text-shadow-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-\\[color\\:var\\(--value\\)\\]\\/\\[0\\.5\\] {
        --tw-text-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--value) 50%, transparent) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-\\[color\\:var\\(--value\\)\\]\\/\\[50\\%\\] {
      --tw-text-shadow-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-\\[color\\:var\\(--value\\)\\]\\/\\[50\\%\\] {
        --tw-text-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--value) 50%, transparent) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-\\[shadow\\:var\\(--value\\)\\], .text-shadow-\\[var\\(--value\\)\\] {
      text-shadow: var(--value);
    }

    .text-shadow-current {
      --tw-text-shadow-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-current {
        --tw-text-shadow-color: color-mix(in oklab, currentcolor var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-current\\/50 {
      --tw-text-shadow-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-current\\/50 {
        --tw-text-shadow-color: color-mix(in oklab, color-mix(in oklab, currentcolor 50%, transparent) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-current\\/\\[0\\.5\\] {
      --tw-text-shadow-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-current\\/\\[0\\.5\\] {
        --tw-text-shadow-color: color-mix(in oklab, color-mix(in oklab, currentcolor 50%, transparent) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-current\\/\\[50\\%\\] {
      --tw-text-shadow-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-current\\/\\[50\\%\\] {
        --tw-text-shadow-color: color-mix(in oklab, color-mix(in oklab, currentcolor 50%, transparent) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-inherit {
      --tw-text-shadow-color: inherit;
    }

    .text-shadow-none {
      text-shadow: none;
    }

    .text-shadow-red-500 {
      --tw-text-shadow-color: #ef4444;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-red-500 {
        --tw-text-shadow-color: color-mix(in oklab, var(--color-red-500) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-red-500\\/2\\.5 {
      --tw-text-shadow-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-red-500\\/2\\.5 {
        --tw-text-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 2.5%, transparent) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-red-500\\/2\\.25 {
      --tw-text-shadow-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-red-500\\/2\\.25 {
        --tw-text-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 2.25%, transparent) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-red-500\\/2\\.75 {
      --tw-text-shadow-color: #ef444407;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-red-500\\/2\\.75 {
        --tw-text-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 2.75%, transparent) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-red-500\\/50 {
      --tw-text-shadow-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-red-500\\/50 {
        --tw-text-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 50%, transparent) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-red-500\\/\\[0\\.5\\] {
      --tw-text-shadow-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-red-500\\/\\[0\\.5\\] {
        --tw-text-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 50%, transparent) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-red-500\\/\\[50\\%\\] {
      --tw-text-shadow-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-red-500\\/\\[50\\%\\] {
        --tw-text-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 50%, transparent) var(--tw-text-shadow-alpha), transparent);
      }
    }

    .text-shadow-sm {
      text-shadow: 0px 1px 2px var(--tw-text-shadow-color, #0000000f), 0px 2px 2px var(--tw-text-shadow-color, #0000000f);
    }

    .text-shadow-transparent {
      --tw-text-shadow-color: transparent;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .text-shadow-transparent {
        --tw-text-shadow-color: color-mix(in oklab, transparent var(--tw-text-shadow-alpha), transparent);
      }
    }

    @property --tw-text-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-text-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }"
  `)
  expect(
    await run([
      '-shadow-xl',
      '-shadow-none',
      '-shadow-red-500',
      '-shadow-red-500/50',
      '-shadow-red-500/[0.5]',
      '-shadow-red-500/[50%]',
      '-shadow-current',
      '-shadow-current/50',
      '-shadow-current/[0.5]',
      '-shadow-current/[50%]',
      '-shadow-inherit',
      '-shadow-transparent',
      '-shadow-[#0088cc]',
      '-shadow-[#0088cc]/50',
      '-shadow-[#0088cc]/[0.5]',
      '-shadow-[#0088cc]/[50%]',
      '-shadow-[var(--value)]',
    ]),
  ).toEqual('')
})

test('shadow', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --box-shadow-color-blue-500: #3b82f6;
          --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
          --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
        @tailwind utilities;
      `,
      [
        // Shadows
        'shadow-sm',
        'shadow-xl',
        'shadow-none',
        'shadow-[12px_12px_#0088cc]',
        'shadow-[12px_12px_var(--value)]',
        'shadow-[10px_10px]',
        'shadow-[var(--value)]',
        'shadow-[shadow:var(--value)]',

        'shadow-sm/25',
        'shadow-[12px_12px_#0088cc]/25',
        'shadow-[12px_12px_var(--value)]/25',
        'shadow-[10px_10px]/25',

        // Colors
        'shadow-red-500',
        'shadow-red-500/50',
        'shadow-red-500/2.25',
        'shadow-red-500/2.5',
        'shadow-red-500/2.75',
        'shadow-red-500/[0.5]',
        'shadow-red-500/[50%]',
        'shadow-blue-500',
        'shadow-current',
        'shadow-current/50',
        'shadow-current/[0.5]',
        'shadow-current/[50%]',
        'shadow-inherit',
        'shadow-transparent',
        'shadow-[#0088cc]',
        'shadow-[#0088cc]/50',
        'shadow-[#0088cc]/[0.5]',
        'shadow-[#0088cc]/[50%]',
        'shadow-[color:var(--value)]',
        'shadow-[color:var(--value)]/50',
        'shadow-[color:var(--value)]/[0.5]',
        'shadow-[color:var(--value)]/[50%]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-shadow: 0 0 #0000;
          --tw-shadow-color: initial;
          --tw-shadow-alpha: 100%;
          --tw-inset-shadow: 0 0 #0000;
          --tw-inset-shadow-color: initial;
          --tw-inset-shadow-alpha: 100%;
          --tw-ring-color: initial;
          --tw-ring-shadow: 0 0 #0000;
          --tw-inset-ring-color: initial;
          --tw-inset-ring-shadow: 0 0 #0000;
          --tw-ring-inset: initial;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-offset-shadow: 0 0 #0000;
        }
      }
    }

    :root, :host {
      --color-red-500: #ef4444;
      --box-shadow-color-blue-500: #3b82f6;
    }

    .shadow-\\[12px_12px_var\\(--value\\)\\]\\/25 {
      --tw-shadow-alpha: 25%;
      --tw-shadow: 12px 12px var(--tw-shadow-color, var(--value));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    @supports (color: lab(from red l a b)) {
      .shadow-\\[12px_12px_var\\(--value\\)\\]\\/25 {
        --tw-shadow: 12px 12px var(--tw-shadow-color, oklab(from var(--value) l a b / 25%));
      }
    }

    .shadow-\\[10px_10px\\]\\/25 {
      --tw-shadow-alpha: 25%;
      --tw-shadow: 10px 10px var(--tw-shadow-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-\\[10px_10px\\]\\/25 {
        --tw-shadow: 10px 10px var(--tw-shadow-color, color-mix(in oklab, currentcolor 25%, transparent));
      }
    }

    .shadow-\\[12px_12px_\\#0088cc\\]\\/25 {
      --tw-shadow-alpha: 25%;
      --tw-shadow: 12px 12px var(--tw-shadow-color, oklab(59.9824% -.067 -.124 / .25));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-sm\\/25 {
      --tw-shadow-alpha: 25%;
      --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, oklab(0% 0 0 / .25)), 0 1px 2px -1px var(--tw-shadow-color, oklab(0% 0 0 / .25));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-\\[10px_10px\\] {
      --tw-shadow: 10px 10px var(--tw-shadow-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-\\[12px_12px_\\#0088cc\\] {
      --tw-shadow: 12px 12px var(--tw-shadow-color, #08c);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-\\[12px_12px_var\\(--value\\)\\] {
      --tw-shadow: 12px 12px var(--tw-shadow-color, var(--value));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-\\[shadow\\:var\\(--value\\)\\], .shadow-\\[var\\(--value\\)\\] {
      --tw-shadow: var(--value);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-none {
      --tw-shadow: 0 0 #0000;
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-sm {
      --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, #0000001a), 0 1px 2px -1px var(--tw-shadow-color, #0000001a);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-xl {
      --tw-shadow: 0 20px 25px -5px var(--tw-shadow-color, #0000001a), 0 8px 10px -6px var(--tw-shadow-color, #0000001a);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-\\[\\#0088cc\\] {
      --tw-shadow-color: #08c;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-\\[\\#0088cc\\] {
        --tw-shadow-color: color-mix(in oklab, #08c var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-\\[\\#0088cc\\]\\/50 {
      --tw-shadow-color: #0088cc80;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-\\[\\#0088cc\\]\\/50 {
        --tw-shadow-color: color-mix(in oklab, oklab(59.9824% -.067 -.124 / .5) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-\\[\\#0088cc\\]\\/\\[0\\.5\\] {
      --tw-shadow-color: #0088cc80;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-\\[\\#0088cc\\]\\/\\[0\\.5\\] {
        --tw-shadow-color: color-mix(in oklab, oklab(59.9824% -.067 -.124 / .5) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-shadow-color: #0088cc80;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-\\[\\#0088cc\\]\\/\\[50\\%\\] {
        --tw-shadow-color: color-mix(in oklab, oklab(59.9824% -.067 -.124 / .5) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-\\[color\\:var\\(--value\\)\\] {
      --tw-shadow-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-\\[color\\:var\\(--value\\)\\] {
        --tw-shadow-color: color-mix(in oklab, var(--value) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-\\[color\\:var\\(--value\\)\\]\\/50 {
      --tw-shadow-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-\\[color\\:var\\(--value\\)\\]\\/50 {
        --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--value) 50%, transparent) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-\\[color\\:var\\(--value\\)\\]\\/\\[0\\.5\\] {
      --tw-shadow-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-\\[color\\:var\\(--value\\)\\]\\/\\[0\\.5\\] {
        --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--value) 50%, transparent) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-\\[color\\:var\\(--value\\)\\]\\/\\[50\\%\\] {
      --tw-shadow-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-\\[color\\:var\\(--value\\)\\]\\/\\[50\\%\\] {
        --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--value) 50%, transparent) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-blue-500 {
      --tw-shadow-color: #3b82f6;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-blue-500 {
        --tw-shadow-color: color-mix(in oklab, var(--box-shadow-color-blue-500) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-current {
      --tw-shadow-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-current {
        --tw-shadow-color: color-mix(in oklab, currentcolor var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-current\\/50 {
      --tw-shadow-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-current\\/50 {
        --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, currentcolor 50%, transparent) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-current\\/\\[0\\.5\\] {
      --tw-shadow-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-current\\/\\[0\\.5\\] {
        --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, currentcolor 50%, transparent) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-current\\/\\[50\\%\\] {
      --tw-shadow-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-current\\/\\[50\\%\\] {
        --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, currentcolor 50%, transparent) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-inherit {
      --tw-shadow-color: inherit;
    }

    .shadow-red-500 {
      --tw-shadow-color: #ef4444;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-red-500 {
        --tw-shadow-color: color-mix(in oklab, var(--color-red-500) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-red-500\\/2\\.5 {
      --tw-shadow-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-red-500\\/2\\.5 {
        --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 2.5%, transparent) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-red-500\\/2\\.25 {
      --tw-shadow-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-red-500\\/2\\.25 {
        --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 2.25%, transparent) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-red-500\\/2\\.75 {
      --tw-shadow-color: #ef444407;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-red-500\\/2\\.75 {
        --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 2.75%, transparent) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-red-500\\/50 {
      --tw-shadow-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-red-500\\/50 {
        --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 50%, transparent) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-red-500\\/\\[0\\.5\\] {
      --tw-shadow-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-red-500\\/\\[0\\.5\\] {
        --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 50%, transparent) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-red-500\\/\\[50\\%\\] {
      --tw-shadow-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-red-500\\/\\[50\\%\\] {
        --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 50%, transparent) var(--tw-shadow-alpha), transparent);
      }
    }

    .shadow-transparent {
      --tw-shadow-color: transparent;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .shadow-transparent {
        --tw-shadow-color: color-mix(in oklab, transparent var(--tw-shadow-alpha), transparent);
      }
    }

    @property --tw-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-inset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-inset-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-ring-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-ring-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-ring-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-inset-ring-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-ring-inset {
      syntax: "*";
      inherits: false
    }

    @property --tw-ring-offset-width {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-ring-offset-color {
      syntax: "*";
      inherits: false;
      initial-value: #fff;
    }

    @property --tw-ring-offset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }"
  `)
  expect(
    await run([
      '-shadow-xl',
      '-shadow-none',
      '-shadow-red-500',
      '-shadow-red-500/50',
      '-shadow-red-500/[0.5]',
      '-shadow-red-500/[50%]',
      '-shadow-current',
      '-shadow-current/50',
      '-shadow-current/[0.5]',
      '-shadow-current/[50%]',
      '-shadow-inherit',
      '-shadow-transparent',
      '-shadow-[#0088cc]',
      '-shadow-[#0088cc]/50',
      '-shadow-[#0088cc]/[0.5]',
      '-shadow-[#0088cc]/[50%]',
      '-shadow-[var(--value)]',
    ]),
  ).toEqual('')
})

test('inset-shadow', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --inset-shadow: inset 0 2px 4px rgb(0 0 0 / 0.05);
          --inset-shadow-sm: inset 0 1px 1px rgb(0 0 0 / 0.05);
        }
        @tailwind utilities;
      `,
      [
        // Shadows
        'inset-shadow',
        'inset-shadow-sm',
        'inset-shadow-none',
        'inset-shadow-[12px_12px_#0088cc]',
        'inset-shadow-[12px_12px_var(--value)]',
        'inset-shadow-[10px_10px]',
        'inset-shadow-[var(--value)]',
        'inset-shadow-[shadow:var(--value)]',
        'inset-shadow-[12px_12px_#0088cc,12px_12px_var(--value,#0088cc)]',

        'inset-shadow-sm/25',
        'inset-shadow-[12px_12px_#0088cc]/25',
        'inset-shadow-[12px_12px_var(--value)]/25',
        'inset-shadow-[10px_10px]/25',
        'inset-shadow-[12px_12px_#0088cc,12px_12px_var(--value,#0088cc)]/25',

        // Colors
        'inset-shadow-red-500',
        'inset-shadow-red-500/50',
        'inset-shadow-red-500/2.25',
        'inset-shadow-red-500/2.5',
        'inset-shadow-red-500/2.75',
        'inset-shadow-red-500/[0.5]',
        'inset-shadow-red-500/[50%]',
        'inset-shadow-current',
        'inset-shadow-current/50',
        'inset-shadow-current/[0.5]',
        'inset-shadow-current/[50%]',
        'inset-shadow-inherit',
        'inset-shadow-transparent',
        'inset-shadow-[#0088cc]',
        'inset-shadow-[#0088cc]/50',
        'inset-shadow-[#0088cc]/[0.5]',
        'inset-shadow-[#0088cc]/[50%]',
        'inset-shadow-[color:var(--value)]',
        'inset-shadow-[color:var(--value)]/50',
        'inset-shadow-[color:var(--value)]/[0.5]',
        'inset-shadow-[color:var(--value)]/[50%]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-shadow: 0 0 #0000;
          --tw-shadow-color: initial;
          --tw-shadow-alpha: 100%;
          --tw-inset-shadow: 0 0 #0000;
          --tw-inset-shadow-color: initial;
          --tw-inset-shadow-alpha: 100%;
          --tw-ring-color: initial;
          --tw-ring-shadow: 0 0 #0000;
          --tw-inset-ring-color: initial;
          --tw-inset-ring-shadow: 0 0 #0000;
          --tw-ring-inset: initial;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-offset-shadow: 0 0 #0000;
        }
      }
    }

    :root, :host {
      --color-red-500: #ef4444;
    }

    .inset-shadow-\\[12px_12px_\\#0088cc\\,12px_12px_var\\(--value\\,\\#0088cc\\)\\]\\/25 {
      --tw-inset-shadow-alpha: 25%;
      --tw-inset-shadow: inset 12px 12px var(--tw-inset-shadow-color, #08c), inset 12px 12px var(--tw-inset-shadow-color, var(--value, #08c));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    @supports (color: lab(from red l a b)) {
      .inset-shadow-\\[12px_12px_\\#0088cc\\,12px_12px_var\\(--value\\,\\#0088cc\\)\\]\\/25 {
        --tw-inset-shadow: inset 12px 12px var(--tw-inset-shadow-color, oklab(59.9824% -.067 -.124 / .25)), inset 12px 12px var(--tw-inset-shadow-color, oklab(from var(--value, #08c) l a b / 25%));
      }
    }

    .inset-shadow-\\[12px_12px_var\\(--value\\)\\]\\/25 {
      --tw-inset-shadow-alpha: 25%;
      --tw-inset-shadow: inset 12px 12px var(--tw-inset-shadow-color, var(--value));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    @supports (color: lab(from red l a b)) {
      .inset-shadow-\\[12px_12px_var\\(--value\\)\\]\\/25 {
        --tw-inset-shadow: inset 12px 12px var(--tw-inset-shadow-color, oklab(from var(--value) l a b / 25%));
      }
    }

    .inset-shadow-\\[10px_10px\\]\\/25 {
      --tw-inset-shadow-alpha: 25%;
      --tw-inset-shadow: inset 10px 10px var(--tw-inset-shadow-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-\\[10px_10px\\]\\/25 {
        --tw-inset-shadow: inset 10px 10px var(--tw-inset-shadow-color, color-mix(in oklab, currentcolor 25%, transparent));
      }
    }

    .inset-shadow-\\[12px_12px_\\#0088cc\\]\\/25 {
      --tw-inset-shadow-alpha: 25%;
      --tw-inset-shadow: inset 12px 12px var(--tw-inset-shadow-color, oklab(59.9824% -.067 -.124 / .25));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-sm\\/25 {
      --tw-inset-shadow-alpha: 25%;
      --tw-inset-shadow: inset 0 1px 1px var(--tw-inset-shadow-color, oklab(0% 0 0 / .25));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow {
      --tw-inset-shadow: inset 0 2px 4px var(--tw-inset-shadow-color, #0000000d);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-\\[10px_10px\\] {
      --tw-inset-shadow: inset 10px 10px var(--tw-inset-shadow-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-\\[12px_12px_\\#0088cc\\,12px_12px_var\\(--value\\,\\#0088cc\\)\\] {
      --tw-inset-shadow: inset 12px 12px var(--tw-inset-shadow-color, #08c), inset 12px 12px var(--tw-inset-shadow-color, var(--value, #08c));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-\\[12px_12px_\\#0088cc\\] {
      --tw-inset-shadow: inset 12px 12px var(--tw-inset-shadow-color, #08c);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-\\[12px_12px_var\\(--value\\)\\] {
      --tw-inset-shadow: inset 12px 12px var(--tw-inset-shadow-color, var(--value));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-\\[shadow\\:var\\(--value\\)\\], .inset-shadow-\\[var\\(--value\\)\\] {
      --tw-inset-shadow: inset var(--value);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-none {
      --tw-inset-shadow: 0 0 #0000;
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-sm {
      --tw-inset-shadow: inset 0 1px 1px var(--tw-inset-shadow-color, #0000000d);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-\\[\\#0088cc\\] {
      --tw-inset-shadow-color: #08c;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-\\[\\#0088cc\\] {
        --tw-inset-shadow-color: color-mix(in oklab, #08c var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-\\[\\#0088cc\\]\\/50 {
      --tw-inset-shadow-color: #0088cc80;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-\\[\\#0088cc\\]\\/50 {
        --tw-inset-shadow-color: color-mix(in oklab, oklab(59.9824% -.067 -.124 / .5) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-\\[\\#0088cc\\]\\/\\[0\\.5\\] {
      --tw-inset-shadow-color: #0088cc80;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-\\[\\#0088cc\\]\\/\\[0\\.5\\] {
        --tw-inset-shadow-color: color-mix(in oklab, oklab(59.9824% -.067 -.124 / .5) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-inset-shadow-color: #0088cc80;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-\\[\\#0088cc\\]\\/\\[50\\%\\] {
        --tw-inset-shadow-color: color-mix(in oklab, oklab(59.9824% -.067 -.124 / .5) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-\\[color\\:var\\(--value\\)\\] {
      --tw-inset-shadow-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-\\[color\\:var\\(--value\\)\\] {
        --tw-inset-shadow-color: color-mix(in oklab, var(--value) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-\\[color\\:var\\(--value\\)\\]\\/50 {
      --tw-inset-shadow-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-\\[color\\:var\\(--value\\)\\]\\/50 {
        --tw-inset-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--value) 50%, transparent) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-\\[color\\:var\\(--value\\)\\]\\/\\[0\\.5\\] {
      --tw-inset-shadow-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-\\[color\\:var\\(--value\\)\\]\\/\\[0\\.5\\] {
        --tw-inset-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--value) 50%, transparent) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-\\[color\\:var\\(--value\\)\\]\\/\\[50\\%\\] {
      --tw-inset-shadow-color: var(--value);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-\\[color\\:var\\(--value\\)\\]\\/\\[50\\%\\] {
        --tw-inset-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--value) 50%, transparent) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-current {
      --tw-inset-shadow-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-current {
        --tw-inset-shadow-color: color-mix(in oklab, currentcolor var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-current\\/50 {
      --tw-inset-shadow-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-current\\/50 {
        --tw-inset-shadow-color: color-mix(in oklab, color-mix(in oklab, currentcolor 50%, transparent) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-current\\/\\[0\\.5\\] {
      --tw-inset-shadow-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-current\\/\\[0\\.5\\] {
        --tw-inset-shadow-color: color-mix(in oklab, color-mix(in oklab, currentcolor 50%, transparent) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-current\\/\\[50\\%\\] {
      --tw-inset-shadow-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-current\\/\\[50\\%\\] {
        --tw-inset-shadow-color: color-mix(in oklab, color-mix(in oklab, currentcolor 50%, transparent) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-inherit {
      --tw-inset-shadow-color: inherit;
    }

    .inset-shadow-red-500 {
      --tw-inset-shadow-color: #ef4444;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-red-500 {
        --tw-inset-shadow-color: color-mix(in oklab, var(--color-red-500) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-red-500\\/2\\.5 {
      --tw-inset-shadow-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-red-500\\/2\\.5 {
        --tw-inset-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 2.5%, transparent) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-red-500\\/2\\.25 {
      --tw-inset-shadow-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-red-500\\/2\\.25 {
        --tw-inset-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 2.25%, transparent) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-red-500\\/2\\.75 {
      --tw-inset-shadow-color: #ef444407;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-red-500\\/2\\.75 {
        --tw-inset-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 2.75%, transparent) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-red-500\\/50 {
      --tw-inset-shadow-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-red-500\\/50 {
        --tw-inset-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 50%, transparent) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-red-500\\/\\[0\\.5\\] {
      --tw-inset-shadow-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-red-500\\/\\[0\\.5\\] {
        --tw-inset-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 50%, transparent) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-red-500\\/\\[50\\%\\] {
      --tw-inset-shadow-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-red-500\\/\\[50\\%\\] {
        --tw-inset-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-red-500) 50%, transparent) var(--tw-inset-shadow-alpha), transparent);
      }
    }

    .inset-shadow-transparent {
      --tw-inset-shadow-color: transparent;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-shadow-transparent {
        --tw-inset-shadow-color: color-mix(in oklab, transparent var(--tw-inset-shadow-alpha), transparent);
      }
    }

    @property --tw-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-inset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-inset-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-ring-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-ring-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-ring-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-inset-ring-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-ring-inset {
      syntax: "*";
      inherits: false
    }

    @property --tw-ring-offset-width {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-ring-offset-color {
      syntax: "*";
      inherits: false;
      initial-value: #fff;
    }

    @property --tw-ring-offset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }"
  `)
  expect(
    await run([
      '-inset-shadow-sm',
      '-inset-shadow-none',
      '-inset-shadow-red-500',
      '-inset-shadow-red-500/50',
      '-inset-shadow-red-500/[0.5]',
      '-inset-shadow-red-500/[50%]',
      '-inset-shadow-current',
      '-inset-shadow-current/50',
      '-inset-shadow-current/[0.5]',
      '-inset-shadow-current/[50%]',
      '-inset-shadow-inherit',
      '-inset-shadow-transparent',
      '-inset-shadow-[#0088cc]',
      '-inset-shadow-[#0088cc]/50',
      '-inset-shadow-[#0088cc]/[0.5]',
      '-inset-shadow-[#0088cc]/[50%]',
      '-inset-shadow-[var(--value)]',
    ]),
  ).toEqual('')
})

test('ring', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --ring-color-blue-500: #3b82f6;
        }
        @tailwind utilities;
      `,
      [
        // ring color
        'ring-inset',
        'ring-red-500',
        'ring-red-500/50',
        'ring-red-500/2.25',
        'ring-red-500/2.5',
        'ring-red-500/2.75',
        'ring-red-500/[0.5]',
        'ring-red-500/[50%]',
        'ring-blue-500',
        'ring-current',
        'ring-current/50',
        'ring-current/[0.5]',
        'ring-current/[50%]',
        'ring-inherit',
        'ring-transparent',
        'ring-[#0088cc]',
        'ring-[#0088cc]/50',
        'ring-[#0088cc]/[0.5]',
        'ring-[#0088cc]/[50%]',
        'ring-[var(--my-color)]',
        'ring-[var(--my-color)]/50',
        'ring-[var(--my-color)]/[0.5]',
        'ring-[var(--my-color)]/[50%]',
        'ring-[color:var(--my-color)]',
        'ring-[color:var(--my-color)]/50',
        'ring-[color:var(--my-color)]/[0.5]',
        'ring-[color:var(--my-color)]/[50%]',

        // ring width
        'ring',
        'ring-0',
        'ring-1',
        'ring-2',
        'ring-4',
        'ring-[12px]',
        'ring-[length:var(--my-width)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-shadow: 0 0 #0000;
          --tw-shadow-color: initial;
          --tw-shadow-alpha: 100%;
          --tw-inset-shadow: 0 0 #0000;
          --tw-inset-shadow-color: initial;
          --tw-inset-shadow-alpha: 100%;
          --tw-ring-color: initial;
          --tw-ring-shadow: 0 0 #0000;
          --tw-inset-ring-color: initial;
          --tw-inset-ring-shadow: 0 0 #0000;
          --tw-ring-inset: initial;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-offset-shadow: 0 0 #0000;
        }
      }
    }

    :root, :host {
      --color-red-500: #ef4444;
      --ring-color-blue-500: #3b82f6;
    }

    .ring {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-0 {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-1 {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-2 {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-4 {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-\\[12px\\] {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(12px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-\\[length\\:var\\(--my-width\\)\\] {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(var(--my-width)  + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-\\[\\#0088cc\\] {
      --tw-ring-color: #08c;
    }

    .ring-\\[\\#0088cc\\]\\/50, .ring-\\[\\#0088cc\\]\\/\\[0\\.5\\], .ring-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-ring-color: oklab(59.9824% -.067 -.124 / .5);
    }

    .ring-\\[color\\:var\\(--my-color\\)\\], .ring-\\[color\\:var\\(--my-color\\)\\]\\/50 {
      --tw-ring-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-\\[color\\:var\\(--my-color\\)\\]\\/50 {
        --tw-ring-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .ring-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      --tw-ring-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        --tw-ring-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .ring-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      --tw-ring-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        --tw-ring-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .ring-\\[var\\(--my-color\\)\\], .ring-\\[var\\(--my-color\\)\\]\\/50 {
      --tw-ring-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-\\[var\\(--my-color\\)\\]\\/50 {
        --tw-ring-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .ring-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      --tw-ring-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        --tw-ring-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .ring-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      --tw-ring-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        --tw-ring-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .ring-blue-500 {
      --tw-ring-color: var(--ring-color-blue-500);
    }

    .ring-current, .ring-current\\/50 {
      --tw-ring-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-current\\/50 {
        --tw-ring-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .ring-current\\/\\[0\\.5\\] {
      --tw-ring-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-current\\/\\[0\\.5\\] {
        --tw-ring-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .ring-current\\/\\[50\\%\\] {
      --tw-ring-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-current\\/\\[50\\%\\] {
        --tw-ring-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .ring-inherit {
      --tw-ring-color: inherit;
    }

    .ring-red-500 {
      --tw-ring-color: var(--color-red-500);
    }

    .ring-red-500\\/2\\.5 {
      --tw-ring-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-red-500\\/2\\.5 {
        --tw-ring-color: color-mix(in oklab, var(--color-red-500) 2.5%, transparent);
      }
    }

    .ring-red-500\\/2\\.25 {
      --tw-ring-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-red-500\\/2\\.25 {
        --tw-ring-color: color-mix(in oklab, var(--color-red-500) 2.25%, transparent);
      }
    }

    .ring-red-500\\/2\\.75 {
      --tw-ring-color: #ef444407;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-red-500\\/2\\.75 {
        --tw-ring-color: color-mix(in oklab, var(--color-red-500) 2.75%, transparent);
      }
    }

    .ring-red-500\\/50 {
      --tw-ring-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-red-500\\/50 {
        --tw-ring-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .ring-red-500\\/\\[0\\.5\\] {
      --tw-ring-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-red-500\\/\\[0\\.5\\] {
        --tw-ring-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .ring-red-500\\/\\[50\\%\\] {
      --tw-ring-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-red-500\\/\\[50\\%\\] {
        --tw-ring-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .ring-transparent {
      --tw-ring-color: transparent;
    }

    .ring-inset {
      --tw-ring-inset: inset;
    }

    @property --tw-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-inset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-inset-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-ring-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-ring-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-ring-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-inset-ring-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-ring-inset {
      syntax: "*";
      inherits: false
    }

    @property --tw-ring-offset-width {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-ring-offset-color {
      syntax: "*";
      inherits: false;
      initial-value: #fff;
    }

    @property --tw-ring-offset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme {
          --default-ring-width: 2px;
        }
        @tailwind utilities;
      `,
      ['ring'],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-shadow: 0 0 #0000;
          --tw-shadow-color: initial;
          --tw-shadow-alpha: 100%;
          --tw-inset-shadow: 0 0 #0000;
          --tw-inset-shadow-color: initial;
          --tw-inset-shadow-alpha: 100%;
          --tw-ring-color: initial;
          --tw-ring-shadow: 0 0 #0000;
          --tw-inset-ring-color: initial;
          --tw-inset-ring-shadow: 0 0 #0000;
          --tw-ring-inset: initial;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-offset-shadow: 0 0 #0000;
        }
      }
    }

    .ring {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    @property --tw-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-inset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-inset-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-ring-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-ring-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-ring-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-inset-ring-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-ring-inset {
      syntax: "*";
      inherits: false
    }

    @property --tw-ring-offset-width {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-ring-offset-color {
      syntax: "*";
      inherits: false;
      initial-value: #fff;
    }

    @property --tw-ring-offset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }"
  `)
  expect(
    await run([
      // ring color
      '-ring-inset',
      '-ring-red-500',
      '-ring-red-500/50',
      '-ring-red-500/[0.5]',
      '-ring-red-500/[50%]',
      '-ring-current',
      '-ring-current/50',
      '-ring-current/[0.5]',
      '-ring-current/[50%]',
      '-ring-inherit',
      '-ring-transparent',
      '-ring-[#0088cc]',
      '-ring-[#0088cc]/50',
      '-ring-[#0088cc]/[0.5]',
      '-ring-[#0088cc]/[50%]',

      // ring width
      '-ring',
      'ring--1',
      '-ring-0',
      '-ring-1',
      '-ring-2',
      '-ring-4',

      'ring/foo',
      'ring-0/foo',
      'ring-1/foo',
      'ring-2/foo',
      'ring-4/foo',
      'ring-[12px]/foo',
      'ring-[length:var(--my-width)]/foo',
    ]),
  ).toEqual('')
})

test('inset-ring', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        // ring color
        'inset-ring-red-500',
        'inset-ring-red-500/50',
        'inset-ring-red-500/2.25',
        'inset-ring-red-500/2.5',
        'inset-ring-red-500/2.75',
        'inset-ring-red-500/[0.5]',
        'inset-ring-red-500/[50%]',
        'inset-ring-current',
        'inset-ring-current/50',
        'inset-ring-current/[0.5]',
        'inset-ring-current/[50%]',
        'inset-ring-inherit',
        'inset-ring-transparent',
        'inset-ring-[#0088cc]',
        'inset-ring-[#0088cc]/50',
        'inset-ring-[#0088cc]/[0.5]',
        'inset-ring-[#0088cc]/[50%]',
        'inset-ring-[var(--my-color)]',
        'inset-ring-[var(--my-color)]/50',
        'inset-ring-[var(--my-color)]/[0.5]',
        'inset-ring-[var(--my-color)]/[50%]',
        'inset-ring-[color:var(--my-color)]',
        'inset-ring-[color:var(--my-color)]/50',
        'inset-ring-[color:var(--my-color)]/[0.5]',
        'inset-ring-[color:var(--my-color)]/[50%]',

        // ring width
        'inset-ring',
        'inset-ring-0',
        'inset-ring-1',
        'inset-ring-2',
        'inset-ring-4',
        'inset-ring-[12px]',
        'inset-ring-[length:var(--my-width)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-shadow: 0 0 #0000;
          --tw-shadow-color: initial;
          --tw-shadow-alpha: 100%;
          --tw-inset-shadow: 0 0 #0000;
          --tw-inset-shadow-color: initial;
          --tw-inset-shadow-alpha: 100%;
          --tw-ring-color: initial;
          --tw-ring-shadow: 0 0 #0000;
          --tw-inset-ring-color: initial;
          --tw-inset-ring-shadow: 0 0 #0000;
          --tw-ring-inset: initial;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-offset-shadow: 0 0 #0000;
        }
      }
    }

    :root, :host {
      --color-red-500: #ef4444;
    }

    .inset-ring {
      --tw-inset-ring-shadow: inset 0 0 0 1px var(--tw-inset-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-0 {
      --tw-inset-ring-shadow: inset 0 0 0 0px var(--tw-inset-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-1 {
      --tw-inset-ring-shadow: inset 0 0 0 1px var(--tw-inset-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-2 {
      --tw-inset-ring-shadow: inset 0 0 0 2px var(--tw-inset-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-4 {
      --tw-inset-ring-shadow: inset 0 0 0 4px var(--tw-inset-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-\\[12px\\] {
      --tw-inset-ring-shadow: inset 0 0 0 12px var(--tw-inset-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-\\[length\\:var\\(--my-width\\)\\] {
      --tw-inset-ring-shadow: inset 0 0 0 var(--my-width) var(--tw-inset-ring-color, currentcolor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-\\[\\#0088cc\\] {
      --tw-inset-ring-color: #08c;
    }

    .inset-ring-\\[\\#0088cc\\]\\/50, .inset-ring-\\[\\#0088cc\\]\\/\\[0\\.5\\], .inset-ring-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-inset-ring-color: oklab(59.9824% -.067 -.124 / .5);
    }

    .inset-ring-\\[color\\:var\\(--my-color\\)\\], .inset-ring-\\[color\\:var\\(--my-color\\)\\]\\/50 {
      --tw-inset-ring-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-\\[color\\:var\\(--my-color\\)\\]\\/50 {
        --tw-inset-ring-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .inset-ring-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      --tw-inset-ring-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        --tw-inset-ring-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .inset-ring-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      --tw-inset-ring-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        --tw-inset-ring-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .inset-ring-\\[var\\(--my-color\\)\\], .inset-ring-\\[var\\(--my-color\\)\\]\\/50 {
      --tw-inset-ring-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-\\[var\\(--my-color\\)\\]\\/50 {
        --tw-inset-ring-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .inset-ring-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      --tw-inset-ring-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        --tw-inset-ring-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .inset-ring-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      --tw-inset-ring-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        --tw-inset-ring-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .inset-ring-current, .inset-ring-current\\/50 {
      --tw-inset-ring-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-current\\/50 {
        --tw-inset-ring-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .inset-ring-current\\/\\[0\\.5\\] {
      --tw-inset-ring-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-current\\/\\[0\\.5\\] {
        --tw-inset-ring-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .inset-ring-current\\/\\[50\\%\\] {
      --tw-inset-ring-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-current\\/\\[50\\%\\] {
        --tw-inset-ring-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .inset-ring-inherit {
      --tw-inset-ring-color: inherit;
    }

    .inset-ring-red-500 {
      --tw-inset-ring-color: var(--color-red-500);
    }

    .inset-ring-red-500\\/2\\.5 {
      --tw-inset-ring-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-red-500\\/2\\.5 {
        --tw-inset-ring-color: color-mix(in oklab, var(--color-red-500) 2.5%, transparent);
      }
    }

    .inset-ring-red-500\\/2\\.25 {
      --tw-inset-ring-color: #ef444406;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-red-500\\/2\\.25 {
        --tw-inset-ring-color: color-mix(in oklab, var(--color-red-500) 2.25%, transparent);
      }
    }

    .inset-ring-red-500\\/2\\.75 {
      --tw-inset-ring-color: #ef444407;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-red-500\\/2\\.75 {
        --tw-inset-ring-color: color-mix(in oklab, var(--color-red-500) 2.75%, transparent);
      }
    }

    .inset-ring-red-500\\/50 {
      --tw-inset-ring-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-red-500\\/50 {
        --tw-inset-ring-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .inset-ring-red-500\\/\\[0\\.5\\] {
      --tw-inset-ring-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-red-500\\/\\[0\\.5\\] {
        --tw-inset-ring-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .inset-ring-red-500\\/\\[50\\%\\] {
      --tw-inset-ring-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .inset-ring-red-500\\/\\[50\\%\\] {
        --tw-inset-ring-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .inset-ring-transparent {
      --tw-inset-ring-color: transparent;
    }

    @property --tw-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-inset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-inset-shadow-alpha {
      syntax: "<percentage>";
      inherits: false;
      initial-value: 100%;
    }

    @property --tw-ring-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-ring-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-ring-color {
      syntax: "*";
      inherits: false
    }

    @property --tw-inset-ring-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-ring-inset {
      syntax: "*";
      inherits: false
    }

    @property --tw-ring-offset-width {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-ring-offset-color {
      syntax: "*";
      inherits: false;
      initial-value: #fff;
    }

    @property --tw-ring-offset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }"
  `)
  expect(
    await run([
      // ring color
      '-inset-ring-red-500',
      '-inset-ring-red-500/50',
      '-inset-ring-red-500/[0.5]',
      '-inset-ring-red-500/[50%]',
      '-inset-ring-current',
      '-inset-ring-current/50',
      '-inset-ring-current/[0.5]',
      '-inset-ring-current/[50%]',
      '-inset-ring-inherit',
      '-inset-ring-transparent',
      '-inset-ring-[#0088cc]',
      '-inset-ring-[#0088cc]/50',
      '-inset-ring-[#0088cc]/[0.5]',
      '-inset-ring-[#0088cc]/[50%]',

      // ring width
      '-inset-ring',
      'inset-ring--1',
      '-inset-ring-0',
      '-inset-ring-1',
      '-inset-ring-2',
      '-inset-ring-4',

      'inset-ring/foo',
      'inset-ring-0/foo',
      'inset-ring-1/foo',
      'inset-ring-2/foo',
      'inset-ring-4/foo',
      'inset-ring-[12px]/foo',
      'inset-ring-[length:var(--my-width)]/foo',
    ]),
  ).toEqual('')
})

test('ring-offset', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --ring-offset-color-blue-500: #3b82f6;
        }
        @tailwind utilities;
      `,
      [
        // ring color
        'ring-offset-inset',
        'ring-offset-red-500',
        'ring-offset-red-500/50',
        'ring-offset-red-500/[0.5]',
        'ring-offset-red-500/[50%]',
        'ring-offset-blue-500',
        'ring-offset-current',
        'ring-offset-current/50',
        'ring-offset-current/[0.5]',
        'ring-offset-current/[50%]',
        'ring-offset-inherit',
        'ring-offset-transparent',
        'ring-offset-[#0088cc]',
        'ring-offset-[#0088cc]/50',
        'ring-offset-[#0088cc]/[0.5]',
        'ring-offset-[#0088cc]/[50%]',

        'ring-offset-[var(--my-color)]',
        'ring-offset-[var(--my-color)]/50',
        'ring-offset-[var(--my-color)]/[0.5]',
        'ring-offset-[var(--my-color)]/[50%]',
        'ring-offset-[color:var(--my-color)]',
        'ring-offset-[color:var(--my-color)]/50',
        'ring-offset-[color:var(--my-color)]/[0.5]',
        'ring-offset-[color:var(--my-color)]/[50%]',

        // ring width
        'ring-offset-0',
        'ring-offset-1',
        'ring-offset-2',
        'ring-offset-4',
        'ring-offset-[12px]',
        'ring-offset-[length:var(--my-width)]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root, :host {
      --color-red-500: #ef4444;
      --ring-offset-color-blue-500: #3b82f6;
    }

    .ring-offset-0 {
      --tw-ring-offset-width: 0px;
      --tw-ring-offset-shadow: var(--tw-ring-inset, ) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    }

    .ring-offset-1 {
      --tw-ring-offset-width: 1px;
      --tw-ring-offset-shadow: var(--tw-ring-inset, ) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    }

    .ring-offset-2 {
      --tw-ring-offset-width: 2px;
      --tw-ring-offset-shadow: var(--tw-ring-inset, ) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    }

    .ring-offset-4 {
      --tw-ring-offset-width: 4px;
      --tw-ring-offset-shadow: var(--tw-ring-inset, ) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    }

    .ring-offset-\\[12px\\] {
      --tw-ring-offset-width: 12px;
      --tw-ring-offset-shadow: var(--tw-ring-inset, ) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    }

    .ring-offset-\\[length\\:var\\(--my-width\\)\\] {
      --tw-ring-offset-width: var(--my-width);
      --tw-ring-offset-shadow: var(--tw-ring-inset, ) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    }

    .ring-offset-\\[\\#0088cc\\] {
      --tw-ring-offset-color: #08c;
    }

    .ring-offset-\\[\\#0088cc\\]\\/50, .ring-offset-\\[\\#0088cc\\]\\/\\[0\\.5\\], .ring-offset-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-ring-offset-color: oklab(59.9824% -.067 -.124 / .5);
    }

    .ring-offset-\\[color\\:var\\(--my-color\\)\\], .ring-offset-\\[color\\:var\\(--my-color\\)\\]\\/50 {
      --tw-ring-offset-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-offset-\\[color\\:var\\(--my-color\\)\\]\\/50 {
        --tw-ring-offset-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .ring-offset-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      --tw-ring-offset-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-offset-\\[color\\:var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        --tw-ring-offset-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .ring-offset-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      --tw-ring-offset-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-offset-\\[color\\:var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        --tw-ring-offset-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .ring-offset-\\[var\\(--my-color\\)\\], .ring-offset-\\[var\\(--my-color\\)\\]\\/50 {
      --tw-ring-offset-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-offset-\\[var\\(--my-color\\)\\]\\/50 {
        --tw-ring-offset-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .ring-offset-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
      --tw-ring-offset-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-offset-\\[var\\(--my-color\\)\\]\\/\\[0\\.5\\] {
        --tw-ring-offset-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .ring-offset-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
      --tw-ring-offset-color: var(--my-color);
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-offset-\\[var\\(--my-color\\)\\]\\/\\[50\\%\\] {
        --tw-ring-offset-color: color-mix(in oklab, var(--my-color) 50%, transparent);
      }
    }

    .ring-offset-blue-500 {
      --tw-ring-offset-color: var(--ring-offset-color-blue-500);
    }

    .ring-offset-current, .ring-offset-current\\/50 {
      --tw-ring-offset-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-offset-current\\/50 {
        --tw-ring-offset-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .ring-offset-current\\/\\[0\\.5\\] {
      --tw-ring-offset-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-offset-current\\/\\[0\\.5\\] {
        --tw-ring-offset-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .ring-offset-current\\/\\[50\\%\\] {
      --tw-ring-offset-color: currentcolor;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-offset-current\\/\\[50\\%\\] {
        --tw-ring-offset-color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }

    .ring-offset-inherit {
      --tw-ring-offset-color: inherit;
    }

    .ring-offset-red-500 {
      --tw-ring-offset-color: var(--color-red-500);
    }

    .ring-offset-red-500\\/50 {
      --tw-ring-offset-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-offset-red-500\\/50 {
        --tw-ring-offset-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .ring-offset-red-500\\/\\[0\\.5\\] {
      --tw-ring-offset-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-offset-red-500\\/\\[0\\.5\\] {
        --tw-ring-offset-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .ring-offset-red-500\\/\\[50\\%\\] {
      --tw-ring-offset-color: #ef444480;
    }

    @supports (color: color-mix(in lab, red, red)) {
      .ring-offset-red-500\\/\\[50\\%\\] {
        --tw-ring-offset-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
      }
    }

    .ring-offset-transparent {
      --tw-ring-offset-color: transparent;
    }"
  `)
  expect(
    await run([
      'ring-offset',
      // ring color
      '-ring-offset-inset',
      '-ring-offset-red-500',
      '-ring-offset-red-500/50',
      '-ring-offset-red-500/[0.5]',
      '-ring-offset-red-500/[50%]',
      '-ring-offset-current',
      '-ring-offset-current/50',
      '-ring-offset-current/[0.5]',
      '-ring-offset-current/[50%]',
      '-ring-offset-inherit',
      '-ring-offset-transparent',
      '-ring-offset-[#0088cc]',
      '-ring-offset-[#0088cc]/50',
      '-ring-offset-[#0088cc]/[0.5]',
      '-ring-offset-[#0088cc]/[50%]',

      // ring width
      'ring-offset--1',
      '-ring-offset-0',
      '-ring-offset-1',
      '-ring-offset-2',
      '-ring-offset-4',

      'ring-offset-0/foo',
      'ring-offset-1/foo',
      'ring-offset-2/foo',
      'ring-offset-4/foo',
      'ring-offset-[12px]/foo',
      'ring-offset-[length:var(--my-width)]/foo',
    ]),
  ).toEqual('')
})

test('@container', async () => {
  expect(
    await run([
      '@container',
      '@container-normal',
      '@container/sidebar',
      '@container-normal/sidebar',
      '@container-[size]',
      '@container-[size]/sidebar',
    ]),
  ).toMatchInlineSnapshot(`
    ".\\@container-\\[size\\]\\/sidebar {
      container: sidebar / size;
    }

    .\\@container-normal\\/sidebar {
      container: sidebar;
    }

    .\\@container\\/sidebar {
      container: sidebar / inline-size;
    }

    .\\@container {
      container-type: inline-size;
    }

    .\\@container-\\[size\\] {
      container-type: size;
    }

    .\\@container-normal {
      container-type: normal;
    }"
  `)
  expect(
    await run([
      '-@container',
      '-@container-normal',
      '-@container/sidebar',
      '-@container-normal/sidebar',
      '-@container-[size]',
      '-@container-[size]/sidebar',
    ]),
  ).toEqual('')
})

describe('spacing utilities', () => {
  test('`--spacing: initial` disables the spacing multiplier', async () => {
    let { build } = await compile(css`
      @theme {
        --spacing: initial;
        --spacing-4: 1rem;
      }
      @tailwind utilities;
    `)
    let compiled = build(['px-1', 'px-4'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      ":root, :host {
        --spacing-4: 1rem;
      }

      .px-4 {
        padding-inline: var(--spacing-4);
      }"
    `)
  })

  test('`--spacing-*: initial` disables the spacing multiplier', async () => {
    let { build } = await compile(css`
      @theme {
        --spacing-*: initial;
        --spacing-4: 1rem;
      }
      @tailwind utilities;
    `)
    let compiled = build(['px-1', 'px-4'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      ":root, :host {
        --spacing-4: 1rem;
      }

      .px-4 {
        padding-inline: var(--spacing-4);
      }"
    `)
  })

  test('only multiples of 0.25 with no trailing zeroes are supported with the spacing multiplier', async () => {
    let { build } = await compile(css`
      @theme {
        --spacing: 4px;
      }
      @tailwind utilities;
    `)
    let compiled = build(['px-0.25', 'px-1.5', 'px-2.75', 'px-0.375', 'px-2.50', 'px-.75'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      ":root, :host {
        --spacing: 4px;
      }

      .px-0\\.25 {
        padding-inline: calc(var(--spacing) * .25);
      }

      .px-1\\.5 {
        padding-inline: calc(var(--spacing) * 1.5);
      }

      .px-2\\.75 {
        padding-inline: calc(var(--spacing) * 2.75);
      }"
    `)
  })

  test('spacing utilities must have a value', async () => {
    let { build } = await compile(css`
      @theme reference {
        --spacing: 4px;
      }
      @tailwind utilities;
    `)
    let compiled = build(['px'])

    expect(optimizeCss(compiled).trim()).toEqual('')
  })

  test('--spacing-* variables take precedence over --container-* variables', async () => {
    let { build } = await compile(css`
      @theme {
        --spacing-sm: 8px;
        --container-sm: 256px;
      }
      @tailwind utilities;
    `)
    let compiled = build(['w-sm', 'max-w-sm', 'min-w-sm', 'basis-sm'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      ":root, :host {
        --spacing-sm: 8px;
      }

      .w-sm {
        width: var(--spacing-sm);
      }

      .max-w-sm {
        max-width: var(--spacing-sm);
      }

      .min-w-sm {
        min-width: var(--spacing-sm);
      }

      .basis-sm {
        flex-basis: var(--spacing-sm);
      }"
    `)
  })
})

describe('custom utilities', () => {
  test('custom static utility', async () => {
    let { build } = await compile(css`
      @layer utilities {
        @tailwind utilities;
      }

      @theme reference {
        --breakpoint-lg: 1024px;
      }

      @utility text-trim {
        text-box-trim: both;
        text-box-edge: cap alphabetic;
      }
    `)
    let compiled = build(['text-trim', 'lg:text-trim'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .text-trim {
          text-box-trim: both;
          text-box-edge: cap alphabetic;
        }

        @media (min-width: 1024px) {
          .lg\\:text-trim {
            text-box-trim: both;
            text-box-edge: cap alphabetic;
          }
        }
      }"
    `)
  })

  test('custom static utility emit CSS variables if the utility is used', async () => {
    let { build } = await compile(css`
      @layer utilities {
        @tailwind utilities;
      }

      @theme {
        --example-foo: 123px;
      }

      @utility foo {
        value: var(--example-foo);
      }
    `)
    let compiled = build([])

    // `foo` is not used yet:
    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`"@layer utilities;"`)

    // `foo` is used, and the CSS variable is emitted:
    compiled = build(['foo'])
    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .foo {
          value: var(--example-foo);
        }
      }

      :root, :host {
        --example-foo: 123px;
      }"
    `)
  })

  test('custom static utility (negative)', async () => {
    let { build } = await compile(css`
      @layer utilities {
        @tailwind utilities;
      }

      @utility -example {
        value: -1;
      }
    `)
    let compiled = build(['-example', 'lg:-example'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .-example {
          value: -1;
        }
      }"
    `)
  })

  test('Multiple static utilities are merged', async () => {
    let { build } = await compile(css`
      @layer utilities {
        @tailwind utilities;
      }

      @utility really-round {
        --custom-prop: hi;
        border-radius: 50rem;
      }

      @utility really-round {
        border-radius: 30rem;
      }
    `)
    let compiled = build(['really-round'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .really-round {
          --custom-prop: hi;
          border-radius: 30rem;
        }
      }"
    `)
  })

  test('custom utilities support some special characters', async () => {
    let { build } = await compile(css`
      @layer utilities {
        @tailwind utilities;
      }

      @utility push-1/2 {
        right: 50%;
      }

      @utility push-50% {
        right: 50%;
      }
    `)
    let compiled = build(['push-1/2', 'push-50%'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .push-1\\/2, .push-50\\% {
          right: 50%;
        }
      }"
    `)
  })

  test('can override specific versions of a functional utility with a static utility', async () => {
    let { build } = await compile(css`
      @layer utilities {
        @tailwind utilities;
      }

      @theme reference {
        --text-sm: 0.875rem;
        --text-sm--line-height: 1.25rem;
      }

      @utility text-sm {
        font-size: var(--text-sm, 0.8755rem);
        line-height: var(--text-sm--line-height, 1.255rem);
        text-rendering: optimizeLegibility;
      }
    `)
    let compiled = build(['text-sm'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .text-sm {
          font-size: var(--text-sm, .8755rem);
          line-height: var(--text-sm--line-height, 1.255rem);
          text-rendering: optimizeLegibility;
          font-size: var(--text-sm, .875rem);
          line-height: var(--tw-leading, var(--text-sm--line-height, 1.25rem));
        }
      }"
    `)
  })

  test('can override the default value of a functional utility', async () => {
    let { build } = await compile(css`
      @layer utilities {
        @tailwind utilities;
      }

      @theme reference {
        --radius-xl: 16px;
      }

      @utility rounded {
        border-radius: 50rem;
      }
    `)
    let compiled = build(['rounded', 'rounded-xl', 'rounded-[33px]'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .rounded {
          border-radius: 50rem;
        }

        .rounded-\\[33px\\] {
          border-radius: 33px;
        }

        .rounded-xl {
          border-radius: var(--radius-xl, 16px);
        }
      }"
    `)
  })

  test('custom utilities are sorted by used properties', async () => {
    let { build } = await compile(css`
      @layer utilities {
        @tailwind utilities;
      }

      @utility push-left {
        right: 100%;
      }
    `)
    let compiled = build(['top-[100px]', 'push-left', 'right-[100px]', 'bottom-[100px]'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .top-\\[100px\\] {
          top: 100px;
        }

        .push-left {
          right: 100%;
        }

        .right-\\[100px\\] {
          right: 100px;
        }

        .bottom-\\[100px\\] {
          bottom: 100px;
        }
      }"
    `)
  })

  test('custom utilities must use a valid name definitions', async () => {
    await expect(() =>
      compile(css`
        @utility push-| {
          right: 100%;
        }
      `),
    ).rejects.toThrowError(/should be alphanumeric/)

    await expect(() =>
      compile(css`
        @utility ~push {
          right: 100%;
        }
      `),
    ).rejects.toThrowError(/should be alphanumeric/)

    await expect(() =>
      compile(css`
        @utility @push {
          right: 100%;
        }
      `),
    ).rejects.toThrowError(/should be alphanumeric/)
  })

  test('custom utilities work with `@apply`', async () => {
    expect(
      await compileCss(
        css`
          @utility foo {
            @apply flex flex-col underline;
          }

          @utility bar {
            @apply z-10;

            .baz {
              @apply z-20;
            }
          }

          @tailwind utilities;
        `,
        ['foo', 'hover:foo', 'bar'],
      ),
    ).toMatchInlineSnapshot(`
      ".bar {
        z-index: 10;
      }

      .bar .baz {
        z-index: 20;
      }

      .foo {
        flex-direction: column;
        text-decoration-line: underline;
        display: flex;
      }

      @media (hover: hover) {
        .hover\\:foo:hover {
          flex-direction: column;
          text-decoration-line: underline;
          display: flex;
        }
      }"
    `)
  })

  test('referencing custom utilities in custom utilities via `@apply` should work', async () => {
    expect(
      await compileCss(
        css`
          @utility foo {
            @apply flex flex-col underline;
          }

          @utility bar {
            @apply dark:foo flex-wrap;
          }

          @tailwind utilities;
        `,
        ['bar'],
      ),
    ).toMatchInlineSnapshot(`
      ".bar {
        flex-wrap: wrap;
      }

      @media (prefers-color-scheme: dark) {
        .bar {
          flex-direction: column;
          text-decoration-line: underline;
          display: flex;
        }
      }"
    `)
  })

  test('custom utilities with `@apply` causing circular dependencies should error', async () => {
    await expect(() =>
      compileCss(
        css`
          @utility foo {
            @apply flex-wrap hover:bar;
          }

          @utility bar {
            @apply flex dark:foo;
          }

          @tailwind utilities;
        `,
        ['foo', 'bar'],
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: You cannot \`@apply\` the \`hover:bar\` utility here because it creates a circular dependency.]`,
    )
  })

  test('custom utilities with `@apply` causing circular dependencies should error (deeply nesting)', async () => {
    await expect(() =>
      compileCss(
        css`
          @utility foo {
            .bar {
              .baz {
                .qux {
                  @apply flex-wrap hover:bar;
                }
              }
            }
          }

          @utility bar {
            .baz {
              .qux {
                @apply flex dark:foo;
              }
            }
          }

          @tailwind utilities;
        `,
        ['foo', 'bar'],
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: You cannot \`@apply\` the \`hover:bar\` utility here because it creates a circular dependency.]`,
    )
  })

  test('custom utilities with `@apply` causing circular dependencies should error (multiple levels)', async () => {
    await expect(() =>
      compileCss(
        css`
          body {
            @apply foo;
          }

          @utility foo {
            @apply flex-wrap hover:bar;
          }

          @utility bar {
            @apply flex dark:baz;
          }

          @utility baz {
            @apply flex-wrap hover:foo;
          }

          @tailwind utilities;
        `,
        ['foo', 'bar'],
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: You cannot \`@apply\` the \`hover:bar\` utility here because it creates a circular dependency.]`,
    )
  })

  describe('functional utilities', () => {
    test('resolving values from `@theme`', async () => {
      let input = css`
        @theme reference {
          --tab-size-1: 1;
          --tab-size-2: 2;
          --tab-size-4: 4;
          --tab-size-github: 8;
        }

        @utility tab-* {
          tab-size: --value(--tab-size);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['tab-1', 'tab-2', 'tab-4', 'tab-github']))
        .toMatchInlineSnapshot(`
          ".tab-1 {
            tab-size: var(--tab-size-1, 1);
          }

          .tab-2 {
            tab-size: var(--tab-size-2, 2);
          }

          .tab-4 {
            tab-size: var(--tab-size-4, 4);
          }

          .tab-github {
            tab-size: var(--tab-size-github, 8);
          }"
        `)
      expect(await compileCss(input, ['tab-3', 'tab-gitlab'])).toEqual('')
    })

    test('resolving values from `@theme`, with `--tab-size-*` syntax', async () => {
      let input =
        // Explicitly not using the css tagged template literal so that
        // Prettier doesn't format the `value(--tab-size-*)` as
        // `value(--tab-size- *)`
        `
          @theme reference {
            --tab-size-1: 1;
            --tab-size-2: 2;
            --tab-size-4: 4;
            --tab-size-github: 8;
          }

          @utility tab-* {
            tab-size: --value(--tab-size-*);
          }

          @tailwind utilities;
        `

      expect(await compileCss(input, ['tab-1', 'tab-2', 'tab-4', 'tab-github']))
        .toMatchInlineSnapshot(`
          ".tab-1 {
            tab-size: var(--tab-size-1, 1);
          }

          .tab-2 {
            tab-size: var(--tab-size-2, 2);
          }

          .tab-4 {
            tab-size: var(--tab-size-4, 4);
          }

          .tab-github {
            tab-size: var(--tab-size-github, 8);
          }"
        `)
      expect(await compileCss(input, ['tab-3', 'tab-gitlab'])).toEqual('')
    })

    test('resolving values from `@theme`, with `--tab-size-\\*` syntax (prettier friendly)', async () => {
      let input = css`
        @theme reference {
          --tab-size-1: 1;
          --tab-size-2: 2;
          --tab-size-4: 4;
          --tab-size-github: 8;
        }

        @utility tab-* {
          tab-size: --value(--tab-size-\*);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['tab-1', 'tab-2', 'tab-4', 'tab-github']))
        .toMatchInlineSnapshot(`
          ".tab-1 {
            tab-size: var(--tab-size-1, 1);
          }

          .tab-2 {
            tab-size: var(--tab-size-2, 2);
          }

          .tab-4 {
            tab-size: var(--tab-size-4, 4);
          }

          .tab-github {
            tab-size: var(--tab-size-github, 8);
          }"
        `)
      expect(await compileCss(input, ['tab-3', 'tab-gitlab'])).toEqual('')
    })

    test('resolving bare values', async () => {
      let input = css`
        @utility tab-* {
          tab-size: --value(integer);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['tab-1', 'tab-76', 'tab-971'])).toMatchInlineSnapshot(`
        ".tab-1 {
          tab-size: 1;
        }

        .tab-76 {
          tab-size: 76;
        }

        .tab-971 {
          tab-size: 971;
        }"
      `)
      expect(await compileCss(input, ['tab-foo'])).toEqual('')
    })

    test('bare values with unsupported data types should result in a warning', async () => {
      let spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      let input = css`
        @utility paint-* {
          paint: --value([color], color);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['paint-#0088cc', 'paint-red'])).toMatchInlineSnapshot(`""`)
      expect(spy.mock.calls).toMatchInlineSnapshot(`
        [
          [
            "Unsupported bare value data type: "color".
        Only valid data types are: "number", "integer", "ratio", "percentage".
        ",
          ],
          [
            "\`\`\`css
        --value([color],color)
                        ^^^^^
        \`\`\`",
          ],
        ]
      `)
    })

    test('resolve literal values', async () => {
      let input = css`
        @utility tab-* {
          tab-size: --value('revert');
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['tab-revert'])).toMatchInlineSnapshot(`
        ".tab-revert {
          tab-size: revert;
        }"
      `)
      expect(await compileCss(input, ['tab-initial'])).toEqual('')
    })

    test('resolving bare values with constraints for integer, percentage, and ratio', async () => {
      let input = css`
        @utility example-* {
          --value-as-number: --value(number);
          --value-as-percentage: --value(percentage);
          --value-as-ratio: --value(ratio);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['example-1', 'example-0.5', 'example-20%', 'example-2/3']))
        .toMatchInlineSnapshot(`
          ".example-0\\.5 {
            --value-as-number: .5;
          }

          .example-1 {
            --value-as-number: 1;
          }

          .example-2\\/3 {
            --value-as-ratio: 2 / 3;
          }

          .example-20\\% {
            --value-as-percentage: 20%;
          }"
        `)
      expect(
        await compileCss(input, [
          'example-1.23',
          'example-12.34%',
          'example-1.2/3',
          'example-1/2.3',
          'example-1.2/3.4',
        ]),
      ).toEqual('')
    })

    test('resolving unsupported bare values', async () => {
      let input = css`
        @utility tab-* {
          tab-size: --value(color);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['tab-#0088cc', 'tab-foo'])).toEqual('')
    })

    test('resolving arbitrary values', async () => {
      let input = css`
        @utility tab-* {
          tab-size: --value([integer]);
        }

        @tailwind utilities;
      `

      expect(
        await compileCss(input, [
          'tab-[1]',
          'tab-[76]',
          'tab-[971]',
          'tab-[integer:var(--my-value)]',
          'tab-(integer:my-value)',
        ]),
      ).toMatchInlineSnapshot(`
        ".tab-\\[1\\] {
          tab-size: 1;
        }

        .tab-\\[76\\] {
          tab-size: 76;
        }

        .tab-\\[971\\] {
          tab-size: 971;
        }

        .tab-\\[integer\\:var\\(--my-value\\)\\] {
          tab-size: var(--my-value);
        }"
      `)
      expect(
        await compileCss(input, [
          'tab-[#0088cc]',
          'tab-[1px]',
          'tab-[var(--my-value)]',
          'tab-(--my-value)',
          'tab-[color:var(--my-value)]',
          'tab-(color:--my-value)',
        ]),
      ).toEqual('')
    })

    test('resolving any arbitrary values', async () => {
      let input = css`
        @utility tab-* {
          tab-size: --value([ *]);
        }

        @tailwind utilities;
      `

      expect(
        await compileCss(input, [
          'tab-[1]',
          'tab-[76]',
          'tab-[971]',
          'tab-[var(--my-value)]',
          'tab-(--my-value)',
        ]),
      ).toMatchInlineSnapshot(`
        ".tab-\\(--my-value\\) {
          tab-size: var(--my-value);
        }

        .tab-\\[1\\] {
          tab-size: 1;
        }

        .tab-\\[76\\] {
          tab-size: 76;
        }

        .tab-\\[971\\] {
          tab-size: 971;
        }

        .tab-\\[var\\(--my-value\\)\\] {
          tab-size: var(--my-value);
        }"
      `)
    })

    test('resolving any arbitrary values (without space)', async () => {
      let input = `
        @utility tab-* {
          tab-size: --value([*]);
        }

        @tailwind utilities;
      `

      expect(
        await compileCss(input, [
          'tab-[1]',
          'tab-[76]',
          'tab-[971]',
          'tab-[var(--my-value)]',
          'tab-(--my-value)',
        ]),
      ).toMatchInlineSnapshot(`
        ".tab-\\(--my-value\\) {
          tab-size: var(--my-value);
        }

        .tab-\\[1\\] {
          tab-size: 1;
        }

        .tab-\\[76\\] {
          tab-size: 76;
        }

        .tab-\\[971\\] {
          tab-size: 971;
        }

        .tab-\\[var\\(--my-value\\)\\] {
          tab-size: var(--my-value);
        }"
      `)
    })

    test('resolving any arbitrary values (with escaped `*`)', async () => {
      let input = css`
        @utility tab-* {
          tab-size: --value([\*]);
        }

        @tailwind utilities;
      `

      expect(
        await compileCss(input, [
          'tab-[1]',
          'tab-[76]',
          'tab-[971]',
          'tab-[var(--my-value)]',
          'tab-(--my-value)',
        ]),
      ).toMatchInlineSnapshot(`
        ".tab-\\(--my-value\\) {
          tab-size: var(--my-value);
        }

        .tab-\\[1\\] {
          tab-size: 1;
        }

        .tab-\\[76\\] {
          tab-size: 76;
        }

        .tab-\\[971\\] {
          tab-size: 971;
        }

        .tab-\\[var\\(--my-value\\)\\] {
          tab-size: var(--my-value);
        }"
      `)
    })

    test('resolving theme, bare and arbitrary values all at once', async () => {
      let input = css`
        @theme reference {
          --tab-size-github: 8;
        }

        @utility tab-* {
          tab-size: --value([integer]);
          tab-size: --value(integer);
          tab-size: --value(--tab-size);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['tab-github', 'tab-76', 'tab-[123]'])).toMatchInlineSnapshot(`
        ".tab-76 {
          tab-size: 76;
        }

        .tab-\\[123\\] {
          tab-size: 123;
        }

        .tab-github {
          tab-size: var(--tab-size-github, 8);
        }"
      `)
      expect(await compileCss(input, ['tab-[#0088cc]', 'tab-[1px]'])).toEqual('')
    })

    test('in combination with calc to produce different data types of values', async () => {
      let input = css`
        @theme reference {
          --example-full: 100%;
        }

        @utility example-* {
          --value: --value([percentage]);
          --value: calc(--value(integer) * 1%);
          --value: --value(--example);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['example-full', 'example-12', 'example-[20%]']))
        .toMatchInlineSnapshot(`
          ".example-12 {
            --value: calc(12 * 1%);
          }

          .example-\\[20\\%\\] {
            --value: 20%;
          }

          .example-full {
            --value: var(--example-full, 100%);
          }"
        `)
      expect(await compileCss(input, ['example-half', 'example-[#0088cc]'])).toEqual('')
    })

    test('shorthand if resulting values are of the same type', async () => {
      let input = css`
        @theme reference {
          --tab-size-github: 8;
          --example-full: 100%;
        }

        @utility tab-* {
          tab-size: --value(--tab-size, integer, [integer]);
        }

        @utility example-* {
          --value: calc(--value(integer) * 1%);
          --value: --value(--example, [percentage]);
        }

        @tailwind utilities;
      `

      expect(
        await compileCss(input, [
          'tab-github',
          'tab-76',
          'tab-[123]',
          'example-37',
          'example-[50%]',
          'example-full',
        ]),
      ).toMatchInlineSnapshot(`
        ".example-37 {
          --value: calc(37 * 1%);
        }

        .example-\\[50\\%\\] {
          --value: 50%;
        }

        .example-full {
          --value: var(--example-full, 100%);
        }

        .tab-76 {
          tab-size: 76;
        }

        .tab-\\[123\\] {
          tab-size: 123;
        }

        .tab-github {
          tab-size: var(--tab-size-github, 8);
        }"
      `)
      expect(
        await compileCss(input, ['tab-[#0088cc]', 'tab-[1px]', 'example-foo', 'example-[13px]']),
      ).toEqual('')
    })

    test('negative values', async () => {
      let input = css`
        @theme reference {
          --example-full: 100%;
        }

        @utility example-* {
          --value: --value(--example, [percentage], [length]);
        }

        @utility -example-* {
          --value: calc(--value(--example, [percentage], [length]) * -1);
        }

        @tailwind utilities;
      `

      expect(
        await compileCss(input, [
          'example-full',
          '-example-full',
          'example-[10px]',
          '-example-[10px]',
          'example-[20%]',
          '-example-[20%]',
        ]),
      ).toMatchInlineSnapshot(`
        ".-example-\\[10px\\] {
          --value: calc(10px * -1);
        }

        .-example-\\[20\\%\\] {
          --value: calc(20% * -1);
        }

        .-example-full {
          --value: calc(var(--example-full, 100%) * -1);
        }

        .example-\\[10px\\] {
          --value: 10px;
        }

        .example-\\[20\\%\\] {
          --value: 20%;
        }

        .example-full {
          --value: var(--example-full, 100%);
        }"
      `)
      expect(await compileCss(input, ['example-10'])).toEqual('')
    })

    test('using the same value multiple times', async () => {
      let input = css`
        @utility example-* {
          --value: calc(var(--spacing) * --value(number)) calc(var(--spacing) * --value(number));
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['example-12'])).toMatchInlineSnapshot(`
        ".example-12 {
          --value: calc(var(--spacing) * 12) calc(var(--spacing) * 12);
        }"
      `)
    })

    test('using `--spacing(…)` shorthand', async () => {
      let input = css`
        @theme {
          --spacing: 4px;
        }

        @utility example-* {
          margin: --spacing(--value(number));
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['example-12'])).toMatchInlineSnapshot(`
        ":root, :host {
          --spacing: 4px;
        }

        .example-12 {
          margin: calc(var(--spacing) * 12);
        }"
      `)
    })

    test('using `--spacing(…)` shorthand (inline theme)', async () => {
      let input = css`
        @theme inline reference {
          --spacing: 4px;
        }

        @utility example-* {
          margin: --spacing(--value(number));
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['example-12'])).toMatchInlineSnapshot(`
        ".example-12 {
          margin: 48px;
        }"
      `)
    })

    test('modifiers', async () => {
      let input = css`
        @theme reference {
          --value-sm: 14px;
          --modifier-7: 28px;
        }

        @utility example-* {
          --value: --value(--value, [length]);
          --modifier: --modifier(--modifier, [length]);
          --modifier-with-calc: calc(--modifier(--modifier, [length]) * 2);
          --modifier-literals: --modifier('literal', 'literal-2');
        }

        @tailwind utilities;
      `

      expect(
        await compileCss(input, [
          'example-sm',
          'example-sm/7',
          'example-[12px]',
          'example-[12px]/[16px]',
          'example-sm/literal',
          'example-sm/literal-2',
        ]),
      ).toMatchInlineSnapshot(`
        ".example-\\[12px\\]\\/\\[16px\\] {
          --value: 12px;
          --modifier: 16px;
          --modifier-with-calc: calc(16px * 2);
        }

        .example-sm\\/7 {
          --value: var(--value-sm, 14px);
          --modifier: var(--modifier-7, 28px);
          --modifier-with-calc: calc(var(--modifier-7, 28px) * 2);
        }

        .example-sm\\/literal {
          --value: var(--value-sm, 14px);
          --modifier-literals: literal;
        }

        .example-sm\\/literal-2 {
          --value: var(--value-sm, 14px);
          --modifier-literals: literal-2;
        }

        .example-\\[12px\\] {
          --value: 12px;
        }

        .example-sm {
          --value: var(--value-sm, 14px);
        }"
      `)
      expect(
        await compileCss(input, [
          'example-foo',
          'example-foo/[12px]',
          'example-foo/12',
          'example-sm/unknown-literal',
        ]),
      ).toEqual('')
    })

    test('fractions', async () => {
      let input = css`
        @theme reference {
          --example-video: 16 / 9;
        }

        @utility example-* {
          --value: --value(--example, ratio, [ratio]);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['example-video', 'example-1/1', 'example-[7/9]']))
        .toMatchInlineSnapshot(`
          ".example-1\\/1 {
            --value: 1 / 1;
          }

          .example-\\[7\\/9\\] {
            --value: 7 / 9;
          }

          .example-video {
            --value: var(--example-video, 16 / 9);
          }"
        `)
      expect(await compileCss(input, ['example-foo'])).toEqual('')
    })

    test('resolve theme values with sub-namespace (--text- * --line-height)', async () => {
      let input = css`
        @theme reference {
          --text-xs: 0.75rem;
          --text-xs--line-height: calc(1 / 0.75);
        }

        @utility example-* {
          font-size: --value(--text);
          line-height: --value(--text- * --line-height);
          line-height: --modifier(number);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['example-xs', 'example-xs/6'])).toMatchInlineSnapshot(`
        ".example-xs\\/6 {
          font-size: var(--text-xs, .75rem);
          line-height: var(--text-xs--line-height, calc(1 / .75));
          line-height: 6;
        }

        .example-xs {
          font-size: var(--text-xs, .75rem);
          line-height: var(--text-xs--line-height, calc(1 / .75));
        }"
      `)
      expect(await compileCss(input, ['example-foo', 'example-xs/foo'])).toEqual('')
    })

    test('resolve theme values with sub-namespace (--text-\\* --line-height)', async () => {
      let input = css`
        @theme reference {
          --text-xs: 0.75rem;
          --text-xs--line-height: calc(1 / 0.75);
        }

        @utility example-* {
          font-size: --value(--text);
          line-height: --value(--text-\* --line-height);
          line-height: --modifier(number);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['example-xs', 'example-xs/6'])).toMatchInlineSnapshot(`
        ".example-xs\\/6 {
          font-size: var(--text-xs, .75rem);
          line-height: var(--text-xs--line-height, calc(1 / .75));
          line-height: 6;
        }

        .example-xs {
          font-size: var(--text-xs, .75rem);
          line-height: var(--text-xs--line-height, calc(1 / .75));
        }"
      `)
      expect(await compileCss(input, ['example-foo', 'example-xs/foo'])).toEqual('')
    })

    test('resolve theme values with sub-namespace (--value(--text --line-height))', async () => {
      let input = css`
        @theme reference {
          --text-xs: 0.75rem;
          --text-xs--line-height: calc(1 / 0.75);
        }

        @utility example-* {
          font-size: --value(--text);
          line-height: --value(--text --line-height);
          line-height: --modifier(number);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['example-xs', 'example-xs/6'])).toMatchInlineSnapshot(`
        ".example-xs\\/6 {
          font-size: var(--text-xs, .75rem);
          line-height: var(--text-xs--line-height, calc(1 / .75));
          line-height: 6;
        }

        .example-xs {
          font-size: var(--text-xs, .75rem);
          line-height: var(--text-xs--line-height, calc(1 / .75));
        }"
      `)
      expect(await compileCss(input, ['example-foo', 'example-xs/foo'])).toEqual('')
    })

    test('resolve theme values with sub-namespace (--value(--text-*--line-height))', async () => {
      let input = `
        @theme reference {
          --text-xs: 0.75rem;
          --text-xs--line-height: calc(1 / 0.75);
        }

        @utility example-* {
          font-size: --value(--text);
          line-height: --value(--text-*--line-height);
          line-height: --modifier(number);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['example-xs', 'example-xs/6'])).toMatchInlineSnapshot(`
        ".example-xs\\/6 {
          font-size: var(--text-xs, .75rem);
          line-height: var(--text-xs--line-height, calc(1 / .75));
          line-height: 6;
        }

        .example-xs {
          font-size: var(--text-xs, .75rem);
          line-height: var(--text-xs--line-height, calc(1 / .75));
        }"
      `)
      expect(await compileCss(input, ['example-foo', 'example-xs/foo'])).toEqual('')
    })

    test('variables used in `@utility` will not be emitted if the utility is not used', async () => {
      let input = css`
        @theme {
          --example-foo: red;
          --color-red-500: #f00;
        }

        @utility example-* {
          color: var(--color-red-500);
          background-color: --value(--example);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['flex'])).toMatchInlineSnapshot(`
        ".flex {
          display: flex;
        }"
      `)
    })

    test('variables used in `@utility` will be emitted if the utility is used', async () => {
      let input = css`
        @theme {
          --example-foo: red;
          --color-red-500: #f00;
        }

        @utility example-* {
          color: var(--color-red-500);
          background-color: --value(--example);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['example-foo'])).toMatchInlineSnapshot(`
        ":root, :host {
          --example-foo: red;
          --color-red-500: red;
        }

        .example-foo {
          color: var(--color-red-500);
          background-color: var(--example-foo);
        }"
      `)
    })

    // This originated from a bug. Essentially in the second `--mask-right` we
    // call both `--modifier(…)` and `--value(…)`. The moment we processed
    // `--modifier(…)` it deleted the `--mask-right` declaration (expected
    // behavior). But we didn't properly stop so the `--value(…)` was still
    // processed and also tried to remove the `--mask-right` declaration.
    //
    // This test now ensures that we only remove/replace a declaration once.
    test('declaration nodes are only replaced/removed once', async () => {
      let input = css`
        @utility mask-r-* {
          --mask-right: linear-gradient(to left, transparent, black --value(percentage));
          --mask-right: linear-gradient(
            to left,
            transparent calc(var(--spacing) * --modifier(integer)),
            black calc(var(--spacing) * --value(integer))
          );
          mask-image: var(--mask-linear), var(--mask-radial), var(--mask-conic);
        }

        @tailwind utilities;
      `

      expect(await compileCss(input, ['mask-r-20%'])).toMatchInlineSnapshot(`
        ".mask-r-20\\% {
          --mask-right: linear-gradient(to left, transparent, black 20%);
          -webkit-mask-image: var(--mask-linear), var(--mask-radial), var(--mask-conic);
          -webkit-mask-image: var(--mask-linear), var(--mask-radial), var(--mask-conic);
          mask-image: var(--mask-linear), var(--mask-radial), var(--mask-conic);
        }"
      `)
    })
  })

  test('resolve value based on `@theme`', async () => {
    let input = css`
      @theme {
        --tab-size-github: 8;
      }

      @utility tab-* {
        tab-size: --value(--tab-size);
      }

      @tailwind utilities;
    `

    expect(await compileCss(input, ['tab-github'])).toMatchInlineSnapshot(`
      ":root, :host {
        --tab-size-github: 8;
      }

      .tab-github {
        tab-size: var(--tab-size-github);
      }"
    `)
  })

  test('resolve value based on `@theme reference`', async () => {
    let input = css`
      @theme reference {
        --tab-size-github: 8;
      }

      @utility tab-* {
        tab-size: --value(--tab-size);
      }

      @tailwind utilities;
    `

    expect(await compileCss(input, ['tab-github'])).toMatchInlineSnapshot(`
      ".tab-github {
        tab-size: var(--tab-size-github, 8);
      }"
    `)
  })

  test('resolve value based on `@theme inline`', async () => {
    let input = css`
      @theme inline {
        --tab-size-github: 8;
      }

      @utility tab-* {
        tab-size: --value(--tab-size);
      }

      @tailwind utilities;
    `

    expect(await compileCss(input, ['tab-github'])).toMatchInlineSnapshot(`
      ".tab-github {
        tab-size: 8;
      }"
    `)
  })

  test('resolve value based on `@theme inline reference`', async () => {
    let input = css`
      @theme inline reference {
        --tab-size-github: 8;
      }

      @utility tab-* {
        tab-size: --value(--tab-size);
      }

      @tailwind utilities;
    `

    expect(await compileCss(input, ['tab-github'])).toMatchInlineSnapshot(`
      ".tab-github {
        tab-size: 8;
      }"
    `)
  })

  test('sub namespaces can live in different @theme blocks (1)', async () => {
    let input = `
      @theme reference {
        --text-xs: 0.75rem;
      }

      @theme inline reference {
        --text-xs--line-height: calc(1 / 0.75);
      }

      @utility example-* {
        font-size: --value(--text);
        line-height: --value(--text-*--line-height);
      }

      @tailwind utilities;
    `

    expect(await compileCss(input, ['example-xs'])).toMatchInlineSnapshot(`
      ".example-xs {
        font-size: var(--text-xs, .75rem);
        line-height: 1.33333;
      }"
    `)
  })

  test('sub namespaces can live in different @theme blocks (2)', async () => {
    let input = `
      @theme inline reference {
        --text-xs: 0.75rem;
      }

      @theme reference {
        --text-xs--line-height: calc(1 / 0.75);
      }

      @utility example-* {
        font-size: --value(--text);
        line-height: --value(--text-*--line-height);
      }

      @tailwind utilities;
    `

    expect(await compileCss(input, ['example-xs'])).toMatchInlineSnapshot(`
      ".example-xs {
        font-size: .75rem;
        line-height: var(--text-xs--line-height, calc(1 / .75));
      }"
    `)
  })
})
