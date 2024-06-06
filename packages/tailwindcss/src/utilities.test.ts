import { expect, test } from 'vitest'
import { compileCss, run } from './test-utils/run'

const css = String.raw

test('sr-only', () => {
  expect(run(['sr-only'])).toMatchInlineSnapshot(`
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
  expect(run(['-sr-only', 'sr-only-[--value]'])).toEqual('')
})

test('not-sr-only', () => {
  expect(run(['not-sr-only'])).toMatchInlineSnapshot(`
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
  expect(run(['-not-sr-only', 'not-sr-only-[--value]'])).toEqual('')
})

test('pointer-events', () => {
  expect(run(['pointer-events-none', 'pointer-events-auto'])).toMatchInlineSnapshot(`
    ".pointer-events-auto {
      pointer-events: auto;
    }

    .pointer-events-none {
      pointer-events: none;
    }"
  `)
  expect(run(['-pointer-events-none', '-pointer-events-auto', 'pointer-events-[--value]'])).toEqual(
    '',
  )
})

test('visibility', () => {
  expect(run(['visible', 'invisible', 'collapse'])).toMatchInlineSnapshot(`
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
  expect(run(['-visible', '-invisible', '-collapse'])).toEqual('')
})

test('position', () => {
  expect(run(['static', 'fixed', 'absolute', 'relative', 'sticky'])).toMatchInlineSnapshot(`
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
  expect(run(['-static', '-fixed', '-absolute', '-relative', '-sticky'])).toEqual('')
})

test('inset', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      [
        'inset-auto',
        '-inset-full',
        'inset-full',
        'inset-3/4',
        'inset-4',
        '-inset-4',
        'inset-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-inset-4 {
      inset: calc(var(--spacing-4, 1rem) * -1);
    }

    .-inset-full {
      inset: -100%;
    }

    .inset-3\\/4 {
      inset: 75%;
    }

    .inset-4 {
      inset: var(--spacing-4, 1rem);
    }

    .inset-\\[4px\\] {
      inset: 4px;
    }

    .inset-auto {
      inset: auto;
    }

    .inset-full {
      inset: 100%;
    }"
  `)
  expect(run(['inset'])).toEqual('')
})

test('inset-x', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      [
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
    ":root {
      --spacing-4: 1rem;
    }

    .-inset-x-4 {
      right: calc(var(--spacing-4, 1rem) * -1);
      left: calc(var(--spacing-4, 1rem) * -1);
    }

    .-inset-x-full {
      left: -100%;
      right: -100%;
    }

    .inset-x-3\\/4 {
      left: 75%;
      right: 75%;
    }

    .inset-x-4 {
      right: var(--spacing-4, 1rem);
      left: var(--spacing-4, 1rem);
    }

    .inset-x-\\[4px\\] {
      left: 4px;
      right: 4px;
    }

    .inset-x-auto {
      left: auto;
      right: auto;
    }

    .inset-x-full {
      left: 100%;
      right: 100%;
    }"
  `)
  expect(run(['inset-x'])).toEqual('')
})

test('inset-y', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      [
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
    ":root {
      --spacing-4: 1rem;
    }

    .-inset-y-4 {
      top: calc(var(--spacing-4, 1rem) * -1);
      bottom: calc(var(--spacing-4, 1rem) * -1);
    }

    .-inset-y-full {
      top: -100%;
      bottom: -100%;
    }

    .inset-y-3\\/4 {
      top: 75%;
      bottom: 75%;
    }

    .inset-y-4 {
      top: var(--spacing-4, 1rem);
      bottom: var(--spacing-4, 1rem);
    }

    .inset-y-\\[4px\\] {
      top: 4px;
      bottom: 4px;
    }

    .inset-y-auto {
      top: auto;
      bottom: auto;
    }

    .inset-y-full {
      top: 100%;
      bottom: 100%;
    }"
  `)
  expect(run(['inset-y'])).toEqual('')
})

test('start', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      [
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
    ":root {
      --spacing-4: 1rem;
    }

    .-start-4 {
      inset-inline-start: calc(var(--spacing-4, 1rem) * -1);
    }

    .-start-full {
      inset-inline-start: -100%;
    }

    .start-3\\/4 {
      inset-inline-start: 75%;
    }

    .start-4 {
      inset-inline-start: var(--spacing-4, 1rem);
    }

    .start-\\[4px\\] {
      inset-inline-start: 4px;
    }

    .start-auto {
      inset-inline-start: auto;
    }

    .start-full {
      inset-inline-start: 100%;
    }"
  `)
  expect(run(['start'])).toEqual('')
})

test('end', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['end-auto', '-end-full', 'end-full', 'end-3/4', 'end-4', '-end-4', 'end-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-end-4 {
      inset-inline-end: calc(var(--spacing-4, 1rem) * -1);
    }

    .-end-full {
      inset-inline-end: -100%;
    }

    .end-3\\/4 {
      inset-inline-end: 75%;
    }

    .end-4 {
      inset-inline-end: var(--spacing-4, 1rem);
    }

    .end-\\[4px\\] {
      inset-inline-end: 4px;
    }

    .end-auto {
      inset-inline-end: auto;
    }

    .end-full {
      inset-inline-end: 100%;
    }"
  `)
  expect(run(['end'])).toEqual('')
})

test('top', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,

      ['top-auto', '-top-full', 'top-full', 'top-3/4', 'top-4', '-top-4', 'top-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-top-4 {
      top: calc(var(--spacing-4, 1rem) * -1);
    }

    .-top-full {
      top: -100%;
    }

    .top-3\\/4 {
      top: 75%;
    }

    .top-4 {
      top: var(--spacing-4, 1rem);
    }

    .top-\\[4px\\] {
      top: 4px;
    }

    .top-auto {
      top: auto;
    }

    .top-full {
      top: 100%;
    }"
  `)
  expect(run(['top'])).toEqual('')
})

test('right', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      [
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
    ":root {
      --spacing-4: 1rem;
    }

    .-right-4 {
      right: calc(var(--spacing-4, 1rem) * -1);
    }

    .-right-full {
      right: -100%;
    }

    .right-3\\/4 {
      right: 75%;
    }

    .right-4 {
      right: var(--spacing-4, 1rem);
    }

    .right-\\[4px\\] {
      right: 4px;
    }

    .right-auto {
      right: auto;
    }

    .right-full {
      right: 100%;
    }"
  `)
  expect(run(['right'])).toEqual('')
})

test('bottom', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      [
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
    ":root {
      --spacing-4: 1rem;
    }

    .-bottom-4 {
      bottom: calc(var(--spacing-4, 1rem) * -1);
    }

    .-bottom-full {
      bottom: -100%;
    }

    .bottom-3\\/4 {
      bottom: 75%;
    }

    .bottom-4 {
      bottom: var(--spacing-4, 1rem);
    }

    .bottom-\\[4px\\] {
      bottom: 4px;
    }

    .bottom-auto {
      bottom: auto;
    }

    .bottom-full {
      bottom: 100%;
    }"
  `)
  expect(run(['bottom'])).toEqual('')
})

test('left', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['left-auto', '-left-full', 'left-full', 'left-3/4', 'left-4', '-left-4', 'left-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-left-4 {
      left: calc(var(--spacing-4, 1rem) * -1);
    }

    .-left-full {
      left: -100%;
    }

    .left-3\\/4 {
      left: 75%;
    }

    .left-4 {
      left: var(--spacing-4, 1rem);
    }

    .left-\\[4px\\] {
      left: 4px;
    }

    .left-auto {
      left: auto;
    }

    .left-full {
      left: 100%;
    }"
  `)
  expect(run(['left'])).toEqual('')
})

test('isolation', () => {
  expect(run(['isolate', 'isolation-auto'])).toMatchInlineSnapshot(`
    ".isolate {
      isolation: isolate;
    }

    .isolation-auto {
      isolation: auto;
    }"
  `)
  expect(run(['-isolate', '-isolation-auto'])).toEqual('')
})

test('z-index', () => {
  expect(run(['z-auto', 'z-10', '-z-10', 'z-[123]', '-z-[--value]'])).toMatchInlineSnapshot(`
    ".-z-10 {
      z-index: calc(10 * -1);
    }

    .-z-\\[--value\\] {
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
  expect(run(['z', '-z-auto', 'z-unknown', 'z-123.5'])).toEqual('')
})

test('order', () => {
  expect(
    run([
      'order-4',
      '-order-4',
      'order-[123]',
      '-order-[--value]',
      'order-first',
      'order-last',
      'order-none',
    ]),
  ).toMatchInlineSnapshot(`
    ".-order-4 {
      order: calc(4 * -1);
    }

    .-order-\\[--value\\] {
      order: calc(var(--value) * -1);
    }

    .order-4 {
      order: 4;
    }

    .order-\\[123\\] {
      order: 123;
    }

    .order-first {
      order: calc(-infinity);
    }

    .order-last {
      order: calc(infinity);
    }

    .order-none {
      order: 0;
    }"
  `)
  expect(
    run(['order', '-order-first', '-order-last', '-order-none', 'order-unknown', 'order-123.5']),
  ).toEqual('')
})

test('col', () => {
  expect(
    run([
      'col-auto',
      'col-span-4',
      'col-span-17',
      'col-span-full',
      'col-[span_123/span_123]',
      'col-span-[--my-variable]',
    ]),
  ).toMatchInlineSnapshot(`
    ".col-\\[span_123\\/span_123\\] {
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

    .col-span-\\[--my-variable\\] {
      grid-column: span var(--my-variable) / span var(--my-variable);
    }

    .col-span-full {
      grid-column: 1 / -1;
    }"
  `)
  expect(run(['col', 'col-span', '-col-span-4', 'col-span-unknown'])).toEqual('')
})

test('col-start', () => {
  expect(run(['col-start-auto', 'col-start-4', 'col-start-99', 'col-start-[123]', '-col-start-4']))
    .toMatchInlineSnapshot(`
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
  expect(run(['col-start', 'col-start-unknown'])).toEqual('')
})

test('col-end', () => {
  expect(run(['col-end-auto', 'col-end-4', 'col-end-99', 'col-end-[123]', '-col-end-4']))
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
  expect(run(['col-end', 'col-end-unknown'])).toEqual('')
})

test('row', () => {
  expect(
    run([
      'row-auto',
      'row-span-4',
      'row-span-17',
      'row-span-full',
      'row-[span_123/span_123]',
      'row-span-[--my-variable]',
    ]),
  ).toMatchInlineSnapshot(`
    ".row-\\[span_123\\/span_123\\] {
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

    .row-span-\\[--my-variable\\] {
      grid-row: span var(--my-variable) / span var(--my-variable);
    }

    .row-span-full {
      grid-row: 1 / -1;
    }"
  `)
  expect(run(['row', 'row-span', '-row-span-4', 'row-span-unknown'])).toEqual('')
})

test('row-start', () => {
  expect(run(['row-start-auto', 'row-start-4', 'row-start-99', 'row-start-[123]', '-row-start-4']))
    .toMatchInlineSnapshot(`
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
  expect(run(['row-start', 'row-start-unknown'])).toEqual('')
})

test('row-end', () => {
  expect(run(['row-end-auto', 'row-end-4', 'row-end-99', 'row-end-[123]', '-row-end-4']))
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
  expect(run(['row-end', 'row-end-unknown'])).toEqual('')
})

test('float', () => {
  expect(run(['float-start', 'float-end', 'float-right', 'float-left', 'float-none']))
    .toMatchInlineSnapshot(`
    ".float-end {
      float: end;
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
      float: start;
    }"
  `)
  expect(
    run(['float', '-float-start', '-float-end', '-float-right', '-float-left', '-float-none']),
  ).toEqual('')
})

test('clear', () => {
  expect(run(['clear-start', 'clear-end', 'clear-right', 'clear-left', 'clear-both', 'clear-none']))
    .toMatchInlineSnapshot(`
    ".clear-both {
      clear: both;
    }

    .clear-end {
      clear: end;
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
      clear: start;
    }"
  `)
  expect(
    run([
      'clear',
      '-clear-start',
      '-clear-end',
      '-clear-right',
      '-clear-left',
      '-clear-both',
      '-clear-none',
    ]),
  ).toEqual('')
})

test('margin', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['m-auto', 'm-4', 'm-[4px]', '-m-4', '-m-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-m-4 {
      margin: calc(var(--spacing-4, 1rem) * -1);
    }

    .-m-\\[--value\\] {
      margin: calc(var(--value) * -1);
    }

    .m-4 {
      margin: var(--spacing-4, 1rem);
    }

    .m-\\[4px\\] {
      margin: 4px;
    }

    .m-auto {
      margin: auto;
    }"
  `)
  expect(run(['m'])).toEqual('')
})

test('margin-x', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['mx-auto', 'mx-4', 'mx-[4px]', '-mx-4', '-mx-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-mx-4 {
      margin-left: calc(var(--spacing-4, 1rem) * -1);
      margin-right: calc(var(--spacing-4, 1rem) * -1);
    }

    .-mx-\\[--value\\] {
      margin-left: calc(var(--value) * -1);
      margin-right: calc(var(--value) * -1);
    }

    .mx-4 {
      margin-left: var(--spacing-4, 1rem);
      margin-right: var(--spacing-4, 1rem);
    }

    .mx-\\[4px\\] {
      margin-left: 4px;
      margin-right: 4px;
    }

    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }"
  `)
  expect(run(['mx'])).toEqual('')
})

test('margin-y', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['my-auto', 'my-4', 'my-[4px]', '-my-4', '-my-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-my-4 {
      margin-top: calc(var(--spacing-4, 1rem) * -1);
      margin-bottom: calc(var(--spacing-4, 1rem) * -1);
    }

    .-my-\\[--value\\] {
      margin-top: calc(var(--value) * -1);
      margin-bottom: calc(var(--value) * -1);
    }

    .my-4 {
      margin-top: var(--spacing-4, 1rem);
      margin-bottom: var(--spacing-4, 1rem);
    }

    .my-\\[4px\\] {
      margin-top: 4px;
      margin-bottom: 4px;
    }

    .my-auto {
      margin-top: auto;
      margin-bottom: auto;
    }"
  `)
  expect(run(['my'])).toEqual('')
})

test('margin-top', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['mt-auto', 'mt-4', 'mt-[4px]', '-mt-4', '-mt-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-mt-4 {
      margin-top: calc(var(--spacing-4, 1rem) * -1);
    }

    .-mt-\\[--value\\] {
      margin-top: calc(var(--value) * -1);
    }

    .mt-4 {
      margin-top: var(--spacing-4, 1rem);
    }

    .mt-\\[4px\\] {
      margin-top: 4px;
    }

    .mt-auto {
      margin-top: auto;
    }"
  `)
  expect(run(['mt'])).toEqual('')
})

test('margin-inline-start', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['ms-auto', 'ms-4', 'ms-[4px]', '-ms-4', '-ms-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-ms-4 {
      margin-inline-start: calc(var(--spacing-4, 1rem) * -1);
    }

    .-ms-\\[--value\\] {
      margin-inline-start: calc(var(--value) * -1);
    }

    .ms-4 {
      margin-inline-start: var(--spacing-4, 1rem);
    }

    .ms-\\[4px\\] {
      margin-inline-start: 4px;
    }

    .ms-auto {
      margin-inline-start: auto;
    }"
  `)
  expect(run(['ms'])).toEqual('')
})

test('margin-inline-end', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['me-auto', 'me-4', 'me-[4px]', '-me-4', '-me-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-me-4 {
      margin-inline-end: calc(var(--spacing-4, 1rem) * -1);
    }

    .-me-\\[--value\\] {
      margin-inline-end: calc(var(--value) * -1);
    }

    .me-4 {
      margin-inline-end: var(--spacing-4, 1rem);
    }

    .me-\\[4px\\] {
      margin-inline-end: 4px;
    }

    .me-auto {
      margin-inline-end: auto;
    }"
  `)
  expect(run(['me'])).toEqual('')
})

test('margin-right', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['mr-auto', 'mr-4', 'mr-[4px]', '-mr-4', '-mr-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-mr-4 {
      margin-right: calc(var(--spacing-4, 1rem) * -1);
    }

    .-mr-\\[--value\\] {
      margin-right: calc(var(--value) * -1);
    }

    .mr-4 {
      margin-right: var(--spacing-4, 1rem);
    }

    .mr-\\[4px\\] {
      margin-right: 4px;
    }

    .mr-auto {
      margin-right: auto;
    }"
  `)
  expect(run(['mr'])).toEqual('')
})

test('margin-bottom', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['mb-auto', 'mb-4', 'mb-[4px]', '-mb-4', '-mb-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-mb-4 {
      margin-bottom: calc(var(--spacing-4, 1rem) * -1);
    }

    .-mb-\\[--value\\] {
      margin-bottom: calc(var(--value) * -1);
    }

    .mb-4 {
      margin-bottom: var(--spacing-4, 1rem);
    }

    .mb-\\[4px\\] {
      margin-bottom: 4px;
    }

    .mb-auto {
      margin-bottom: auto;
    }"
  `)
  expect(run(['mb'])).toEqual('')
})

test('margin-left', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['ml-auto', 'ml-4', 'ml-[4px]', '-ml-4', '-ml-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-ml-4 {
      margin-left: calc(var(--spacing-4, 1rem) * -1);
    }

    .-ml-\\[--value\\] {
      margin-left: calc(var(--value) * -1);
    }

    .ml-4 {
      margin-left: var(--spacing-4, 1rem);
    }

    .ml-\\[4px\\] {
      margin-left: 4px;
    }

    .ml-auto {
      margin-left: auto;
    }"
  `)
  expect(run(['ml'])).toEqual('')
})

test('margin sort order', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['mb-4', 'me-4', 'mx-4', 'ml-4', 'ms-4', 'm-4', 'mr-4', 'mt-4', 'my-4'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .m-4 {
      margin: var(--spacing-4, 1rem);
    }

    .mx-4 {
      margin-left: var(--spacing-4, 1rem);
      margin-right: var(--spacing-4, 1rem);
    }

    .my-4 {
      margin-top: var(--spacing-4, 1rem);
      margin-bottom: var(--spacing-4, 1rem);
    }

    .ms-4 {
      margin-inline-start: var(--spacing-4, 1rem);
    }

    .me-4 {
      margin-inline-end: var(--spacing-4, 1rem);
    }

    .mt-4 {
      margin-top: var(--spacing-4, 1rem);
    }

    .mr-4 {
      margin-right: var(--spacing-4, 1rem);
    }

    .mb-4 {
      margin-bottom: var(--spacing-4, 1rem);
    }

    .ml-4 {
      margin-left: var(--spacing-4, 1rem);
    }"
  `)
  expect(run(['m'])).toEqual('')
})

test('box-sizing', () => {
  expect(run(['box-border', 'box-content'])).toMatchInlineSnapshot(`
    ".box-border {
      box-sizing: border-box;
    }

    .box-content {
      box-sizing: content-box;
    }"
  `)
  expect(run(['box', '-box-border', '-box-content'])).toEqual('')
})

test('line-clamp', () => {
  expect(run(['line-clamp-4', 'line-clamp-99', 'line-clamp-[123]', 'line-clamp-none']))
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
    run([
      'line-clamp',
      '-line-clamp-4',
      '-line-clamp-[123]',
      '-line-clamp-none',
      'line-clamp-unknown',
      'line-clamp-123.5',
    ]),
  ).toEqual('')
})

test('display', () => {
  expect(
    run([
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
    run([
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
    ]),
  ).toEqual('')
})

test('aspect-ratio', () => {
  expect(run(['aspect-video', 'aspect-[10/9]', 'aspect-4/3'])).toMatchInlineSnapshot(`
    ".aspect-4\\/3 {
      aspect-ratio: 4 / 3;
    }

    .aspect-\\[10\\/9\\] {
      aspect-ratio: 10 / 9;
    }

    .aspect-video {
      aspect-ratio: 16 / 9;
    }"
  `)
  expect(
    run(['aspect', 'aspect-potato', '-aspect-video', '-aspect-[10/9]', 'aspect-foo/bar']),
  ).toEqual('')
})

test('size', () => {
  expect(
    compileCss(
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
    ":root {
      --spacing-4: 1rem;
    }

    .size-1\\/2 {
      width: 50%;
      height: 50%;
    }

    .size-4 {
      width: var(--spacing-4, 1rem);
      height: var(--spacing-4, 1rem);
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
  expect(run(['size', '-size-4', '-size-1/2', '-size-[4px]'])).toEqual('')
})

test('width', () => {
  expect(
    compileCss(
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
    ":root {
      --spacing-4: 1rem;
      --width-xl: 36rem;
    }

    .w-1\\/2 {
      width: 50%;
    }

    .w-4 {
      width: var(--spacing-4, 1rem);
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
      width: var(--width-xl, 36rem);
    }"
  `)
  expect(run(['w', '-w-4', '-w-1/2', '-w-[4px]'])).toEqual('')
})

test('min-width', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --width-xl: 36rem;
        }
        @tailwind utilities;
      `,
      [
        'min-w-auto',
        'min-w-full',
        'min-w-min',
        'min-w-max',
        'min-w-fit',
        'min-w-4',
        'min-w-xl',
        'min-w-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
      --width-xl: 36rem;
    }

    .min-w-4 {
      min-width: var(--spacing-4, 1rem);
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
      min-width: var(--width-xl, 36rem);
    }"
  `)
  expect(run(['min-w', '-min-w-4', '-min-w-[4px]'])).toEqual('')
})

test('max-width', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
          --width-xl: 36rem;
        }
        @tailwind utilities;
      `,
      [
        'max-w-none',
        'max-w-full',
        'max-w-max',
        'max-w-max',
        'max-w-fit',
        'max-w-4',
        'max-w-xl',
        'max-w-[4px]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
      --width-xl: 36rem;
    }

    .max-w-4 {
      max-width: var(--spacing-4, 1rem);
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
      max-width: var(--width-xl, 36rem);
    }"
  `)
  expect(run(['max-w', '-max-w-4', '-max-w-[4px]'])).toEqual('')
})

test('height', () => {
  expect(
    compileCss(
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
    ":root {
      --spacing-4: 1rem;
    }

    .h-1\\/2 {
      height: 50%;
    }

    .h-4 {
      height: var(--spacing-4, 1rem);
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
  expect(run(['h', '-h-4', '-h-1/2', '-h-[4px]'])).toEqual('')
})

test('min-height', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      [
        'min-h-auto',
        'min-h-full',
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
    ":root {
      --spacing-4: 1rem;
    }

    .min-h-4 {
      min-height: var(--spacing-4, 1rem);
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
  expect(run(['min-h', '-min-h-4', '-min-h-[4px]'])).toEqual('')
})

test('max-height', () => {
  expect(
    compileCss(
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
    ":root {
      --spacing-4: 1rem;
    }

    .max-h-4 {
      max-height: var(--spacing-4, 1rem);
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
  expect(run(['max-h', '-max-h-4', '-max-h-[4px]'])).toEqual('')
})

test('flex', () => {
  expect(
    run(['flex-1', 'flex-99', 'flex-1/2', 'flex-auto', 'flex-initial', 'flex-none', 'flex-[123]']),
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
    run(['-flex-1', '-flex-auto', '-flex-initial', '-flex-none', '-flex-[123]', 'flex-unknown']),
  ).toEqual('')
})

test('flex-shrink', () => {
  expect(run(['shrink', 'shrink-0', 'shrink-[123]'])).toMatchInlineSnapshot(`
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
  expect(run(['-shrink', '-shrink-0', '-shrink-[123]', 'shrink-unknown'])).toEqual('')
})

test('flex-grow', () => {
  expect(run(['grow', 'grow-0', 'grow-[123]'])).toMatchInlineSnapshot(`
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
  expect(run(['-grow', '-grow-0', '-grow-[123]', 'grow-unknown'])).toEqual('')
})

test('flex-basis', () => {
  expect(
    compileCss(
      css`
        @theme {
          --width-xl: 36rem;
        }
        @tailwind utilities;
      `,
      ['basis-auto', 'basis-full', 'basis-xl', 'basis-11/12', 'basis-[123px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --width-xl: 36rem;
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
      flex-basis: var(--width-xl, 36rem);
    }"
  `)
  expect(run(['basis', '-basis-full', '-basis-[123px]'])).toEqual('')
})

test('table-layout', () => {
  expect(run(['table-auto', 'table-fixed'])).toMatchInlineSnapshot(`
    ".table-auto {
      table-layout: auto;
    }

    .table-fixed {
      table-layout: fixed;
    }"
  `)
  expect(run(['-table-auto', '-table-fixed'])).toEqual('')
})

test('caption-side', () => {
  expect(run(['caption-top', 'caption-bottom'])).toMatchInlineSnapshot(`
    ".caption-bottom {
      caption-side: bottom;
    }

    .caption-top {
      caption-side: top;
    }"
  `)
  expect(run(['-caption-top', '-caption-bottom'])).toEqual('')
})

test('border-collapse', () => {
  expect(run(['border-collapse', 'border-separate'])).toMatchInlineSnapshot(`
    ".border-collapse {
      border-collapse: collapse;
    }

    .border-separate {
      border-collapse: separate;
    }"
  `)
  expect(run(['-border-collapse', '-border-separate'])).toEqual('')
})

test('border-spacing', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-1: 0.25rem;
        }
        @tailwind utilities;
      `,
      ['border-spacing-1', 'border-spacing-[123px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-1: .25rem;
    }

    .border-spacing-1 {
      --tw-border-spacing-x: var(--spacing-1, .25rem);
      --tw-border-spacing-y: var(--spacing-1, .25rem);
      border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
    }

    .border-spacing-\\[123px\\] {
      --tw-border-spacing-x: 123px;
      --tw-border-spacing-y: 123px;
      border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-border-spacing-x: 0;
          --tw-border-spacing-y: 0;
        }
      }
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
  expect(run(['border-spacing', '-border-spacing-1', '-border-spacing-[123px]'])).toEqual('')
})

test('border-spacing-x', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-1: 0.25rem;
        }
        @tailwind utilities;
      `,
      ['border-spacing-x-1', 'border-spacing-x-[123px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-1: .25rem;
    }

    .border-spacing-x-1 {
      --tw-border-spacing-x: var(--spacing-1, .25rem);
      border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
    }

    .border-spacing-x-\\[123px\\] {
      --tw-border-spacing-x: 123px;
      border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-border-spacing-x: 0;
          --tw-border-spacing-y: 0;
        }
      }
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
  expect(run(['border-spacing-x', '-border-spacing-x-1', '-border-spacing-x-[123px]'])).toEqual('')
})

test('border-spacing-y', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-1: 0.25rem;
        }
        @tailwind utilities;
      `,
      ['border-spacing-y-1', 'border-spacing-y-[123px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-1: .25rem;
    }

    .border-spacing-y-1 {
      --tw-border-spacing-y: var(--spacing-1, .25rem);
      border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
    }

    .border-spacing-y-\\[123px\\] {
      --tw-border-spacing-y: 123px;
      border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-border-spacing-x: 0;
          --tw-border-spacing-y: 0;
        }
      }
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
  expect(run(['border-spacing-x', '-border-spacing-y-1', '-border-spacing-y-[123px]'])).toEqual('')
})

test('origin', () => {
  expect(
    run([
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
      'origin-[--value]',
    ]),
  ).toMatchInlineSnapshot(`
    ".origin-\\[--value\\] {
      transform-origin: var(--value);
    }

    .origin-\\[50px_100px\\] {
      transform-origin: 50px 100px;
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
  expect(run(['-origin-center', '-origin-[--value]'])).toEqual('')
})

test('perspective-origin', () => {
  expect(
    run([
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
      'perspective-origin-[--value]',
    ]),
  ).toMatchInlineSnapshot(`
    ".perspective-origin-\\[--value\\] {
      perspective-origin: var(--value);
    }

    .perspective-origin-\\[50px_100px\\] {
      perspective-origin: 50px 100px;
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
  expect(run(['-perspective-origin-center', '-perspective-origin-[--value]'])).toEqual('')
})

test('translate', () => {
  expect(
    run([
      'translate-1/2',
      'translate-full',
      '-translate-full',
      'translate-[123px]',
      '-translate-[--value]',
    ]),
  ).toMatchInlineSnapshot(`
    ".-translate-\\[--value\\] {
      --tw-translate-x: calc(var(--value) * -1);
      --tw-translate-y: calc(var(--value) * -1);
      --tw-translate-z: calc(var(--value) * -1);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .-translate-full {
      --tw-translate-x: -100%;
      --tw-translate-y: -100%;
      --tw-translate-z: -100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-1\\/2 {
      --tw-translate-x: calc(1 / 2 * 100%);
      --tw-translate-y: calc(1 / 2 * 100%);
      --tw-translate-z: calc(1 / 2 * 100%);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-\\[123px\\] {
      --tw-translate-x: 123px;
      --tw-translate-y: 123px;
      --tw-translate-z: 123px;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .translate-full {
      --tw-translate-x: 100%;
      --tw-translate-y: 100%;
      --tw-translate-z: 100%;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-translate-z: 0;
        }
      }
    }

    @property --tw-translate-x {
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-y {
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-z {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(run(['translate'])).toEqual('')
})

test('translate-x', () => {
  expect(run(['translate-x-full', '-translate-x-full', 'translate-x-px', '-translate-x-[--value]']))
    .toMatchInlineSnapshot(`
      ".-translate-x-\\[--value\\] {
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

      @supports (-moz-orient: inline) {
        @layer base {
          *, :before, :after, ::backdrop {
            --tw-translate-x: 0;
            --tw-translate-y: 0;
            --tw-translate-z: 0;
          }
        }
      }

      @property --tw-translate-x {
        syntax: "<length> | <percentage>";
        inherits: false;
        initial-value: 0;
      }

      @property --tw-translate-y {
        syntax: "<length> | <percentage>";
        inherits: false;
        initial-value: 0;
      }

      @property --tw-translate-z {
        syntax: "<length>";
        inherits: false;
        initial-value: 0;
      }"
    `)
  expect(run(['translate-x'])).toEqual('')
})

test('translate-y', () => {
  expect(run(['translate-y-full', '-translate-y-full', 'translate-y-px', '-translate-y-[--value]']))
    .toMatchInlineSnapshot(`
      ".-translate-y-\\[--value\\] {
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

      @supports (-moz-orient: inline) {
        @layer base {
          *, :before, :after, ::backdrop {
            --tw-translate-x: 0;
            --tw-translate-y: 0;
            --tw-translate-z: 0;
          }
        }
      }

      @property --tw-translate-x {
        syntax: "<length> | <percentage>";
        inherits: false;
        initial-value: 0;
      }

      @property --tw-translate-y {
        syntax: "<length> | <percentage>";
        inherits: false;
        initial-value: 0;
      }

      @property --tw-translate-z {
        syntax: "<length>";
        inherits: false;
        initial-value: 0;
      }"
    `)
  expect(run(['translate-y'])).toEqual('')
})

test('translate-z', () => {
  expect(run(['translate-y-px', '-translate-z-[--value]'])).toMatchInlineSnapshot(`
    ".translate-y-px {
      --tw-translate-y: 1px;
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }

    .-translate-z-\\[--value\\] {
      --tw-translate-z: calc(var(--value) * -1);
      translate: var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-translate-z: 0;
        }
      }
    }

    @property --tw-translate-x {
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-y {
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-z {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(run(['translate-z', 'translate-z-full', '-translate-z-full', 'translate-z-1/2'])).toEqual(
    '',
  )
})

test('translate-3d', () => {
  expect(run(['translate-3d'])).toMatchInlineSnapshot(`
    ".translate-3d {
      translate: var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-translate-x: 0;
          --tw-translate-y: 0;
          --tw-translate-z: 0;
        }
      }
    }

    @property --tw-translate-x {
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-y {
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-translate-z {
      syntax: "<length>";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(run(['-translate-3d'])).toEqual('')
})

test('rotate', () => {
  expect(run(['rotate-45', '-rotate-45', 'rotate-[123deg]', 'rotate-[0.3_0.7_1_45deg]']))
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
  expect(run(['rotate', 'rotate-z', 'rotate-unknown'])).toEqual('')
})

test('rotate-x', () => {
  expect(run(['rotate-x-45', '-rotate-x-45', 'rotate-x-[123deg]'])).toMatchInlineSnapshot(`
    ".-rotate-x-45 {
      --tw-rotate-x: calc(rotateX(45deg) * -1);
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    .rotate-x-45 {
      --tw-rotate-x: rotateX(45deg);
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    .rotate-x-\\[123deg\\] {
      --tw-rotate-x: 123deg;
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-rotate-x: rotateX(0);
          --tw-rotate-y: rotateY(0);
          --tw-rotate-z: rotateZ(0);
          --tw-skew-x: skewX(0);
          --tw-skew-y: skewY(0);
        }
      }
    }

    @property --tw-rotate-x {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateX(0);
    }

    @property --tw-rotate-y {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateY(0);
    }

    @property --tw-rotate-z {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateZ(0);
    }

    @property --tw-skew-x {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: skewX(0);
    }

    @property --tw-skew-y {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: skewY(0);
    }"
  `)
  expect(run(['rotate-x', '-rotate-x', 'rotate-x-potato'])).toEqual('')
})

test('rotate-y', () => {
  expect(run(['rotate-y-45', '-rotate-y-45', 'rotate-y-[123deg]'])).toMatchInlineSnapshot(`
    ".-rotate-y-45 {
      --tw-rotate-y: calc(rotateY(45deg) * -1);
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    .rotate-y-45 {
      --tw-rotate-y: rotateY(45deg);
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    .rotate-y-\\[123deg\\] {
      --tw-rotate-y: 123deg;
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-rotate-x: rotateX(0);
          --tw-rotate-y: rotateY(0);
          --tw-rotate-z: rotateZ(0);
          --tw-skew-x: skewX(0);
          --tw-skew-y: skewY(0);
        }
      }
    }

    @property --tw-rotate-x {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateX(0);
    }

    @property --tw-rotate-y {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateY(0);
    }

    @property --tw-rotate-z {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateZ(0);
    }

    @property --tw-skew-x {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: skewX(0);
    }

    @property --tw-skew-y {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: skewY(0);
    }"
  `)
  expect(run(['rotate-y', '-rotate-y', 'rotate-y-potato'])).toEqual('')
})

test('skew', () => {
  expect(run(['skew-6', '-skew-6', 'skew-[123deg]'])).toMatchInlineSnapshot(`
    ".-skew-6 {
      --tw-skew-x: skewX(calc(6deg * -1));
      --tw-skew-y: skewY(calc(6deg * -1));
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    .skew-6 {
      --tw-skew-x: skewX(6deg);
      --tw-skew-y: skewY(6deg);
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    .skew-\\[123deg\\] {
      --tw-skew-x: skewX(123deg);
      --tw-skew-y: skewY(123deg);
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-rotate-x: rotateX(0);
          --tw-rotate-y: rotateY(0);
          --tw-rotate-z: rotateZ(0);
          --tw-skew-x: skewX(0);
          --tw-skew-y: skewY(0);
        }
      }
    }

    @property --tw-rotate-x {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateX(0);
    }

    @property --tw-rotate-y {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateY(0);
    }

    @property --tw-rotate-z {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateZ(0);
    }

    @property --tw-skew-x {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: skewX(0);
    }

    @property --tw-skew-y {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: skewY(0);
    }"
  `)
  expect(run(['skew', 'skew-unknown'])).toEqual('')
})

test('skew-x', () => {
  expect(run(['skew-x-6', '-skew-x-6', 'skew-x-[123deg]'])).toMatchInlineSnapshot(`
    ".-skew-x-6 {
      --tw-skew-x: skewX(calc(6deg * -1));
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    .skew-x-6 {
      --tw-skew-x: skewX(6deg);
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    .skew-x-\\[123deg\\] {
      --tw-skew-x: skewX(123deg);
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-rotate-x: rotateX(0);
          --tw-rotate-y: rotateY(0);
          --tw-rotate-z: rotateZ(0);
          --tw-skew-x: skewX(0);
          --tw-skew-y: skewY(0);
        }
      }
    }

    @property --tw-rotate-x {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateX(0);
    }

    @property --tw-rotate-y {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateY(0);
    }

    @property --tw-rotate-z {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateZ(0);
    }

    @property --tw-skew-x {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: skewX(0);
    }

    @property --tw-skew-y {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: skewY(0);
    }"
  `)
  expect(run(['skew-x', 'skew-x-unknown'])).toEqual('')
})

test('skew-y', () => {
  expect(run(['skew-y-6', '-skew-y-6', 'skew-y-[123deg]'])).toMatchInlineSnapshot(`
    ".-skew-y-6 {
      --tw-skew-y: skewY(calc(6deg * -1));
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    .skew-y-6 {
      --tw-skew-y: skewY(6deg);
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    .skew-y-\\[123deg\\] {
      --tw-skew-y: skewY(123deg);
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-rotate-x: rotateX(0);
          --tw-rotate-y: rotateY(0);
          --tw-rotate-z: rotateZ(0);
          --tw-skew-x: skewX(0);
          --tw-skew-y: skewY(0);
        }
      }
    }

    @property --tw-rotate-x {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateX(0);
    }

    @property --tw-rotate-y {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateY(0);
    }

    @property --tw-rotate-z {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateZ(0);
    }

    @property --tw-skew-x {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: skewX(0);
    }

    @property --tw-skew-y {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: skewY(0);
    }"
  `)
  expect(run(['skew-y', 'skew-y-unknown'])).toEqual('')
})

test('scale', () => {
  expect(run(['scale-50', '-scale-50', 'scale-[2]', 'scale-[2_1.5_3]'])).toMatchInlineSnapshot(`
    ".-scale-50 {
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

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-scale-z: 1;
        }
      }
    }

    @property --tw-scale-x {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-y {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-z {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }"
  `)
  expect(run(['scale', 'scale-unknown'])).toEqual('')
})

test('scale-3d', () => {
  expect(run(['scale-3d'])).toMatchInlineSnapshot(`
    ".scale-3d {
      scale: var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-scale-z: 1;
        }
      }
    }

    @property --tw-scale-x {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-y {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-z {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }"
  `)
  expect(run(['-scale-3d'])).toEqual('')
})

test('scale-x', () => {
  expect(run(['scale-x-50', '-scale-x-50', 'scale-x-[2]'])).toMatchInlineSnapshot(`
    ".-scale-x-50 {
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

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-scale-z: 1;
        }
      }
    }

    @property --tw-scale-x {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-y {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-z {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }"
  `)
  expect(run(['scale-200', 'scale-x-400'])).toMatchInlineSnapshot(`
    ".scale-200 {
      --tw-scale-x: 200%;
      --tw-scale-y: 200%;
      --tw-scale-z: 200%;
      scale: var(--tw-scale-x) var(--tw-scale-y);
    }

    .scale-x-400 {
      --tw-scale-x: 400%;
      scale: var(--tw-scale-x) var(--tw-scale-y);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-scale-z: 1;
        }
      }
    }

    @property --tw-scale-x {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-y {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-z {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }"
  `)
  expect(run(['scale-x', 'scale-x-unknown'])).toEqual('')
})

test('scale-y', () => {
  expect(run(['scale-y-50', '-scale-y-50', 'scale-y-[2]'])).toMatchInlineSnapshot(`
    ".-scale-y-50 {
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

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-scale-z: 1;
        }
      }
    }

    @property --tw-scale-x {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-y {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-z {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }"
  `)
  expect(run(['scale-y', 'scale-y-unknown'])).toEqual('')
})

test('scale-z', () => {
  expect(run(['scale-z-50', '-scale-z-50', 'scale-z-[123deg]'])).toMatchInlineSnapshot(`
    ".-scale-z-50 {
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

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-scale-x: 1;
          --tw-scale-y: 1;
          --tw-scale-z: 1;
        }
      }
    }

    @property --tw-scale-x {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-y {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }

    @property --tw-scale-z {
      syntax: "<number> | <percentage>";
      inherits: false;
      initial-value: 1;
    }"
  `)
  expect(run(['scale-z'])).toEqual('')
})

test('transform', () => {
  expect(
    run([
      'transform',
      'transform-cpu',
      'transform-gpu',
      'transform-none',
      'transform-[scaleZ(2)_rotateY(45deg)]',
    ]),
  ).toMatchInlineSnapshot(`
    ".transform {
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    .transform-\\[scaleZ\\(2\\)_rotateY\\(45deg\\)\\] {
      transform: scaleZ(2)rotateY(45deg);
    }

    .transform-cpu {
      transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    .transform-gpu {
      transform: translateZ(0) var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);
    }

    .transform-none {
      transform: none;
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-rotate-x: rotateX(0);
          --tw-rotate-y: rotateY(0);
          --tw-rotate-z: rotateZ(0);
          --tw-skew-x: skewX(0);
          --tw-skew-y: skewY(0);
        }
      }
    }

    @property --tw-rotate-x {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateX(0);
    }

    @property --tw-rotate-y {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateY(0);
    }

    @property --tw-rotate-z {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: rotateZ(0);
    }

    @property --tw-skew-x {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: skewX(0);
    }

    @property --tw-skew-y {
      syntax: "<transform-function>";
      inherits: false;
      initial-value: skewY(0);
    }"
  `)
  expect(
    run([
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
  expect(run(['-transform', '-transform-cpu', '-transform-gpu', '-transform-none'])).toEqual('')
})

test('perspective', () => {
  expect(
    compileCss(
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
    ":root {
      --perspective-dramatic: 100px;
      --perspective-normal: 500px;
    }

    .perspective-\\[456px\\] {
      perspective: 456px;
    }

    .perspective-dramatic {
      perspective: var(--perspective-dramatic, 100px);
    }

    .perspective-none {
      perspective: none;
    }

    .perspective-normal {
      perspective: var(--perspective-normal, 500px);
    }"
  `)
  expect(run(['perspective', '-perspective', 'perspective-potato', 'perspective-123'])).toEqual('')
})

test('cursor', () => {
  expect(
    compileCss(
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
        'cursor-[--value]',
        'cursor-custom',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --cursor-custom: url("/my-cursor.png");
    }

    .cursor-\\[--value\\] {
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
      cursor: var(--cursor-custom, url("/my-cursor.png"));
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
    run([
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
      '-cursor-[--value]',
      '-cursor-custom',
    ]),
  ).toEqual('')
})

test('touch-action', () => {
  expect(run(['touch-auto', 'touch-none', 'touch-manipulation'])).toMatchInlineSnapshot(`
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
  expect(run(['-touch-auto', '-touch-none', '-touch-manipulation'])).toEqual('')
})

test('touch-pan', () => {
  expect(
    run([
      'touch-pan-x',
      'touch-pan-left',
      'touch-pan-right',
      'touch-pan-y',
      'touch-pan-up',
      'touch-pan-down',
    ]),
  ).toMatchInlineSnapshot(`
    ".touch-pan-down {
      --tw-pan-y: pan-down;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    .touch-pan-left {
      --tw-pan-x: pan-left;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    .touch-pan-right {
      --tw-pan-x: pan-right;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    .touch-pan-up {
      --tw-pan-y: pan-up;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    .touch-pan-x {
      --tw-pan-x: pan-x;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    .touch-pan-y {
      --tw-pan-y: pan-y;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-pan-x: ;
          --tw-pan-y: ;
          --tw-pinch-zoom: ;
        }
      }
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
    run([
      '-touch-pan-x',
      '-touch-pan-left',
      '-touch-pan-right',
      '-touch-pan-y',
      '-touch-pan-up',
      '-touch-pan-down',
    ]),
  ).toEqual('')
})

test('touch-pinch-zoom', () => {
  expect(run(['touch-pinch-zoom'])).toMatchInlineSnapshot(`
    ".touch-pinch-zoom {
      --tw-pinch-zoom: pinch-zoom;
      touch-action: var(--tw-pan-x, ) var(--tw-pan-y, ) var(--tw-pinch-zoom, );
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-pan-x: ;
          --tw-pan-y: ;
          --tw-pinch-zoom: ;
        }
      }
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
  expect(run(['-touch-pinch-zoom'])).toEqual('')
})

test('select', () => {
  expect(run(['select-none', 'select-text', 'select-all', 'select-auto'])).toMatchInlineSnapshot(`
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
  expect(run(['-select-none', '-select-text', '-select-all', '-select-auto'])).toEqual('')
})

test('resize', () => {
  expect(run(['resize-none', 'resize-both', 'resize-x', 'resize-y'])).toMatchInlineSnapshot(`
    ".resize-both {
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
  expect(run(['-resize-none', '-resize-both', '-resize-x', '-resize-y'])).toEqual('')
})

test('scroll-snap-type', () => {
  expect(run(['snap-none', 'snap-x', 'snap-y', 'snap-both'])).toMatchInlineSnapshot(`
    ".snap-both {
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

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-scroll-snap-strictness: proximity;
        }
      }
    }

    @property --tw-scroll-snap-strictness {
      syntax: "*";
      inherits: false;
      initial-value: proximity;
    }"
  `)
  expect(run(['-snap-none', '-snap-x', '-snap-y', '-snap-both'])).toEqual('')
})

test('--tw-scroll-snap-strictness', () => {
  expect(run(['snap-mandatory', 'snap-proximity'])).toMatchInlineSnapshot(`
    ".snap-mandatory {
      --tw-scroll-snap-strictness: mandatory;
    }

    .snap-proximity {
      --tw-scroll-snap-strictness: proximity;
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-scroll-snap-strictness: proximity;
        }
      }
    }

    @property --tw-scroll-snap-strictness {
      syntax: "*";
      inherits: false;
      initial-value: proximity;
    }"
  `)
  expect(run(['-snap-mandatory', '-snap-proximity'])).toEqual('')
})

test('scroll-snap-align', () => {
  expect(run(['snap-align-none', 'snap-start', 'snap-end', 'snap-center'])).toMatchInlineSnapshot(`
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
  expect(run(['-snap-align-none', '-snap-start', '-snap-end', '-snap-center'])).toEqual('')
})

test('scroll-snap-stop', () => {
  expect(run(['snap-normal', 'snap-always'])).toMatchInlineSnapshot(`
    ".snap-always {
      scroll-snap-stop: always;
    }

    .snap-normal {
      scroll-snap-stop: normal;
    }"
  `)
  expect(run(['-snap-normal', '-snap-always'])).toEqual('')
})

test('scroll-m', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-m-4', 'scroll-m-[4px]', '-scroll-m-4', '-scroll-m-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-m-4 {
      scroll-margin: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-m-\\[--value\\] {
      scroll-margin: calc(var(--value) * -1);
    }

    .scroll-m-4 {
      scroll-margin: var(--spacing-4, 1rem);
    }

    .scroll-m-\\[4px\\] {
      scroll-margin: 4px;
    }"
  `)
  expect(run(['scroll-m'])).toEqual('')
})

test('scroll-mx', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-mx-4', 'scroll-mx-[4px]', '-scroll-mx-4', '-scroll-mx-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-mx-4 {
      scroll-margin-left: calc(var(--spacing-4, 1rem) * -1);
      scroll-margin-right: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-mx-\\[--value\\] {
      scroll-margin-left: calc(var(--value) * -1);
      scroll-margin-right: calc(var(--value) * -1);
    }

    .scroll-mx-4 {
      scroll-margin-left: var(--spacing-4, 1rem);
      scroll-margin-right: var(--spacing-4, 1rem);
    }

    .scroll-mx-\\[4px\\] {
      scroll-margin-left: 4px;
      scroll-margin-right: 4px;
    }"
  `)
  expect(run(['scroll-mx'])).toEqual('')
})

test('scroll-my', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-my-4', 'scroll-my-[4px]', '-scroll-my-4', '-scroll-my-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-my-4 {
      scroll-margin-top: calc(var(--spacing-4, 1rem) * -1);
      scroll-margin-bottom: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-my-\\[--value\\] {
      scroll-margin-top: calc(var(--value) * -1);
      scroll-margin-bottom: calc(var(--value) * -1);
    }

    .scroll-my-4 {
      scroll-margin-top: var(--spacing-4, 1rem);
      scroll-margin-bottom: var(--spacing-4, 1rem);
    }

    .scroll-my-\\[4px\\] {
      scroll-margin-top: 4px;
      scroll-margin-bottom: 4px;
    }"
  `)
  expect(run(['scroll-my'])).toEqual('')
})

test('scroll-ms', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-ms-4', 'scroll-ms-[4px]', '-scroll-ms-4', '-scroll-ms-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-ms-4 {
      scroll-margin-inline-start: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-ms-\\[--value\\] {
      scroll-margin-inline-start: calc(var(--value) * -1);
    }

    .scroll-ms-4 {
      scroll-margin-inline-start: var(--spacing-4, 1rem);
    }

    .scroll-ms-\\[4px\\] {
      scroll-margin-inline-start: 4px;
    }"
  `)
  expect(run(['scroll-ms'])).toEqual('')
})

test('scroll-me', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-me-4', 'scroll-me-[4px]', '-scroll-me-4', '-scroll-me-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-me-4 {
      scroll-margin-inline-end: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-me-\\[--value\\] {
      scroll-margin-inline-end: calc(var(--value) * -1);
    }

    .scroll-me-4 {
      scroll-margin-inline-end: var(--spacing-4, 1rem);
    }

    .scroll-me-\\[4px\\] {
      scroll-margin-inline-end: 4px;
    }"
  `)
  expect(run(['scroll-me'])).toEqual('')
})

test('scroll-mt', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-mt-4', 'scroll-mt-[4px]', '-scroll-mt-4', '-scroll-mt-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-mt-4 {
      scroll-margin-top: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-mt-\\[--value\\] {
      scroll-margin-top: calc(var(--value) * -1);
    }

    .scroll-mt-4 {
      scroll-margin-top: var(--spacing-4, 1rem);
    }

    .scroll-mt-\\[4px\\] {
      scroll-margin-top: 4px;
    }"
  `)
  expect(run(['scroll-mt'])).toEqual('')
})

test('scroll-mr', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-mr-4', 'scroll-mr-[4px]', '-scroll-mr-4', '-scroll-mr-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-mr-4 {
      scroll-margin-right: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-mr-\\[--value\\] {
      scroll-margin-right: calc(var(--value) * -1);
    }

    .scroll-mr-4 {
      scroll-margin-right: var(--spacing-4, 1rem);
    }

    .scroll-mr-\\[4px\\] {
      scroll-margin-right: 4px;
    }"
  `)
  expect(run(['scroll-mr'])).toEqual('')
})

test('scroll-mb', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-mb-4', 'scroll-mb-[4px]', '-scroll-mb-4', '-scroll-mb-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-mb-4 {
      scroll-margin-bottom: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-mb-\\[--value\\] {
      scroll-margin-bottom: calc(var(--value) * -1);
    }

    .scroll-mb-4 {
      scroll-margin-bottom: var(--spacing-4, 1rem);
    }

    .scroll-mb-\\[4px\\] {
      scroll-margin-bottom: 4px;
    }"
  `)
  expect(run(['scroll-mb'])).toEqual('')
})

test('scroll-ml', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-ml-4', 'scroll-ml-[4px]', '-scroll-ml-4', '-scroll-ml-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-ml-4 {
      scroll-margin-left: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-ml-\\[--value\\] {
      scroll-margin-left: calc(var(--value) * -1);
    }

    .scroll-ml-4 {
      scroll-margin-left: var(--spacing-4, 1rem);
    }

    .scroll-ml-\\[4px\\] {
      scroll-margin-left: 4px;
    }"
  `)
  expect(run(['scroll-ml'])).toEqual('')
})

test('scroll-p', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-p-4', 'scroll-p-[4px]', '-scroll-p-4', '-scroll-p-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-p-4 {
      scroll-padding: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-p-\\[--value\\] {
      scroll-padding: calc(var(--value) * -1);
    }

    .scroll-p-4 {
      scroll-padding: var(--spacing-4, 1rem);
    }

    .scroll-p-\\[4px\\] {
      scroll-padding: 4px;
    }"
  `)
  expect(run(['scroll-p'])).toEqual('')
})

test('scroll-px', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-px-4', 'scroll-px-[4px]', '-scroll-px-4', '-scroll-px-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-px-4 {
      scroll-padding-left: calc(var(--spacing-4, 1rem) * -1);
      scroll-padding-right: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-px-\\[--value\\] {
      scroll-padding-left: calc(var(--value) * -1);
      scroll-padding-right: calc(var(--value) * -1);
    }

    .scroll-px-4 {
      scroll-padding-left: var(--spacing-4, 1rem);
      scroll-padding-right: var(--spacing-4, 1rem);
    }

    .scroll-px-\\[4px\\] {
      scroll-padding-left: 4px;
      scroll-padding-right: 4px;
    }"
  `)
  expect(run(['scroll-px'])).toEqual('')
})

test('scroll-py', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-py-4', 'scroll-py-[4px]', '-scroll-py-4', '-scroll-py-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-py-4 {
      scroll-padding-top: calc(var(--spacing-4, 1rem) * -1);
      scroll-padding-bottom: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-py-\\[--value\\] {
      scroll-padding-top: calc(var(--value) * -1);
      scroll-padding-bottom: calc(var(--value) * -1);
    }

    .scroll-py-4 {
      scroll-padding-top: var(--spacing-4, 1rem);
      scroll-padding-bottom: var(--spacing-4, 1rem);
    }

    .scroll-py-\\[4px\\] {
      scroll-padding-top: 4px;
      scroll-padding-bottom: 4px;
    }"
  `)
  expect(run(['scroll-py'])).toEqual('')
})

test('scroll-ps', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-ps-4', 'scroll-ps-[4px]', '-scroll-ps-4', '-scroll-ps-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-ps-4 {
      scroll-padding-inline-start: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-ps-\\[--value\\] {
      scroll-padding-inline-start: calc(var(--value) * -1);
    }

    .scroll-ps-4 {
      scroll-padding-inline-start: var(--spacing-4, 1rem);
    }

    .scroll-ps-\\[4px\\] {
      scroll-padding-inline-start: 4px;
    }"
  `)
  expect(run(['scroll-ps'])).toEqual('')
})

test('scroll-pe', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-pe-4', 'scroll-pe-[4px]', '-scroll-pe-4', '-scroll-pe-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-pe-4 {
      scroll-padding-inline-end: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-pe-\\[--value\\] {
      scroll-padding-inline-end: calc(var(--value) * -1);
    }

    .scroll-pe-4 {
      scroll-padding-inline-end: var(--spacing-4, 1rem);
    }

    .scroll-pe-\\[4px\\] {
      scroll-padding-inline-end: 4px;
    }"
  `)
  expect(run(['scroll-pe'])).toEqual('')
})

test('scroll-pt', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-pt-4', 'scroll-pt-[4px]', '-scroll-pt-4', '-scroll-pt-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-pt-4 {
      scroll-padding-top: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-pt-\\[--value\\] {
      scroll-padding-top: calc(var(--value) * -1);
    }

    .scroll-pt-4 {
      scroll-padding-top: var(--spacing-4, 1rem);
    }

    .scroll-pt-\\[4px\\] {
      scroll-padding-top: 4px;
    }"
  `)
  expect(run(['scroll-pt'])).toEqual('')
})

test('scroll-pr', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-pr-4', 'scroll-pr-[4px]', '-scroll-pr-4', '-scroll-pr-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-pr-4 {
      scroll-padding-right: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-pr-\\[--value\\] {
      scroll-padding-right: calc(var(--value) * -1);
    }

    .scroll-pr-4 {
      scroll-padding-right: var(--spacing-4, 1rem);
    }

    .scroll-pr-\\[4px\\] {
      scroll-padding-right: 4px;
    }"
  `)
  expect(run(['scroll-pr'])).toEqual('')
})

test('scroll-pb', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-pb-4', 'scroll-pb-[4px]', '-scroll-pb-4', '-scroll-pb-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-pb-4 {
      scroll-padding-bottom: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-pb-\\[--value\\] {
      scroll-padding-bottom: calc(var(--value) * -1);
    }

    .scroll-pb-4 {
      scroll-padding-bottom: var(--spacing-4, 1rem);
    }

    .scroll-pb-\\[4px\\] {
      scroll-padding-bottom: 4px;
    }"
  `)
  expect(run(['scroll-pb'])).toEqual('')
})

test('scroll-pl', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['scroll-pl-4', 'scroll-pl-[4px]', '-scroll-pl-4', '-scroll-pl-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .-scroll-pl-4 {
      scroll-padding-left: calc(var(--spacing-4, 1rem) * -1);
    }

    .-scroll-pl-\\[--value\\] {
      scroll-padding-left: calc(var(--value) * -1);
    }

    .scroll-pl-4 {
      scroll-padding-left: var(--spacing-4, 1rem);
    }

    .scroll-pl-\\[4px\\] {
      scroll-padding-left: 4px;
    }"
  `)
  expect(run(['scroll-pl'])).toEqual('')
})

test('list-style-position', () => {
  expect(run(['list-inside', 'list-outside'])).toMatchInlineSnapshot(`
    ".list-inside {
      list-style-position: inside;
    }

    .list-outside {
      list-style-position: outside;
    }"
  `)
  expect(run(['-list-inside', '-list-outside'])).toEqual('')
})

test('list', () => {
  expect(run(['list-none', 'list-disc', 'list-decimal', 'list-[--value]'])).toMatchInlineSnapshot(`
    ".list-\\[--value\\] {
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
  expect(run(['-list-none', '-list-disc', '-list-decimal', '-list-[--value]'])).toEqual('')
})

test('list-image', () => {
  expect(run(['list-image-none', 'list-image-[--value]'])).toMatchInlineSnapshot(`
    ".list-image-\\[--value\\] {
      list-style-image: var(--value);
    }

    .list-image-none {
      list-style-image: none;
    }"
  `)
  expect(run(['list-image', '-list-image-none', '-list-image-[--value]'])).toEqual('')
})

test('appearance', () => {
  expect(run(['appearance-none', 'appearance-auto'])).toMatchInlineSnapshot(`
    ".appearance-auto {
      appearance: auto;
    }

    .appearance-none {
      appearance: none;
    }"
  `)
  expect(run(['appearance', '-appearance-none', '-appearance-auto'])).toEqual('')
})

test('columns', () => {
  expect(
    compileCss(
      css`
        @theme {
          --width-3xs: 16rem;
          --width-7xl: 80rem;
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
        'columns-[--value]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --width-3xs: 16rem;
      --width-7xl: 80rem;
    }

    .columns-3xs {
      columns: var(--width-3xs, 16rem);
    }

    .columns-4 {
      columns: 4;
    }

    .columns-7xl {
      columns: var(--width-7xl, 80rem);
    }

    .columns-99 {
      columns: 99;
    }

    .columns-\\[--value\\] {
      columns: var(--value);
    }

    .columns-\\[123\\] {
      columns: 123;
    }

    .columns-auto {
      columns: auto;
    }"
  `)
  expect(
    run(['columns', '-columns-4', '-columns-[123]', '-columns-[--value]', 'columns-unknown']),
  ).toEqual('')
})

test('break-before', () => {
  expect(
    run([
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
    run([
      'break-before',
      '-break-before-auto',
      '-break-before-avoid',
      '-break-before-all',
      '-break-before-avoid-page',
      '-break-before-page',
      '-break-before-left',
      '-break-before-right',
      '-break-before-column',
    ]),
  ).toEqual('')
})

test('break-inside', () => {
  expect(
    run([
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
    run([
      'break-inside',
      '-break-inside-auto',
      '-break-inside-avoid',
      '-break-inside-avoid-page',
      '-break-inside-avoid-column',
    ]),
  ).toEqual('')
})

test('break-after', () => {
  expect(
    run([
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
    run([
      'break-after',
      '-break-after-auto',
      '-break-after-avoid',
      '-break-after-all',
      '-break-after-avoid-page',
      '-break-after-page',
      '-break-after-left',
      '-break-after-right',
      '-break-after-column',
    ]),
  ).toEqual('')
})

test('auto-cols', () => {
  expect(
    run(['auto-cols-auto', 'auto-cols-min', 'auto-cols-max', 'auto-cols-fr', 'auto-cols-[2fr]']),
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
  expect(run(['auto-cols', '-auto-cols-auto', '-auto-cols-[2fr]'])).toEqual('')
})

test('grid-flow', () => {
  expect(
    run([
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
    run([
      'grid-flow',
      '-grid-flow-row',
      '-grid-flow-col',
      '-grid-flow-dense',
      '-grid-flow-row-dense',
      '-grid-flow-col-dense',
    ]),
  ).toEqual('')
})

test('auto-rows', () => {
  expect(
    run(['auto-rows-auto', 'auto-rows-min', 'auto-rows-max', 'auto-rows-fr', 'auto-rows-[2fr]']),
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
  expect(run(['auto-rows', '-auto-rows-auto', '-auto-rows-[2fr]'])).toEqual('')
})

test('grid-cols', () => {
  expect(
    run(['grid-cols-none', 'grid-cols-subgrid', 'grid-cols-12', 'grid-cols-99', 'grid-cols-[123]']),
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
    run([
      'grid-cols',
      '-grid-cols-none',
      '-grid-cols-subgrid',
      '-grid-cols-12',
      '-grid-cols-[123]',
      'grid-cols-unknown',
    ]),
  ).toEqual('')
})

test('grid-rows', () => {
  expect(
    run(['grid-rows-none', 'grid-rows-subgrid', 'grid-rows-12', 'grid-rows-99', 'grid-rows-[123]']),
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
    run([
      'grid-rows',
      '-grid-rows-none',
      '-grid-rows-subgrid',
      '-grid-rows-12',
      '-grid-rows-[123]',
      'grid-rows-unknown',
    ]),
  ).toEqual('')
})

test('flex-direction', () => {
  expect(run(['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse']))
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
  expect(run(['-flex-row', '-flex-row-reverse', '-flex-col', '-flex-col-reverse'])).toEqual('')
})

test('flex-wrap', () => {
  expect(run(['flex-wrap', 'flex-wrap-reverse', 'flex-nowrap'])).toMatchInlineSnapshot(`
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
  expect(run(['-flex-wrap', '-flex-wrap-reverse', '-flex-nowrap'])).toEqual('')
})

test('place-content', () => {
  expect(
    run([
      'place-content-center',
      'place-content-start',
      'place-content-end',
      'place-content-between',
      'place-content-around',
      'place-content-evenly',
      'place-content-baseline',
      'place-content-stretch',
    ]),
  ).toMatchInlineSnapshot(`
    ".place-content-around {
      place-content: around;
    }

    .place-content-baseline {
      place-content: baseline start;
    }

    .place-content-between {
      place-content: between;
    }

    .place-content-center {
      place-content: center;
    }

    .place-content-end {
      place-content: end;
    }

    .place-content-evenly {
      place-content: evenly;
    }

    .place-content-start {
      place-content: start;
    }

    .place-content-stretch {
      place-content: stretch;
    }"
  `)
  expect(
    run([
      'place-content',
      '-place-content-center',
      '-place-content-start',
      '-place-content-end',
      '-place-content-between',
      '-place-content-around',
      '-place-content-evenly',
      '-place-content-baseline',
      '-place-content-stretch',
    ]),
  ).toEqual('')
})

test('place-items', () => {
  expect(
    run([
      'place-items-start',
      'place-items-end',
      'place-items-center',
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

    .place-items-end {
      place-items: end;
    }

    .place-items-start {
      place-items: start;
    }

    .place-items-stretch {
      place-items: stretch stretch;
    }"
  `)
  expect(
    run([
      'place-items',
      '-place-items-start',
      '-place-items-end',
      '-place-items-center',
      '-place-items-baseline',
      '-place-items-stretch',
    ]),
  ).toEqual('')
})

test('align-content', () => {
  expect(
    run([
      'content-normal',
      'content-center',
      'content-start',
      'content-end',
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

    .content-end {
      align-content: flex-end;
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
    run([
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
    ]),
  ).toEqual('')
})

test('items', () => {
  expect(run(['items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch']))
    .toMatchInlineSnapshot(`
    ".items-baseline {
      align-items: baseline;
    }

    .items-center {
      align-items: center;
    }

    .items-end {
      align-items: flex-end;
    }

    .items-start {
      align-items: flex-start;
    }

    .items-stretch {
      align-items: stretch;
    }"
  `)
  expect(
    run([
      'items',
      '-items-start',
      '-items-end',
      '-items-center',
      '-items-baseline',
      '-items-stretch',
    ]),
  ).toEqual('')
})

test('justify', () => {
  expect(
    run([
      'justify-normal',
      'justify-start',
      'justify-end',
      'justify-center',
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

    .justify-end {
      justify-content: flex-end;
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
    run([
      'justify',
      '-justify-normal',
      '-justify-start',
      '-justify-end',
      '-justify-center',
      '-justify-between',
      '-justify-around',
      '-justify-evenly',
      '-justify-stretch',
    ]),
  ).toEqual('')
})

test('justify-items', () => {
  expect(
    run([
      'justify-items-start',
      'justify-items-end',
      'justify-items-center',
      'justify-items-stretch',
    ]),
  ).toMatchInlineSnapshot(`
    ".justify-items-center {
      justify-items: center;
    }

    .justify-items-end {
      justify-items: end;
    }

    .justify-items-start {
      justify-items: start;
    }

    .justify-items-stretch {
      justify-items: stretch;
    }"
  `)
  expect(
    run([
      'justify-items',
      '-justify-items-start',
      '-justify-items-end',
      '-justify-items-center',
      '-justify-items-stretch',
    ]),
  ).toEqual('')
})

test('gap', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['gap-4', 'gap-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .gap-4 {
      gap: var(--spacing-4, 1rem);
    }

    .gap-\\[4px\\] {
      gap: 4px;
    }"
  `)
  expect(run(['gap', '-gap-4', '-gap-[4px]'])).toEqual('')
})

test('gap-x', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['gap-x-4', 'gap-x-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .gap-x-4 {
      column-gap: var(--spacing-4, 1rem);
    }

    .gap-x-\\[4px\\] {
      column-gap: 4px;
    }"
  `)
  expect(run(['gap-x', '-gap-x-4', '-gap-x-[4px]'])).toEqual('')
})

test('gap-y', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['gap-y-4', 'gap-y-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .gap-y-4 {
      row-gap: var(--spacing-4, 1rem);
    }

    .gap-y-\\[4px\\] {
      row-gap: 4px;
    }"
  `)
  expect(run(['gap-y', '-gap-y-4', '-gap-y-[4px]'])).toEqual('')
})

test('space-x', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['space-x-4', 'space-x-[4px]', '-space-x-4'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    :where(.-space-x-4 > :not(:last-child)) {
      margin-inline-start: calc(calc(var(--spacing-4, 1rem) * -1) * var(--tw-space-x-reverse));
      margin-inline-end: calc(calc(var(--spacing-4, 1rem) * -1) * calc(1 - var(--tw-space-x-reverse)));
    }

    :where(.space-x-4 > :not(:last-child)) {
      margin-inline-start: calc(var(--spacing-4, 1rem) * var(--tw-space-x-reverse));
      margin-inline-end: calc(var(--spacing-4, 1rem) * calc(1 - var(--tw-space-x-reverse)));
    }

    :where(.space-x-\\[4px\\] > :not(:last-child)) {
      margin-inline-start: calc(4px * var(--tw-space-x-reverse));
      margin-inline-end: calc(4px * calc(1 - var(--tw-space-x-reverse)));
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-space-x-reverse: 0;
        }
      }
    }

    @property --tw-space-x-reverse {
      syntax: "<number>";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(run(['space-x'])).toEqual('')
})

test('space-y', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['space-y-4', 'space-y-[4px]', '-space-y-4'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    :where(.-space-y-4 > :not(:last-child)) {
      margin-top: calc(calc(var(--spacing-4, 1rem) * -1) * var(--tw-space-y-reverse));
      margin-bottom: calc(calc(var(--spacing-4, 1rem) * -1) * calc(1 - var(--tw-space-y-reverse)));
    }

    :where(.space-y-4 > :not(:last-child)) {
      margin-top: calc(var(--spacing-4, 1rem) * var(--tw-space-y-reverse));
      margin-bottom: calc(var(--spacing-4, 1rem) * calc(1 - var(--tw-space-y-reverse)));
    }

    :where(.space-y-\\[4px\\] > :not(:last-child)) {
      margin-top: calc(4px * var(--tw-space-y-reverse));
      margin-bottom: calc(4px * calc(1 - var(--tw-space-y-reverse)));
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-space-y-reverse: 0;
        }
      }
    }

    @property --tw-space-y-reverse {
      syntax: "<number>";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(run(['space-y'])).toEqual('')
})

test('space-x-reverse', () => {
  expect(run(['space-x-reverse'])).toMatchInlineSnapshot(`
    ":where(.space-x-reverse > :not(:last-child)) {
      --tw-space-x-reverse: 1;
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-space-x-reverse: 0;
        }
      }
    }

    @property --tw-space-x-reverse {
      syntax: "<number>";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(run(['-space-x-reverse'])).toEqual('')
})

test('space-y-reverse', () => {
  expect(run(['space-y-reverse'])).toMatchInlineSnapshot(`
    ":where(.space-y-reverse > :not(:last-child)) {
      --tw-space-y-reverse: 1;
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-space-y-reverse: 0;
        }
      }
    }

    @property --tw-space-y-reverse {
      syntax: "<number>";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(run(['-space-y-reverse'])).toEqual('')
})

test('divide-x', () => {
  expect(
    compileCss(
      css`
        @tailwind utilities;
      `,
      ['divide-x', 'divide-x-4', 'divide-x-123', 'divide-x-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":where(.divide-x > :not(:last-child)) {
      border-inline-style: var(--tw-border-style);
      border-inline-start-width: calc(1px * var(--tw-divide-x-reverse));
      border-inline-end-width: calc(1px * calc(1 - var(--tw-divide-x-reverse)));
    }

    :where(.divide-x-4 > :not(:last-child)) {
      border-inline-style: var(--tw-border-style);
      border-inline-start-width: calc(4px * var(--tw-divide-x-reverse));
      border-inline-end-width: calc(4px * calc(1 - var(--tw-divide-x-reverse)));
    }

    :where(.divide-x-123 > :not(:last-child)) {
      border-inline-style: var(--tw-border-style);
      border-inline-start-width: calc(123px * var(--tw-divide-x-reverse));
      border-inline-end-width: calc(123px * calc(1 - var(--tw-divide-x-reverse)));
    }

    :where(.divide-x-\\[4px\\] > :not(:last-child)) {
      border-inline-style: var(--tw-border-style);
      border-inline-start-width: calc(4px * var(--tw-divide-x-reverse));
      border-inline-end-width: calc(4px * calc(1 - var(--tw-divide-x-reverse)));
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-divide-x-reverse: 0;
          --tw-border-style: solid;
        }
      }
    }

    @property --tw-divide-x-reverse {
      syntax: "<number>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-border-style {
      syntax: "<custom-ident>";
      inherits: false;
      initial-value: solid;
    }"
  `)
  expect(run(['-divide-x', '-divide-x-4', '-divide-x-123', 'divide-x-unknown'])).toEqual('')
})

test('divide-x with custom default border width', () => {
  expect(
    compileCss(
      css`
        @theme {
          --default-border-width: 2px;
        }
        @tailwind utilities;
      `,
      ['divide-x'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --default-border-width: 2px;
    }

    :where(.divide-x > :not(:last-child)) {
      border-inline-style: var(--tw-border-style);
      border-inline-start-width: calc(2px * var(--tw-divide-x-reverse));
      border-inline-end-width: calc(2px * calc(1 - var(--tw-divide-x-reverse)));
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-divide-x-reverse: 0;
          --tw-border-style: solid;
        }
      }
    }

    @property --tw-divide-x-reverse {
      syntax: "<number>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-border-style {
      syntax: "<custom-ident>";
      inherits: false;
      initial-value: solid;
    }"
  `)
})

test('divide-y', () => {
  expect(
    compileCss(
      css`
        @tailwind utilities;
      `,
      ['divide-y', 'divide-y-4', 'divide-y-123', 'divide-y-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":where(.divide-y > :not(:last-child)) {
      border-bottom-style: var(--tw-border-style);
      border-top-style: var(--tw-border-style);
      border-top-width: calc(1px * var(--tw-divide-y-reverse));
      border-bottom-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
    }

    :where(.divide-y-4 > :not(:last-child)) {
      border-bottom-style: var(--tw-border-style);
      border-top-style: var(--tw-border-style);
      border-top-width: calc(4px * var(--tw-divide-y-reverse));
      border-bottom-width: calc(4px * calc(1 - var(--tw-divide-y-reverse)));
    }

    :where(.divide-y-123 > :not(:last-child)) {
      border-bottom-style: var(--tw-border-style);
      border-top-style: var(--tw-border-style);
      border-top-width: calc(123px * var(--tw-divide-y-reverse));
      border-bottom-width: calc(123px * calc(1 - var(--tw-divide-y-reverse)));
    }

    :where(.divide-y-\\[4px\\] > :not(:last-child)) {
      border-bottom-style: var(--tw-border-style);
      border-top-style: var(--tw-border-style);
      border-top-width: calc(4px * var(--tw-divide-y-reverse));
      border-bottom-width: calc(4px * calc(1 - var(--tw-divide-y-reverse)));
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-divide-y-reverse: 0;
          --tw-border-style: solid;
        }
      }
    }

    @property --tw-divide-y-reverse {
      syntax: "<number>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-border-style {
      syntax: "<custom-ident>";
      inherits: false;
      initial-value: solid;
    }"
  `)
  expect(run(['-divide-y', '-divide-y-4', '-divide-y-123', 'divide-y-unknown'])).toEqual('')
})

test('divide-y with custom default border width', () => {
  expect(
    compileCss(
      css`
        @theme {
          --default-border-width: 2px;
        }
        @tailwind utilities;
      `,
      ['divide-y'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --default-border-width: 2px;
    }

    :where(.divide-y > :not(:last-child)) {
      border-bottom-style: var(--tw-border-style);
      border-top-style: var(--tw-border-style);
      border-top-width: calc(2px * var(--tw-divide-y-reverse));
      border-bottom-width: calc(2px * calc(1 - var(--tw-divide-y-reverse)));
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-divide-y-reverse: 0;
          --tw-border-style: solid;
        }
      }
    }

    @property --tw-divide-y-reverse {
      syntax: "<number>";
      inherits: false;
      initial-value: 0;
    }

    @property --tw-border-style {
      syntax: "<custom-ident>";
      inherits: false;
      initial-value: solid;
    }"
  `)
})

test('divide-x-reverse', () => {
  expect(run(['divide-x-reverse'])).toMatchInlineSnapshot(`
    ":where(.divide-x-reverse > :not(:last-child)) {
      --tw-divide-x-reverse: 1;
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-divide-x-reverse: 0;
        }
      }
    }

    @property --tw-divide-x-reverse {
      syntax: "<number>";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(run(['-divide-x-reverse'])).toEqual('')
})

test('divide-y-reverse', () => {
  expect(run(['divide-y-reverse'])).toMatchInlineSnapshot(`
    ":where(.divide-y-reverse > :not(:last-child)) {
      --tw-divide-y-reverse: 1;
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-divide-y-reverse: 0;
        }
      }
    }

    @property --tw-divide-y-reverse {
      syntax: "<number>";
      inherits: false;
      initial-value: 0;
    }"
  `)
  expect(run(['-divide-y-reverse'])).toEqual('')
})

test('divide-style', () => {
  expect(run(['divide-solid', 'divide-dashed', 'divide-dotted', 'divide-double', 'divide-none']))
    .toMatchInlineSnapshot(`
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
    run([
      'divide',
      '-divide-solid',
      '-divide-dashed',
      '-divide-dotted',
      '-divide-double',
      '-divide-none',
    ]),
  ).toEqual('')
})

test('accent', () => {
  expect(
    compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        'accent-red-500',
        'accent-red-500/50',
        'accent-red-500/[0.5]',
        'accent-red-500/[50%]',
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
    ":root {
      --color-red-500: #ef4444;
    }

    .accent-\\[\\#0088cc\\] {
      accent-color: #08c;
    }

    .accent-\\[\\#0088cc\\]\\/50, .accent-\\[\\#0088cc\\]\\/\\[0\\.5\\], .accent-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      accent-color: #0088cc80;
    }

    .accent-current {
      accent-color: currentColor;
    }

    .accent-current\\/50, .accent-current\\/\\[0\\.5\\], .accent-current\\/\\[50\\%\\] {
      accent-color: color-mix(in srgb, currentColor 50%, transparent);
    }

    .accent-inherit {
      accent-color: inherit;
    }

    .accent-red-500 {
      accent-color: var(--color-red-500, #ef4444);
    }

    .accent-red-500\\/50, .accent-red-500\\/\\[0\\.5\\], .accent-red-500\\/\\[50\\%\\] {
      accent-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    .accent-transparent {
      accent-color: #0000;
    }"
  `)
  expect(
    run([
      'accent',
      '-accent-red-500',
      '-accent-red-500/50',
      '-accent-red-500/[0.5]',
      '-accent-red-500/[50%]',
      '-accent-current',
      '-accent-current/50',
      '-accent-current/[0.5]',
      '-accent-current/[50%]',
      '-accent-inherit',
      '-accent-transparent',
      '-accent-[#0088cc]',
      '-accent-[#0088cc]/50',
      '-accent-[#0088cc]/[0.5]',
      '-accent-[#0088cc]/[50%]',
    ]),
  ).toEqual('')
})

test('caret', () => {
  expect(
    compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        'caret-red-500',
        'caret-red-500/50',
        'caret-red-500/[0.5]',
        'caret-red-500/[50%]',
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
    ":root {
      --color-red-500: #ef4444;
    }

    .caret-\\[\\#0088cc\\] {
      caret-color: #08c;
    }

    .caret-\\[\\#0088cc\\]\\/50, .caret-\\[\\#0088cc\\]\\/\\[0\\.5\\], .caret-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      caret-color: #0088cc80;
    }

    .caret-current {
      caret-color: currentColor;
    }

    .caret-current\\/50, .caret-current\\/\\[0\\.5\\], .caret-current\\/\\[50\\%\\] {
      caret-color: color-mix(in srgb, currentColor 50%, transparent);
    }

    .caret-inherit {
      caret-color: inherit;
    }

    .caret-red-500 {
      caret-color: var(--color-red-500, #ef4444);
    }

    .caret-red-500\\/50, .caret-red-500\\/\\[0\\.5\\], .caret-red-500\\/\\[50\\%\\] {
      caret-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    .caret-transparent {
      caret-color: #0000;
    }"
  `)
  expect(
    run([
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
    ]),
  ).toEqual('')
})

test('divide-color', () => {
  expect(
    compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        'divide-red-500',
        'divide-red-500/50',
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
    ":root {
      --color-red-500: #ef4444;
    }

    :where(.divide-\\[\\#0088cc\\] > :not(:last-child)) {
      border-color: #08c;
    }

    :where(.divide-\\[\\#0088cc\\]\\/50 > :not(:last-child)) {
      border-color: #0088cc80;
    }

    :where(.divide-\\[\\#0088cc\\]\\/\\[0\\.5\\] > :not(:last-child)) {
      border-color: #0088cc80;
    }

    :where(.divide-\\[\\#0088cc\\]\\/\\[50\\%\\] > :not(:last-child)) {
      border-color: #0088cc80;
    }

    :where(.divide-current > :not(:last-child)) {
      border-color: currentColor;
    }

    :where(.divide-current\\/50 > :not(:last-child)) {
      border-color: color-mix(in srgb, currentColor 50%, transparent);
    }

    :where(.divide-current\\/\\[0\\.5\\] > :not(:last-child)) {
      border-color: color-mix(in srgb, currentColor 50%, transparent);
    }

    :where(.divide-current\\/\\[50\\%\\] > :not(:last-child)) {
      border-color: color-mix(in srgb, currentColor 50%, transparent);
    }

    :where(.divide-inherit > :not(:last-child)) {
      border-color: inherit;
    }

    :where(.divide-red-500 > :not(:last-child)) {
      border-color: var(--color-red-500, #ef4444);
    }

    :where(.divide-red-500\\/50 > :not(:last-child)) {
      border-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    :where(.divide-red-500\\/\\[0\\.5\\] > :not(:last-child)) {
      border-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    :where(.divide-red-500\\/\\[50\\%\\] > :not(:last-child)) {
      border-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    :where(.divide-transparent > :not(:last-child)) {
      border-color: #0000;
    }"
  `)
  expect(
    run([
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
    ]),
  ).toEqual('')
})

test('place-self', () => {
  expect(
    run([
      'place-self-auto',
      'place-self-start',
      'place-self-end',
      'place-self-center',
      'place-self-stretch',
    ]),
  ).toMatchInlineSnapshot(`
    ".place-self-auto {
      place-self: auto;
    }

    .place-self-center {
      place-self: center;
    }

    .place-self-end {
      place-self: end;
    }

    .place-self-start {
      place-self: start;
    }

    .place-self-stretch {
      place-self: stretch stretch;
    }"
  `)
  expect(
    run([
      'place-self',
      '-place-self-auto',
      '-place-self-start',
      '-place-self-end',
      '-place-self-center',
      '-place-self-stretch',
    ]),
  ).toEqual('')
})

test('self', () => {
  expect(
    run(['self-auto', 'self-start', 'self-end', 'self-center', 'self-stretch', 'self-baseline']),
  ).toMatchInlineSnapshot(`
    ".self-auto {
      align-self: auto;
    }

    .self-baseline {
      align-self: baseline;
    }

    .self-center {
      align-self: center;
    }

    .self-end {
      align-self: flex-end;
    }

    .self-start {
      align-self: flex-start;
    }

    .self-stretch {
      align-self: stretch;
    }"
  `)
  expect(
    run([
      'self',
      '-self-auto',
      '-self-start',
      '-self-end',
      '-self-center',
      '-self-stretch',
      '-self-baseline',
    ]),
  ).toEqual('')
})

test('justify-self', () => {
  expect(
    run([
      'justify-self-auto',
      'justify-self-start',
      'justify-self-end',
      'justify-self-center',
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

    .justify-self-end {
      justify-self: flex-end;
    }

    .justify-self-start {
      justify-self: flex-start;
    }

    .justify-self-stretch {
      justify-self: stretch;
    }"
  `)
  expect(
    run([
      'justify-self',
      '-justify-self-auto',
      '-justify-self-start',
      '-justify-self-end',
      '-justify-self-center',
      '-justify-self-stretch',
      '-justify-self-baseline',
    ]),
  ).toEqual('')
})

test('overflow', () => {
  expect(
    run([
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
    run([
      'overflow',
      '-overflow-auto',
      '-overflow-hidden',
      '-overflow-clip',
      '-overflow-visible',
      '-overflow-scroll',
    ]),
  ).toEqual('')
})

test('overflow-x', () => {
  expect(
    run([
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
    run([
      'overflow-x',
      '-overflow-x-auto',
      '-overflow-x-hidden',
      '-overflow-x-clip',
      '-overflow-x-visible',
      '-overflow-x-scroll',
    ]),
  ).toEqual('')
})

test('overflow-y', () => {
  expect(
    run([
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
    run([
      'overflow-y',
      '-overflow-y-auto',
      '-overflow-y-hidden',
      '-overflow-y-clip',
      '-overflow-y-visible',
      '-overflow-y-scroll',
    ]),
  ).toEqual('')
})

test('overscroll', () => {
  expect(run(['overscroll-auto', 'overscroll-contain', 'overscroll-none'])).toMatchInlineSnapshot(`
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
    run(['overscroll', '-overscroll-auto', '-overscroll-contain', '-overscroll-none']),
  ).toEqual('')
})

test('overscroll-x', () => {
  expect(run(['overscroll-x-auto', 'overscroll-x-contain', 'overscroll-x-none']))
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
    run(['overscroll-x', '-overscroll-x-auto', '-overscroll-x-contain', '-overscroll-x-none']),
  ).toEqual('')
})

test('overscroll-y', () => {
  expect(run(['overscroll-y-auto', 'overscroll-y-contain', 'overscroll-y-none']))
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
    run(['overscroll-y', '-overscroll-y-auto', '-overscroll-y-contain', '-overscroll-y-none']),
  ).toEqual('')
})

test('scroll-behavior', () => {
  expect(run(['scroll-auto', 'scroll-smooth'])).toMatchInlineSnapshot(`
    ".scroll-auto {
      scroll-behavior: auto;
    }

    .scroll-smooth {
      scroll-behavior: smooth;
    }"
  `)
  expect(run(['scroll', '-scroll-auto', '-scroll-smooth'])).toEqual('')
})

test('truncate', () => {
  expect(run(['truncate'])).toMatchInlineSnapshot(`
    ".truncate {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }"
  `)
  expect(run(['-truncate'])).toEqual('')
})

test('text-overflow', () => {
  expect(run(['text-ellipsis', 'text-clip'])).toMatchInlineSnapshot(`
    ".text-clip {
      text-overflow: clip;
    }

    .text-ellipsis {
      text-overflow: ellipsis;
    }"
  `)
  expect(run(['-text-ellipsis', '-text-clip'])).toEqual('')
})

test('hyphens', () => {
  expect(run(['hyphens-none', 'hyphens-manual', 'hyphens-auto'])).toMatchInlineSnapshot(`
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
  expect(run(['hyphens', '-hyphens-none', '-hyphens-manual', '-hyphens-auto'])).toEqual('')
})

test('whitespace', () => {
  expect(
    run([
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
    run([
      'whitespace',
      '-whitespace-normal',
      '-whitespace-nowrap',
      '-whitespace-pre',
      '-whitespace-pre-line',
      '-whitespace-pre-wrap',
      '-whitespace-break-spaces',
    ]),
  ).toEqual('')
})

test('text-wrap', () => {
  expect(run(['text-wrap', 'text-nowrap', 'text-balance', 'text-pretty'])).toMatchInlineSnapshot(`
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
  expect(run(['-text-wrap', '-text-nowrap', '-text-balance', '-text-pretty'])).toEqual('')
})

test('overflow-wrap', () => {
  expect(run(['break-normal', 'break-words', 'break-all', 'break-keep'])).toMatchInlineSnapshot(`
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
      word-break: break-keep;
    }"
  `)
  expect(run(['-break-normal', '-break-words', '-break-all', '-break-keep'])).toEqual('')
})

test('rounded', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded {
      border-radius: .25rem;
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
      border-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run(['-rounded', '-rounded-full', '-rounded-none', '-rounded-sm', '-rounded-[4px]']),
  ).toEqual('')
})

test('rounded-s', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-s {
      border-start-start-radius: .25rem;
      border-end-start-radius: .25rem;
    }

    .rounded-s-\\[4px\\] {
      border-start-start-radius: 4px;
      border-end-start-radius: 4px;
    }

    .rounded-s-full {
      border-start-start-radius: 3.40282e38px;
      border-end-start-radius: 3.40282e38px;
    }

    .rounded-s-none {
      border-start-start-radius: 0;
      border-end-start-radius: 0;
    }

    .rounded-s-sm {
      border-start-start-radius: var(--radius-sm, .125rem);
      border-end-start-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run(['-rounded-s', '-rounded-s-full', '-rounded-s-none', '-rounded-s-sm', '-rounded-s-[4px]']),
  ).toEqual('')
})

test('rounded-e', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-e {
      border-start-end-radius: .25rem;
      border-end-end-radius: .25rem;
    }

    .rounded-e-\\[4px\\] {
      border-start-end-radius: 4px;
      border-end-end-radius: 4px;
    }

    .rounded-e-full {
      border-start-end-radius: 3.40282e38px;
      border-end-end-radius: 3.40282e38px;
    }

    .rounded-e-none {
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }

    .rounded-e-sm {
      border-start-end-radius: var(--radius-sm, .125rem);
      border-end-end-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run(['-rounded-e', '-rounded-e-full', '-rounded-e-none', '-rounded-e-sm', '-rounded-e-[4px]']),
  ).toEqual('')
})

test('rounded-t', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-t {
      border-top-left-radius: .25rem;
      border-top-right-radius: .25rem;
    }

    .rounded-t-\\[4px\\] {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    .rounded-t-full {
      border-top-left-radius: 3.40282e38px;
      border-top-right-radius: 3.40282e38px;
    }

    .rounded-t-none {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    .rounded-t-sm {
      border-top-left-radius: var(--radius-sm, .125rem);
      border-top-right-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run(['-rounded-t', '-rounded-t-full', '-rounded-t-none', '-rounded-t-sm', '-rounded-t-[4px]']),
  ).toEqual('')
})

test('rounded-r', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-r {
      border-top-right-radius: .25rem;
      border-bottom-right-radius: .25rem;
    }

    .rounded-r-\\[4px\\] {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    .rounded-r-full {
      border-top-right-radius: 3.40282e38px;
      border-bottom-right-radius: 3.40282e38px;
    }

    .rounded-r-none {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .rounded-r-sm {
      border-top-right-radius: var(--radius-sm, .125rem);
      border-bottom-right-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run(['-rounded-r', '-rounded-r-full', '-rounded-r-none', '-rounded-r-sm', '-rounded-r-[4px]']),
  ).toEqual('')
})

test('rounded-b', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-b {
      border-bottom-right-radius: .25rem;
      border-bottom-left-radius: .25rem;
    }

    .rounded-b-\\[4px\\] {
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .rounded-b-full {
      border-bottom-right-radius: 3.40282e38px;
      border-bottom-left-radius: 3.40282e38px;
    }

    .rounded-b-none {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }

    .rounded-b-sm {
      border-bottom-right-radius: var(--radius-sm, .125rem);
      border-bottom-left-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run(['-rounded-b', '-rounded-b-full', '-rounded-b-none', '-rounded-b-sm', '-rounded-b-[4px]']),
  ).toEqual('')
})

test('rounded-l', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-l {
      border-top-left-radius: .25rem;
      border-bottom-left-radius: .25rem;
    }

    .rounded-l-\\[4px\\] {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .rounded-l-full {
      border-top-left-radius: 3.40282e38px;
      border-bottom-left-radius: 3.40282e38px;
    }

    .rounded-l-none {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .rounded-l-sm {
      border-top-left-radius: var(--radius-sm, .125rem);
      border-bottom-left-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run(['-rounded-l', '-rounded-l-full', '-rounded-l-none', '-rounded-l-sm', '-rounded-l-[4px]']),
  ).toEqual('')
})

test('rounded-ss', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-ss {
      border-start-start-radius: .25rem;
    }

    .rounded-ss-\\[4px\\] {
      border-start-start-radius: 4px;
    }

    .rounded-ss-full {
      border-start-start-radius: 3.40282e38px;
    }

    .rounded-ss-none {
      border-start-start-radius: 0;
    }

    .rounded-ss-sm {
      border-start-start-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run([
      '-rounded-ss',
      '-rounded-ss-full',
      '-rounded-ss-none',
      '-rounded-ss-sm',
      '-rounded-ss-[4px]',
    ]),
  ).toEqual('')
})

test('rounded-se', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-se {
      border-start-end-radius: .25rem;
    }

    .rounded-se-\\[4px\\] {
      border-start-end-radius: 4px;
    }

    .rounded-se-full {
      border-start-end-radius: 3.40282e38px;
    }

    .rounded-se-none {
      border-start-end-radius: 0;
    }

    .rounded-se-sm {
      border-start-end-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run([
      '-rounded-se',
      '-rounded-se-full',
      '-rounded-se-none',
      '-rounded-se-sm',
      '-rounded-se-[4px]',
    ]),
  ).toEqual('')
})

test('rounded-ee', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-ee {
      border-end-end-radius: .25rem;
    }

    .rounded-ee-\\[4px\\] {
      border-end-end-radius: 4px;
    }

    .rounded-ee-full {
      border-end-end-radius: 3.40282e38px;
    }

    .rounded-ee-none {
      border-end-end-radius: 0;
    }

    .rounded-ee-sm {
      border-end-end-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run([
      '-rounded-ee',
      '-rounded-ee-full',
      '-rounded-ee-none',
      '-rounded-ee-sm',
      '-rounded-ee-[4px]',
    ]),
  ).toEqual('')
})

test('rounded-es', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-es {
      border-end-start-radius: .25rem;
    }

    .rounded-es-\\[4px\\] {
      border-end-start-radius: 4px;
    }

    .rounded-es-full {
      border-end-start-radius: 3.40282e38px;
    }

    .rounded-es-none {
      border-end-start-radius: 0;
    }

    .rounded-es-sm {
      border-end-start-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run([
      '-rounded-es',
      '-rounded-es-full',
      '-rounded-es-none',
      '-rounded-es-sm',
      '-rounded-es-[4px]',
    ]),
  ).toEqual('')
})

test('rounded-tl', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-tl {
      border-top-left-radius: .25rem;
    }

    .rounded-tl-\\[4px\\] {
      border-top-left-radius: 4px;
    }

    .rounded-tl-full {
      border-top-left-radius: 3.40282e38px;
    }

    .rounded-tl-none {
      border-top-left-radius: 0;
    }

    .rounded-tl-sm {
      border-top-left-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run([
      '-rounded-tl',
      '-rounded-tl-full',
      '-rounded-tl-none',
      '-rounded-tl-sm',
      '-rounded-tl-[4px]',
    ]),
  ).toEqual('')
})

test('rounded-tr', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-tr {
      border-top-right-radius: .25rem;
    }

    .rounded-tr-\\[4px\\] {
      border-top-right-radius: 4px;
    }

    .rounded-tr-full {
      border-top-right-radius: 3.40282e38px;
    }

    .rounded-tr-none {
      border-top-right-radius: 0;
    }

    .rounded-tr-sm {
      border-top-right-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run([
      '-rounded-tr',
      '-rounded-tr-full',
      '-rounded-tr-none',
      '-rounded-tr-sm',
      '-rounded-tr-[4px]',
    ]),
  ).toEqual('')
})

test('rounded-br', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-br {
      border-bottom-right-radius: .25rem;
    }

    .rounded-br-\\[4px\\] {
      border-bottom-right-radius: 4px;
    }

    .rounded-br-full {
      border-bottom-right-radius: 3.40282e38px;
    }

    .rounded-br-none {
      border-bottom-right-radius: 0;
    }

    .rounded-br-sm {
      border-bottom-right-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run([
      '-rounded-br',
      '-rounded-br-full',
      '-rounded-br-none',
      '-rounded-br-sm',
      '-rounded-br-[4px]',
    ]),
  ).toEqual('')
})

test('rounded-bl', () => {
  expect(
    compileCss(
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
    ":root {
      --radius-none: 0px;
      --radius-full: 9999px;
      --radius-sm: .125rem;
      --radius: .25rem;
    }

    .rounded-bl {
      border-bottom-left-radius: .25rem;
    }

    .rounded-bl-\\[4px\\] {
      border-bottom-left-radius: 4px;
    }

    .rounded-bl-full {
      border-bottom-left-radius: 3.40282e38px;
    }

    .rounded-bl-none {
      border-bottom-left-radius: 0;
    }

    .rounded-bl-sm {
      border-bottom-left-radius: var(--radius-sm, .125rem);
    }"
  `)
  expect(
    run([
      '-rounded-bl',
      '-rounded-bl-full',
      '-rounded-bl-none',
      '-rounded-bl-sm',
      '-rounded-bl-[4px]',
    ]),
  ).toEqual('')
})

test('border-style', () => {
  expect(
    run([
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
    run([
      '-border-solid',
      '-border-dashed',
      '-border-dotted',
      '-border-double',
      '-border-hidden',
      '-border-none',
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
  test(`${prefix}-*`, () => {
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
    classes.push(`${prefix}-[length:--my-width]`)
    classes.push(`${prefix}-[line-width:--my-width]`)

    // Color
    classes.push(`${prefix}-red-500`)
    classes.push(`${prefix}-red-500/50`)
    classes.push(`${prefix}-[#0088cc]`)
    classes.push(`${prefix}-[#0088cc]/50`)
    classes.push(`${prefix}-current`)
    classes.push(`${prefix}-current/50`)
    classes.push(`${prefix}-inherit`)
    classes.push(`${prefix}-transparent`)

    // Inference: Color
    classes.push(`${prefix}-[--my-color]`)
    classes.push(`${prefix}-[--my-color]/50`)
    classes.push(`${prefix}-[color:--my-color]`)
    classes.push(`${prefix}-[color:--my-color]/50`)

    expect(
      compileCss(
        css`
          @theme {
            --radius-none: 0px;
            --radius-full: 9999px;
            --radius-sm: 0.125rem;
            --color-red-500: #ef4444;
          }
          @tailwind utilities;
        `,
        classes,
      ),
    ).toMatchSnapshot()

    // No border utilities can ever be negative
    expect(run(classes.map((cls) => `-${cls}`))).toEqual('')
  })
}

test('border with custom default border width', () => {
  expect(
    compileCss(
      css`
        @theme {
          --default-border-width: 2px;
        }
        @tailwind utilities;
      `,
      ['border'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --default-border-width: 2px;
    }

    .border {
      border-style: var(--tw-border-style);
      border-width: 2px;
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-border-style: solid;
        }
      }
    }

    @property --tw-border-style {
      syntax: "<custom-ident>";
      inherits: false;
      initial-value: solid;
    }"
  `)
})

test('bg', () => {
  expect(
    compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        // background-color
        'bg-red-500',
        'bg-red-500/50',
        'bg-red-500/[0.5]',
        'bg-red-500/[50%]',
        'bg-current',
        'bg-current/50',
        'bg-current/[0.5]',
        'bg-current/[50%]',
        'bg-inherit',
        'bg-transparent',
        'bg-[#0088cc]',
        'bg-[#0088cc]/50',
        'bg-[#0088cc]/[0.5]',
        'bg-[#0088cc]/[50%]',
        'bg-[--some-var]',
        'bg-[--some-var]/50',
        'bg-[--some-var]/[0.5]',
        'bg-[--some-var]/[50%]',
        'bg-[color:--some-var]',
        'bg-[color:--some-var]/50',
        'bg-[color:--some-var]/[0.5]',
        'bg-[color:--some-var]/[50%]',

        // background-image
        'bg-none',

        // Legacy linear-gradient API
        'bg-gradient-to-t',
        'bg-gradient-to-tr',
        'bg-gradient-to-r',
        'bg-gradient-to-br',
        'bg-gradient-to-b',
        'bg-gradient-to-bl',
        'bg-gradient-to-l',
        'bg-gradient-to-tl',

        // Modern linear-gradient API
        'bg-linear-to-t',
        'bg-linear-to-tr',
        'bg-linear-to-r',
        'bg-linear-to-br',
        'bg-linear-to-b',
        'bg-linear-to-bl',
        'bg-linear-to-l',
        'bg-linear-to-tl',

        'bg-[url(/image.png)]',
        'bg-[url:--my-url]',
        'bg-[linear-gradient(to_bottom,red,blue)]',
        'bg-[image:--my-gradient]',
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
        'bg-center',
        'bg-top',
        'bg-right-top',
        'bg-right-bottom',
        'bg-bottom',
        'bg-left-bottom',
        'bg-left',
        'bg-left-top',
        'bg-[50%]',
        'bg-[120px]',
        'bg-[120px_120px]',
        'bg-[length:120px_120px]',
        'bg-[position:120px_120px]',
        'bg-[size:120px_120px]',

        // background-repeat
        'bg-repeat',
        'bg-no-repeat',
        'bg-repeat-x',
        'bg-repeat-y',
        'bg-round',
        'bg-space',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --color-red-500: #ef4444;
    }

    .bg-\\[\\#0088cc\\] {
      background-color: #08c;
    }

    .bg-\\[\\#0088cc\\]\\/50, .bg-\\[\\#0088cc\\]\\/\\[0\\.5\\], .bg-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      background-color: #0088cc80;
    }

    .bg-\\[--some-var\\] {
      background-color: var(--some-var);
    }

    .bg-\\[--some-var\\]\\/50, .bg-\\[--some-var\\]\\/\\[0\\.5\\], .bg-\\[--some-var\\]\\/\\[50\\%\\] {
      background-color: color-mix(in srgb, var(--some-var) 50%, transparent);
    }

    .bg-\\[color\\:--some-var\\] {
      background-color: var(--some-var);
    }

    .bg-\\[color\\:--some-var\\]\\/50, .bg-\\[color\\:--some-var\\]\\/\\[0\\.5\\], .bg-\\[color\\:--some-var\\]\\/\\[50\\%\\] {
      background-color: color-mix(in srgb, var(--some-var) 50%, transparent);
    }

    .bg-current {
      background-color: currentColor;
    }

    .bg-current\\/50, .bg-current\\/\\[0\\.5\\], .bg-current\\/\\[50\\%\\] {
      background-color: color-mix(in srgb, currentColor 50%, transparent);
    }

    .bg-inherit {
      background-color: inherit;
    }

    .bg-red-500 {
      background-color: var(--color-red-500, #ef4444);
    }

    .bg-red-500\\/50, .bg-red-500\\/\\[0\\.5\\], .bg-red-500\\/\\[50\\%\\] {
      background-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    .bg-transparent {
      background-color: #0000;
    }

    .-bg-linear-\\[1\\.3rad\\] {
      background-image: linear-gradient(calc(74.4845deg * -1), var(--tw-gradient-stops, ));
    }

    .-bg-linear-\\[125deg\\] {
      background-image: linear-gradient(calc(125deg * -1), var(--tw-gradient-stops, ));
    }

    .bg-\\[image\\:--my-gradient\\] {
      background-image: var(--my-gradient);
    }

    .bg-\\[linear-gradient\\(to_bottom\\,red\\,blue\\)\\] {
      background-image: linear-gradient(red, #00f);
    }

    .bg-\\[url\\(\\/image\\.png\\)\\] {
      background-image: url("/image.png");
    }

    .bg-\\[url\\:--my-url\\] {
      background-image: var(--my-url);
    }

    .bg-gradient-to-b {
      background-image: linear-gradient(to bottom, var(--tw-gradient-stops, ));
    }

    .bg-gradient-to-bl {
      background-image: linear-gradient(to bottom left, var(--tw-gradient-stops, ));
    }

    .bg-gradient-to-br {
      background-image: linear-gradient(to bottom right, var(--tw-gradient-stops, ));
    }

    .bg-gradient-to-l {
      background-image: linear-gradient(to left, var(--tw-gradient-stops, ));
    }

    .bg-gradient-to-r {
      background-image: linear-gradient(to right, var(--tw-gradient-stops, ));
    }

    .bg-gradient-to-t {
      background-image: linear-gradient(to top, var(--tw-gradient-stops, ));
    }

    .bg-gradient-to-tl {
      background-image: linear-gradient(to top left, var(--tw-gradient-stops, ));
    }

    .bg-gradient-to-tr {
      background-image: linear-gradient(to top right, var(--tw-gradient-stops, ));
    }

    .bg-linear-\\[1\\.3rad\\] {
      background-image: linear-gradient(74.4845deg, var(--tw-gradient-stops, ));
    }

    .bg-linear-\\[125deg\\] {
      background-image: linear-gradient(125deg, var(--tw-gradient-stops, ));
    }

    .bg-linear-\\[to_bottom\\], .bg-linear-to-b {
      background-image: linear-gradient(to bottom, var(--tw-gradient-stops, ));
    }

    .bg-linear-to-bl {
      background-image: linear-gradient(to bottom left, var(--tw-gradient-stops, ));
    }

    .bg-linear-to-br {
      background-image: linear-gradient(to bottom right, var(--tw-gradient-stops, ));
    }

    .bg-linear-to-l {
      background-image: linear-gradient(to left, var(--tw-gradient-stops, ));
    }

    .bg-linear-to-r {
      background-image: linear-gradient(to right, var(--tw-gradient-stops, ));
    }

    .bg-linear-to-t {
      background-image: linear-gradient(to top, var(--tw-gradient-stops, ));
    }

    .bg-linear-to-tl {
      background-image: linear-gradient(to top left, var(--tw-gradient-stops, ));
    }

    .bg-linear-to-tr {
      background-image: linear-gradient(to top right, var(--tw-gradient-stops, ));
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

    .bg-right-bottom {
      background-position: 100% 100%;
    }

    .bg-right-top {
      background-position: 100% 0;
    }

    .bg-top {
      background-position: top;
    }

    .bg-no-repeat {
      background-repeat: no-repeat;
    }

    .bg-repeat {
      background-repeat: repeat;
    }

    .bg-repeat-x {
      background-repeat: repeat-x;
    }

    .bg-repeat-y {
      background-repeat: repeat-y;
    }

    .bg-round {
      background-repeat: round;
    }

    .bg-space {
      background-repeat: space;
    }"
  `)
  expect(
    run([
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
    ]),
  ).toEqual('')

  expect(
    compileCss(
      css`
        @theme {
          --opacity-half: 0.5;
          --opacity-custom: var(--custom-opacity);
        }
        @tailwind utilities;
      `,
      ['bg-current/half', 'bg-current/custom'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --opacity-half: .5;
      --opacity-custom: var(--custom-opacity);
    }

    .bg-current\\/custom {
      background-color: color-mix(in srgb, currentColor var(--opacity-custom, var(--custom-opacity)), transparent);
    }

    .bg-current\\/half {
      background-color: color-mix(in srgb, currentColor var(--opacity-half, .5), transparent);
    }"
  `)
})

test('from', () => {
  expect(
    compileCss(
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
        'from-[--my-color]',
        'from-[--my-color]/50',
        'from-[--my-color]/[0.5]',
        'from-[--my-color]/[50%]',
        'from-[color:--my-color]',
        'from-[color:--my-color]/50',
        'from-[color:--my-color]/[0.5]',
        'from-[color:--my-color]/[50%]',

        // --tw-gradient-from-position
        'from-0%',
        'from-5%',
        'from-100%',
        'from-[50%]',
        'from-[50px]',
        'from-[length:--my-position]',
        'from-[percentage:--my-position]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --color-red-500: #ef4444;
    }

    .from-\\[\\#0088cc\\] {
      --tw-gradient-from: #08c;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-\\[\\#0088cc\\]\\/50, .from-\\[\\#0088cc\\]\\/\\[0\\.5\\], .from-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-gradient-from: #0088cc80;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-\\[--my-color\\] {
      --tw-gradient-from: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-\\[--my-color\\]\\/50, .from-\\[--my-color\\]\\/\\[0\\.5\\], .from-\\[--my-color\\]\\/\\[50\\%\\] {
      --tw-gradient-from: color-mix(in srgb, var(--my-color) 50%, transparent);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-\\[color\\:--my-color\\] {
      --tw-gradient-from: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-\\[color\\:--my-color\\]\\/50, .from-\\[color\\:--my-color\\]\\/\\[0\\.5\\], .from-\\[color\\:--my-color\\]\\/\\[50\\%\\] {
      --tw-gradient-from: color-mix(in srgb, var(--my-color) 50%, transparent);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-current {
      --tw-gradient-from: currentColor;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-current\\/50, .from-current\\/\\[0\\.5\\], .from-current\\/\\[50\\%\\] {
      --tw-gradient-from: color-mix(in srgb, currentColor 50%, transparent);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-inherit {
      --tw-gradient-from: inherit;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-red-500 {
      --tw-gradient-from: var(--color-red-500, #ef4444);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-red-500\\/50, .from-red-500\\/\\[0\\.5\\], .from-red-500\\/\\[50\\%\\] {
      --tw-gradient-from: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .from-transparent {
      --tw-gradient-from: transparent;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
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

    .from-\\[length\\:--my-position\\], .from-\\[percentage\\:--my-position\\] {
      --tw-gradient-from-position: var(--my-position);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-gradient-from: #0000;
          --tw-gradient-to: #0000;
          --tw-gradient-via: transparent;
          --tw-gradient-stops: ;
          --tw-gradient-via-stops: ;
          --tw-gradient-from-position: 0%;
          --tw-gradient-via-position: 50%;
          --tw-gradient-to-position: 100%;
        }
      }
    }

    @property --tw-gradient-from {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-to {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-via {
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
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-gradient-via-position {
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 50%;
    }

    @property --tw-gradient-to-position {
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 100%;
    }"
  `)
  expect(
    run([
      'from',
      'from-123',
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

test('via', () => {
  expect(
    compileCss(
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
        'via-[--my-color]',
        'via-[--my-color]/50',
        'via-[--my-color]/[0.5]',
        'via-[--my-color]/[50%]',
        'via-[color:--my-color]',
        'via-[color:--my-color]/50',
        'via-[color:--my-color]/[0.5]',
        'via-[color:--my-color]/[50%]',

        // --tw-gradient-via-position
        'via-0%',
        'via-5%',
        'via-100%',
        'via-[50%]',
        'via-[50px]',
        'via-[length:--my-position]',
        'via-[percentage:--my-position]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --color-red-500: #ef4444;
    }

    .via-\\[\\#0088cc\\] {
      --tw-gradient-via: #08c;
      --tw-gradient-via-stops: var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-\\[\\#0088cc\\]\\/50, .via-\\[\\#0088cc\\]\\/\\[0\\.5\\], .via-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-gradient-via: #0088cc80;
      --tw-gradient-via-stops: var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-\\[--my-color\\] {
      --tw-gradient-via: var(--my-color);
      --tw-gradient-via-stops: var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-\\[--my-color\\]\\/50, .via-\\[--my-color\\]\\/\\[0\\.5\\], .via-\\[--my-color\\]\\/\\[50\\%\\] {
      --tw-gradient-via: color-mix(in srgb, var(--my-color) 50%, transparent);
      --tw-gradient-via-stops: var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-\\[color\\:--my-color\\] {
      --tw-gradient-via: var(--my-color);
      --tw-gradient-via-stops: var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-\\[color\\:--my-color\\]\\/50, .via-\\[color\\:--my-color\\]\\/\\[0\\.5\\], .via-\\[color\\:--my-color\\]\\/\\[50\\%\\] {
      --tw-gradient-via: color-mix(in srgb, var(--my-color) 50%, transparent);
      --tw-gradient-via-stops: var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-current {
      --tw-gradient-via: currentColor;
      --tw-gradient-via-stops: var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-current\\/50, .via-current\\/\\[0\\.5\\], .via-current\\/\\[50\\%\\] {
      --tw-gradient-via: color-mix(in srgb, currentColor 50%, transparent);
      --tw-gradient-via-stops: var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-inherit {
      --tw-gradient-via: inherit;
      --tw-gradient-via-stops: var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-red-500 {
      --tw-gradient-via: var(--color-red-500, #ef4444);
      --tw-gradient-via-stops: var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-red-500\\/50, .via-red-500\\/\\[0\\.5\\], .via-red-500\\/\\[50\\%\\] {
      --tw-gradient-via: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
      --tw-gradient-via-stops: var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
      --tw-gradient-stops: var(--tw-gradient-via-stops);
    }

    .via-transparent {
      --tw-gradient-via: transparent;
      --tw-gradient-via-stops: var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
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

    .via-\\[length\\:--my-position\\], .via-\\[percentage\\:--my-position\\] {
      --tw-gradient-via-position: var(--my-position);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-gradient-from: #0000;
          --tw-gradient-to: #0000;
          --tw-gradient-via: transparent;
          --tw-gradient-stops: ;
          --tw-gradient-via-stops: ;
          --tw-gradient-from-position: 0%;
          --tw-gradient-via-position: 50%;
          --tw-gradient-to-position: 100%;
        }
      }
    }

    @property --tw-gradient-from {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-to {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-via {
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
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-gradient-via-position {
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 50%;
    }

    @property --tw-gradient-to-position {
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 100%;
    }"
  `)
  expect(
    run([
      'via',
      'via-123',
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

test('to', () => {
  expect(
    compileCss(
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
        'to-[--my-color]',
        'to-[--my-color]/50',
        'to-[--my-color]/[0.5]',
        'to-[--my-color]/[50%]',
        'to-[color:--my-color]',
        'to-[color:--my-color]/50',
        'to-[color:--my-color]/[0.5]',
        'to-[color:--my-color]/[50%]',

        // --tw-gradient-to-position
        'to-0%',
        'to-5%',
        'to-100%',
        'to-[50%]',
        'to-[50px]',
        'to-[length:--my-position]',
        'to-[percentage:--my-position]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --color-red-500: #ef4444;
    }

    .to-\\[\\#0088cc\\] {
      --tw-gradient-to: #08c;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-\\[\\#0088cc\\]\\/50, .to-\\[\\#0088cc\\]\\/\\[0\\.5\\], .to-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-gradient-to: #0088cc80;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-\\[--my-color\\] {
      --tw-gradient-to: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-\\[--my-color\\]\\/50, .to-\\[--my-color\\]\\/\\[0\\.5\\], .to-\\[--my-color\\]\\/\\[50\\%\\] {
      --tw-gradient-to: color-mix(in srgb, var(--my-color) 50%, transparent);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-\\[color\\:--my-color\\] {
      --tw-gradient-to: var(--my-color);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-\\[color\\:--my-color\\]\\/50, .to-\\[color\\:--my-color\\]\\/\\[0\\.5\\], .to-\\[color\\:--my-color\\]\\/\\[50\\%\\] {
      --tw-gradient-to: color-mix(in srgb, var(--my-color) 50%, transparent);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-current {
      --tw-gradient-to: currentColor;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-current\\/50, .to-current\\/\\[0\\.5\\], .to-current\\/\\[50\\%\\] {
      --tw-gradient-to: color-mix(in srgb, currentColor 50%, transparent);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-inherit {
      --tw-gradient-to: inherit;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-red-500 {
      --tw-gradient-to: var(--color-red-500, #ef4444);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-red-500\\/50, .to-red-500\\/\\[0\\.5\\], .to-red-500\\/\\[50\\%\\] {
      --tw-gradient-to: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
    }

    .to-transparent {
      --tw-gradient-to: transparent;
      --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
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

    .to-\\[length\\:--my-position\\], .to-\\[percentage\\:--my-position\\] {
      --tw-gradient-to-position: var(--my-position);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-gradient-from: #0000;
          --tw-gradient-to: #0000;
          --tw-gradient-via: transparent;
          --tw-gradient-stops: ;
          --tw-gradient-via-stops: ;
          --tw-gradient-from-position: 0%;
          --tw-gradient-via-position: 50%;
          --tw-gradient-to-position: 100%;
        }
      }
    }

    @property --tw-gradient-from {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-to {
      syntax: "<color>";
      inherits: false;
      initial-value: #0000;
    }

    @property --tw-gradient-via {
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
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 0%;
    }

    @property --tw-gradient-via-position {
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 50%;
    }

    @property --tw-gradient-to-position {
      syntax: "<length> | <percentage>";
      inherits: false;
      initial-value: 100%;
    }"
  `)
  expect(
    run([
      'to',
      'to-123',
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

test('box-decoration', () => {
  expect(run(['box-decoration-slice', 'box-decoration-clone'])).toMatchInlineSnapshot(`
    ".box-decoration-clone {
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
    }

    .box-decoration-slice {
      -webkit-box-decoration-break: slice;
      box-decoration-break: slice;
    }"
  `)
  expect(run(['box', 'box-decoration', '-box-decoration-slice', '-box-decoration-clone'])).toEqual(
    '',
  )
})

test('bg-clip', () => {
  expect(run(['bg-clip-border', 'bg-clip-padding', 'bg-clip-content', 'bg-clip-text']))
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
      background-clip: text;
    }"
  `)
  expect(
    run(['bg-clip', '-bg-clip-border', '-bg-clip-padding', '-bg-clip-content', '-bg-clip-text']),
  ).toEqual('')
})

test('bg-origin', () => {
  expect(run(['bg-origin-border', 'bg-origin-padding', 'bg-origin-content']))
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
    run(['bg-origin', '-bg-origin-border', '-bg-origin-padding', '-bg-origin-content']),
  ).toEqual('')
})

test('bg-blend', () => {
  expect(
    run([
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
    run([
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
    ]),
  ).toEqual('')
})

test('mix-blend', () => {
  expect(
    run([
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
    run([
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
    ]),
  ).toEqual('')
})

test('fill', () => {
  expect(
    compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        'fill-red-500',
        'fill-red-500/50',
        'fill-red-500/[0.5]',
        'fill-red-500/[50%]',
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
    ":root {
      --color-red-500: #ef4444;
    }

    .fill-\\[\\#0088cc\\] {
      fill: #08c;
    }

    .fill-\\[\\#0088cc\\]\\/50, .fill-\\[\\#0088cc\\]\\/\\[0\\.5\\], .fill-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      fill: #0088cc80;
    }

    .fill-current {
      fill: currentColor;
    }

    .fill-current\\/50, .fill-current\\/\\[0\\.5\\], .fill-current\\/\\[50\\%\\] {
      fill: color-mix(in srgb, currentColor 50%, transparent);
    }

    .fill-inherit {
      fill: inherit;
    }

    .fill-red-500 {
      fill: var(--color-red-500, #ef4444);
    }

    .fill-red-500\\/50, .fill-red-500\\/\\[0\\.5\\], .fill-red-500\\/\\[50\\%\\] {
      fill: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    .fill-transparent {
      fill: #0000;
    }"
  `)
  expect(
    run([
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

test('stroke', () => {
  expect(
    compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        // Color
        'stroke-red-500',
        'stroke-red-500/50',
        'stroke-red-500/[0.5]',
        'stroke-red-500/[50%]',
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
        'stroke-[--my-color]',
        'stroke-[--my-color]/50',
        'stroke-[--my-color]/[0.5]',
        'stroke-[--my-color]/[50%]',
        'stroke-[color:--my-color]',
        'stroke-[color:--my-color]/50',
        'stroke-[color:--my-color]/[0.5]',
        'stroke-[color:--my-color]/[50%]',
        'stroke-none',

        // Width
        'stroke-0',
        'stroke-1',
        'stroke-2',
        'stroke-[1.5]',
        'stroke-[12px]',
        'stroke-[50%]',
        'stroke-[number:--my-width]',
        'stroke-[length:--my-width]',
        'stroke-[percentage:--my-width]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --color-red-500: #ef4444;
    }

    .stroke-\\[\\#0088cc\\] {
      stroke: #08c;
    }

    .stroke-\\[\\#0088cc\\]\\/50, .stroke-\\[\\#0088cc\\]\\/\\[0\\.5\\], .stroke-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      stroke: #0088cc80;
    }

    .stroke-\\[--my-color\\] {
      stroke: var(--my-color);
    }

    .stroke-\\[--my-color\\]\\/50, .stroke-\\[--my-color\\]\\/\\[0\\.5\\], .stroke-\\[--my-color\\]\\/\\[50\\%\\] {
      stroke: color-mix(in srgb, var(--my-color) 50%, transparent);
    }

    .stroke-\\[color\\:--my-color\\] {
      stroke: var(--my-color);
    }

    .stroke-\\[color\\:--my-color\\]\\/50, .stroke-\\[color\\:--my-color\\]\\/\\[0\\.5\\], .stroke-\\[color\\:--my-color\\]\\/\\[50\\%\\] {
      stroke: color-mix(in srgb, var(--my-color) 50%, transparent);
    }

    .stroke-current {
      stroke: currentColor;
    }

    .stroke-current\\/50, .stroke-current\\/\\[0\\.5\\], .stroke-current\\/\\[50\\%\\] {
      stroke: color-mix(in srgb, currentColor 50%, transparent);
    }

    .stroke-inherit {
      stroke: inherit;
    }

    .stroke-none {
      stroke: none;
    }

    .stroke-red-500 {
      stroke: var(--color-red-500, #ef4444);
    }

    .stroke-red-500\\/50, .stroke-red-500\\/\\[0\\.5\\], .stroke-red-500\\/\\[50\\%\\] {
      stroke: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
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

    .stroke-\\[length\\:--my-width\\], .stroke-\\[number\\:--my-width\\], .stroke-\\[percentage\\:--my-width\\] {
      stroke-width: var(--my-width);
    }"
  `)
  expect(
    run([
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
    ]),
  ).toEqual('')
})

test('object', () => {
  expect(
    run([
      // object-fit
      'object-contain',
      'object-cover',
      'object-fill',
      'object-none',
      'object-scale-down',

      // object-position
      'object-[--value]',
      'object-bottom',
      'object-center',
      'object-left',
      'object-left-bottom',
      'object-left-top',
      'object-right',
      'object-right-bottom',
      'object-right-top',
      'object-top',
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

    .object-\\[--value\\] {
      object-position: var(--value);
    }

    .object-bottom {
      object-position: bottom;
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
    }"
  `)
  expect(
    run([
      'object',
      // object-fit
      '-object-contain',
      '-object-cover',
      '-object-fill',
      '-object-none',
      '-object-scale-down',

      // object-position
      '-object-[--value]',
      '-object-bottom',
    ]),
  ).toEqual('')
})

test('p', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['p-4', 'p-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .p-4 {
      padding: var(--spacing-4, 1rem);
    }

    .p-\\[4px\\] {
      padding: 4px;
    }"
  `)
  expect(run(['p', '-p-4', '-p-[4px]'])).toEqual('')
})

test('px', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['px-4', 'px-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .px-4 {
      padding-left: var(--spacing-4, 1rem);
      padding-right: var(--spacing-4, 1rem);
    }

    .px-\\[4px\\] {
      padding-left: 4px;
      padding-right: 4px;
    }"
  `)
  expect(run(['px', '-px-4', '-px-[4px]'])).toEqual('')
})

test('py', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['py-4', 'py-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .py-4 {
      padding-top: var(--spacing-4, 1rem);
      padding-bottom: var(--spacing-4, 1rem);
    }

    .py-\\[4px\\] {
      padding-top: 4px;
      padding-bottom: 4px;
    }"
  `)
  expect(run(['py', '-py-4', '-py-[4px]'])).toEqual('')
})

test('pt', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['pt-4', 'pt-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .pt-4 {
      padding-top: var(--spacing-4, 1rem);
    }

    .pt-\\[4px\\] {
      padding-top: 4px;
    }"
  `)
  expect(run(['pt', '-pt-4', '-pt-[4px]'])).toEqual('')
})

test('ps', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['ps-4', 'ps-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .ps-4 {
      padding-inline-start: var(--spacing-4, 1rem);
    }

    .ps-\\[4px\\] {
      padding-inline-start: 4px;
    }"
  `)
  expect(run(['ps', '-ps-4', '-ps-[4px]'])).toEqual('')
})

test('pe', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['pe-4', 'pe-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .pe-4 {
      padding-inline-end: var(--spacing-4, 1rem);
    }

    .pe-\\[4px\\] {
      padding-inline-end: 4px;
    }"
  `)
  expect(run(['pe', '-pe-4', '-pe-[4px]'])).toEqual('')
})

test('pr', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['pr-4', 'pr-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .pr-4 {
      padding-right: var(--spacing-4, 1rem);
    }

    .pr-\\[4px\\] {
      padding-right: 4px;
    }"
  `)
  expect(run(['pr', '-pr-4', '-pr-[4px]'])).toEqual('')
})

test('pb', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['pb-4', 'pb-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .pb-4 {
      padding-bottom: var(--spacing-4, 1rem);
    }

    .pb-\\[4px\\] {
      padding-bottom: 4px;
    }"
  `)
  expect(run(['pb', '-pb-4', '-pb-[4px]'])).toEqual('')
})

test('pl', () => {
  expect(
    compileCss(
      css`
        @theme {
          --spacing-4: 1rem;
        }
        @tailwind utilities;
      `,
      ['pl-4', 'pl-[4px]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --spacing-4: 1rem;
    }

    .pl-4 {
      padding-left: var(--spacing-4, 1rem);
    }

    .pl-\\[4px\\] {
      padding-left: 4px;
    }"
  `)
  expect(run(['pl', '-pl-4', '-pl-[4px]'])).toEqual('')
})

test('text-align', () => {
  expect(run(['text-left', 'text-center', 'text-right', 'text-justify', 'text-start', 'text-end']))
    .toMatchInlineSnapshot(`
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
    run(['-text-left', '-text-center', '-text-right', '-text-justify', '-text-start', '-text-end']),
  ).toEqual('')
})

test('indent', () => {
  expect(run(['indent-[4px]', '-indent-[4px]'])).toMatchInlineSnapshot(`
    ".-indent-\\[4px\\] {
      text-indent: -4px;
    }

    .indent-\\[4px\\] {
      text-indent: 4px;
    }"
  `)
  expect(run(['indent'])).toEqual('')
})

test('align', () => {
  expect(
    run([
      'align-baseline',
      'align-top',
      'align-middle',
      'align-bottom',
      'align-text-top',
      'align-text-bottom',
      'align-sub',
      'align-super',

      'align-[--value]',
    ]),
  ).toMatchInlineSnapshot(`
    ".align-\\[--value\\] {
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
    run([
      'align',
      '-align-baseline',
      '-align-top',
      '-align-middle',
      '-align-bottom',
      '-align-text-top',
      '-align-text-bottom',
      '-align-sub',
      '-align-super',

      '-align-[--value]',
    ]),
  ).toEqual('')
})

test('font', () => {
  expect(
    compileCss(
      css`
        @theme {
          --font-family-sans: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        }
        @tailwind utilities;
      `,
      [
        // font-family
        'font-sans',
        'font-["arial_rounded"]',
        'font-[ui-sans-serif]',
        'font-[--my-family]',
        'font-[family-name:--my-family]',
        'font-[generic-name:--my-family]',

        // font-weight
        'font-bold',
        'font-[100]',
        'font-[number:--my-weight]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --font-family-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }

    .font-\\[\\"arial_rounded\\"\\] {
      font-family: arial rounded;
    }

    .font-\\[family-name\\:--my-family\\], .font-\\[generic-name\\:--my-family\\] {
      font-family: var(--my-family);
    }

    .font-\\[ui-sans-serif\\] {
      font-family: ui-sans-serif;
    }

    .font-sans {
      font-family: var(--font-family-sans, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");
    }

    .font-\\[--my-family\\] {
      font-weight: var(--my-family);
    }

    .font-\\[100\\] {
      font-weight: 100;
    }

    .font-\\[number\\:--my-weight\\] {
      font-weight: var(--my-weight);
    }

    .font-bold {
      font-weight: 700;
    }"
  `)
  expect(
    run([
      'font',
      // font-family
      '-font-sans',

      // font-weight
      '-font-bold',
    ]),
  ).toEqual('')
})

test('text-transform', () => {
  expect(run(['uppercase', 'lowercase', 'capitalize', 'normal-case'])).toMatchInlineSnapshot(`
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
  expect(run(['-uppercase', '-lowercase', '-capitalize', '-normal-case'])).toEqual('')
})

test('font-style', () => {
  expect(run(['italic', 'not-italic'])).toMatchInlineSnapshot(`
    ".italic {
      font-style: italic;
    }

    .not-italic {
      font-style: normal;
    }"
  `)
  expect(run(['-italic', '-not-italic'])).toEqual('')
})

test('font-stretch', () => {
  expect(run(['font-stretch-ultra-expanded', 'font-stretch-50%', 'font-stretch-200%']))
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
    run([
      'font-stretch',
      'font-stretch-20%',
      'font-stretch-50',
      'font-stretch-400%',
      'font-stretch-potato',
    ]),
  ).toEqual('')
})

test('text-decoration-line', () => {
  expect(run(['underline', 'overline', 'line-through', 'no-underline'])).toMatchInlineSnapshot(`
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
  expect(run(['-underline', '-overline', '-line-through', '-no-underline'])).toEqual('')
})

test('placeholder', () => {
  expect(
    compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        'placeholder-red-500',
        'placeholder-red-500/50',
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
    ":root {
      --color-red-500: #ef4444;
    }

    .placeholder-\\[\\#0088cc\\]::placeholder {
      color: #08c;
    }

    .placeholder-\\[\\#0088cc\\]\\/50::placeholder {
      color: #0088cc80;
    }

    .placeholder-\\[\\#0088cc\\]\\/\\[0\\.5\\]::placeholder {
      color: #0088cc80;
    }

    .placeholder-\\[\\#0088cc\\]\\/\\[50\\%\\]::placeholder {
      color: #0088cc80;
    }

    .placeholder-current::placeholder {
      color: currentColor;
    }

    .placeholder-current\\/50::placeholder {
      color: color-mix(in srgb, currentColor 50%, transparent);
    }

    .placeholder-current\\/\\[0\\.5\\]::placeholder {
      color: color-mix(in srgb, currentColor 50%, transparent);
    }

    .placeholder-current\\/\\[50\\%\\]::placeholder {
      color: color-mix(in srgb, currentColor 50%, transparent);
    }

    .placeholder-inherit::placeholder {
      color: inherit;
    }

    .placeholder-red-500::placeholder {
      color: var(--color-red-500, #ef4444);
    }

    .placeholder-red-500\\/50::placeholder {
      color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    .placeholder-red-500\\/\\[0\\.5\\]::placeholder {
      color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    .placeholder-red-500\\/\\[50\\%\\]::placeholder {
      color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    .placeholder-transparent::placeholder {
      color: #0000;
    }"
  `)
  expect(
    run([
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

test('decoration', () => {
  expect(
    compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        // text-decoration-color
        'decoration-red-500',
        'decoration-red-500/50',
        'decoration-red-500/[0.5]',
        'decoration-red-500/[50%]',
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
        'decoration-[--my-color]',
        'decoration-[--my-color]/50',
        'decoration-[--my-color]/[0.5]',
        'decoration-[--my-color]/[50%]',
        'decoration-[color:--my-color]',
        'decoration-[color:--my-color]/50',
        'decoration-[color:--my-color]/[0.5]',
        'decoration-[color:--my-color]/[50%]',

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
        'decoration-[length:--my-thickness]',
        'decoration-[percentage:--my-thickness]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --color-red-500: #ef4444;
    }

    .decoration-\\[\\#0088cc\\] {
      text-decoration-color: #08c;
    }

    .decoration-\\[\\#0088cc\\]\\/50, .decoration-\\[\\#0088cc\\]\\/\\[0\\.5\\], .decoration-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      text-decoration-color: #0088cc80;
    }

    .decoration-\\[--my-color\\] {
      -webkit-text-decoration-color: var(--my-color);
      text-decoration-color: var(--my-color);
    }

    .decoration-\\[--my-color\\]\\/50, .decoration-\\[--my-color\\]\\/\\[0\\.5\\], .decoration-\\[--my-color\\]\\/\\[50\\%\\] {
      -webkit-text-decoration-color: color-mix(in srgb, var(--my-color) 50%, transparent);
      text-decoration-color: color-mix(in srgb, var(--my-color) 50%, transparent);
    }

    .decoration-\\[color\\:--my-color\\] {
      -webkit-text-decoration-color: var(--my-color);
      text-decoration-color: var(--my-color);
    }

    .decoration-\\[color\\:--my-color\\]\\/50, .decoration-\\[color\\:--my-color\\]\\/\\[0\\.5\\], .decoration-\\[color\\:--my-color\\]\\/\\[50\\%\\] {
      -webkit-text-decoration-color: color-mix(in srgb, var(--my-color) 50%, transparent);
      text-decoration-color: color-mix(in srgb, var(--my-color) 50%, transparent);
    }

    .decoration-current {
      text-decoration-color: currentColor;
    }

    .decoration-current\\/50, .decoration-current\\/\\[0\\.5\\], .decoration-current\\/\\[50\\%\\] {
      -webkit-text-decoration-color: color-mix(in srgb, currentColor 50%, transparent);
      text-decoration-color: color-mix(in srgb, currentColor 50%, transparent);
    }

    .decoration-inherit {
      -webkit-text-decoration-color: inherit;
      text-decoration-color: inherit;
    }

    .decoration-red-500 {
      -webkit-text-decoration-color: var(--color-red-500, #ef4444);
      text-decoration-color: var(--color-red-500, #ef4444);
    }

    .decoration-red-500\\/50, .decoration-red-500\\/\\[0\\.5\\], .decoration-red-500\\/\\[50\\%\\] {
      -webkit-text-decoration-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
      text-decoration-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
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
      text-decoration-thickness: calc(1em / 2);
    }

    .decoration-\\[length\\:--my-thickness\\], .decoration-\\[percentage\\:--my-thickness\\] {
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
    run([
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
      '-decoration-auto',
      '-decoration-from-font',
      '-decoration-0',
      '-decoration-1',
      '-decoration-2',
      '-decoration-4',
      '-decoration-123',
    ]),
  ).toEqual('')
})

test('animate', () => {
  expect(
    compileCss(
      css`
        @theme {
          --animate-spin: spin 1s linear infinite;
        }
        @tailwind utilities;
      `,
      ['animate-spin', 'animate-none', 'animate-[bounce_1s_infinite]', 'animate-not-found'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --animate-spin: spin 1s linear infinite;
    }

    .animate-\\[bounce_1s_infinite\\] {
      animation: 1s infinite bounce;
    }

    .animate-none {
      animation: none;
    }

    .animate-spin {
      animation: var(--animate-spin, spin 1s linear infinite);
    }"
  `)
  expect(
    run([
      'animate',
      '-animate-spin',
      '-animate-none',
      '-animate-[bounce_1s_infinite]',
      '-animate-not-found',
    ]),
  ).toEqual('')
})

test('filter', () => {
  expect(
    compileCss(
      css`
        @theme {
          --blur-xl: 24px;
          --drop-shadow: 0 1px 2px rgb(0 0 0 / 0.1), 0 1px 1px rgb(0 0 0 / 0.06);
          --drop-shadow-xl: 0 20px 13px rgb(0 0 0 / 0.03), 0 8px 5px rgb(0 0 0 / 0.08);
        }
        @tailwind utilities;
      `,
      [
        'filter',
        'filter-none',
        'filter-[--value]',
        'blur-xl',
        'blur-[4px]',
        'brightness-50',
        'brightness-[1.23]',
        'contrast-50',
        'contrast-[1.23]',
        'grayscale',
        'grayscale-0',
        'grayscale-[--value]',
        'hue-rotate-15',
        'hue-rotate-[45deg]',
        'invert',
        'invert-0',
        'invert-[--value]',
        'drop-shadow-xl',
        'drop-shadow-[0_0_red]',
        'saturate-0',
        'saturate-[1.75]',
        'saturate-[--value]',
        'sepia',
        'sepia-0',
        'sepia-[50%]',
        'sepia-[--value]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --blur-xl: 24px;
      --drop-shadow: 0 1px 2px #0000001a, 0 1px 1px #0000000f;
      --drop-shadow-xl: 0 20px 13px #00000008, 0 8px 5px #00000014;
    }

    .blur-\\[4px\\] {
      --tw-blur: blur(4px);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .blur-xl {
      --tw-blur: blur(var(--blur-xl, 24px));
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

    .drop-shadow-\\[0_0_red\\] {
      --tw-drop-shadow: drop-shadow(0 0 red);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .drop-shadow-xl {
      --tw-drop-shadow: drop-shadow(var(--drop-shadow-xl, 0 20px 13px #00000008, 0 8px 5px #00000014));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .grayscale {
      --tw-grayscale: grayscale(100%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .grayscale-0 {
      --tw-grayscale: grayscale(0%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .grayscale-\\[--value\\] {
      --tw-grayscale: grayscale(var(--value));
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

    .invert-\\[--value\\] {
      --tw-invert: invert(var(--value));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .saturate-0 {
      --tw-saturate: saturate(0%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .saturate-\\[--value\\] {
      --tw-saturate: saturate(var(--value));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .saturate-\\[1\\.75\\] {
      --tw-saturate: saturate(1.75);
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

    .sepia-\\[--value\\] {
      --tw-sepia: sepia(var(--value));
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .sepia-\\[50\\%\\] {
      --tw-sepia: sepia(50%);
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .filter {
      filter: var(--tw-blur, ) var(--tw-brightness, ) var(--tw-contrast, ) var(--tw-grayscale, ) var(--tw-hue-rotate, ) var(--tw-invert, ) var(--tw-saturate, ) var(--tw-sepia, ) var(--tw-drop-shadow, );
    }

    .filter-\\[--value\\] {
      filter: var(--value);
    }

    .filter-none {
      filter: none;
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-blur: ;
          --tw-brightness: ;
          --tw-contrast: ;
          --tw-grayscale: ;
          --tw-hue-rotate: ;
          --tw-invert: ;
          --tw-opacity: ;
          --tw-saturate: ;
          --tw-sepia: ;
        }
      }
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
    }"
  `)
  expect(
    run([
      '-filter',
      '-filter-none',
      '-filter-[--value]',
      '-blur-xl',
      '-blur-[4px]',
      '-brightness-50',
      '-brightness-[1.23]',
      'brightness-unknown',
      '-contrast-50',
      '-contrast-[1.23]',
      'contrast-unknown',
      '-grayscale',
      '-grayscale-0',
      '-grayscale-[--value]',
      'grayscale-unknown',
      '-hue-rotate-15',
      '-hue-rotate-[45deg]',
      'hue-rotate-unknown',
      '-invert',
      '-invert-0',
      '-invert-[--value]',
      'invert-unknown',
      '-drop-shadow-xl',
      '-drop-shadow-[0_0_red]',
      '-saturate-0',
      '-saturate-[1.75]',
      '-saturate-[--value]',
      'saturate-saturate',
      '-sepia',
      '-sepia-0',
      '-sepia-[50%]',
      '-sepia-[--value]',
      'sepia-unknown',
    ]),
  ).toEqual('')
})

test('backdrop-filter', () => {
  expect(
    compileCss(
      css`
        @theme {
          --blur-xl: 24px;
        }
        @tailwind utilities;
      `,
      [
        'backdrop-filter',
        'backdrop-filter-none',
        'backdrop-filter-[--value]',
        'backdrop-blur-xl',
        'backdrop-blur-[4px]',
        'backdrop-brightness-50',
        'backdrop-brightness-[1.23]',
        'backdrop-contrast-50',
        'backdrop-contrast-[1.23]',
        'backdrop-grayscale',
        'backdrop-grayscale-0',
        'backdrop-grayscale-[--value]',
        'backdrop-hue-rotate-15',
        'backdrop-hue-rotate-[45deg]',
        'backdrop-invert',
        'backdrop-invert-0',
        'backdrop-invert-[--value]',
        'backdrop-opacity-50',
        'backdrop-opacity-71',
        'backdrop-opacity-[0.5]',
        'backdrop-saturate-0',
        'backdrop-saturate-[1.75]',
        'backdrop-saturate-[--value]',
        'backdrop-sepia',
        'backdrop-sepia-0',
        'backdrop-sepia-[50%]',
        'backdrop-sepia-[--value]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --blur-xl: 24px;
    }

    .backdrop-blur-\\[4px\\] {
      --tw-backdrop-blur: blur(4px);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-blur-xl {
      --tw-backdrop-blur: blur(var(--blur-xl, 24px));
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

    .backdrop-grayscale-\\[--value\\] {
      --tw-backdrop-grayscale: grayscale(var(--value));
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

    .backdrop-invert-\\[--value\\] {
      --tw-backdrop-invert: invert(var(--value));
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

    .backdrop-saturate-\\[--value\\] {
      --tw-backdrop-saturate: saturate(var(--value));
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-saturate-\\[1\\.75\\] {
      --tw-backdrop-saturate: saturate(1.75);
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

    .backdrop-sepia-\\[--value\\] {
      --tw-backdrop-sepia: sepia(var(--value));
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-sepia-\\[50\\%\\] {
      --tw-backdrop-sepia: sepia(50%);
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-filter {
      -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
    }

    .backdrop-filter-\\[--value\\] {
      -webkit-backdrop-filter: var(--value);
      backdrop-filter: var(--value);
    }

    .backdrop-filter-none {
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-backdrop-blur: ;
          --tw-backdrop-brightness: ;
          --tw-backdrop-contrast: ;
          --tw-backdrop-grayscale: ;
          --tw-backdrop-hue-rotate: ;
          --tw-backdrop-invert: ;
          --tw-backdrop-opacity: ;
          --tw-backdrop-saturate: ;
          --tw-backdrop-sepia: ;
        }
      }
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
    run([
      '-backdrop-filter',
      '-backdrop-filter-none',
      '-backdrop-filter-[--value]',
      '-backdrop-blur-xl',
      '-backdrop-blur-[4px]',
      '-backdrop-brightness-50',
      '-backdrop-brightness-[1.23]',
      'backdrop-brightness-unknown',
      '-backdrop-contrast-50',
      '-backdrop-contrast-[1.23]',
      'backdrop-contrast-unknown',
      '-backdrop-grayscale',
      '-backdrop-grayscale-0',
      '-backdrop-grayscale-[--value]',
      'backdrop-grayscale-unknown',
      '-backdrop-hue-rotate-15',
      '-backdrop-hue-rotate-[45deg]',
      'backdrop-hue-rotate-unknown',
      '-backdrop-invert',
      '-backdrop-invert-0',
      '-backdrop-invert-[--value]',
      'backdrop-invert-unknown',
      '-backdrop-opacity-50',
      '-backdrop-opacity-[0.5]',
      'backdrop-opacity-unknown',
      '-backdrop-saturate-0',
      '-backdrop-saturate-[1.75]',
      '-backdrop-saturate-[--value]',
      'backdrop-saturate-unknown',
      '-backdrop-sepia',
      '-backdrop-sepia-0',
      '-backdrop-sepia-[50%]',
      '-backdrop-sepia-[--value]',
      'backdrop-sepia-unknown',
    ]),
  ).toEqual('')
})

test('transition', () => {
  expect(
    compileCss(
      css`
        @theme {
          --default-transition-timing-function: ease;
          --default-transition-duration: 100ms;
          --transition-property: color, background-color, border-color, text-decoration-color, fill,
            stroke, opacity, box-shadow, transform, filter, backdrop-filter;
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
        'transition-[--value]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --default-transition-timing-function: ease;
      --default-transition-duration: .1s;
      --transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
      --transition-property-opacity: opacity;
    }

    .transition {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, -webkit-backdrop-filter, backdrop-filter;
      transition-duration: .1s;
      transition-timing-function: ease;
    }

    .transition-\\[--value\\] {
      transition-property: var(--value);
      transition-duration: .1s;
      transition-timing-function: ease;
    }

    .transition-all {
      transition-property: all;
      transition-duration: .1s;
      transition-timing-function: ease;
    }

    .transition-colors {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
      transition-duration: .1s;
      transition-timing-function: ease;
    }

    .transition-opacity {
      transition-property: opacity;
      transition-duration: .1s;
      transition-timing-function: ease;
    }

    .transition-shadow {
      transition-property: box-shadow;
      transition-duration: .1s;
      transition-timing-function: ease;
    }

    .transition-transform {
      transition-property: transform, translate, scale, rotate;
      transition-duration: .1s;
      transition-timing-function: ease;
    }

    .transition-none {
      transition-property: none;
    }"
  `)

  expect(
    compileCss(
      css`
        @tailwind utilities;
      `,
      ['transition-all'],
    ),
  ).toMatchInlineSnapshot(`
    ".transition-all {
      transition-property: all;
      transition-duration: 0s;
      transition-timing-function: ease;
    }"
  `)

  expect(
    run([
      '-transition',
      '-transition-none',
      '-transition-all',
      '-transition-opacity',
      '-transition-[--value]',
    ]),
  ).toEqual('')
})

test('delay', () => {
  expect(run(['delay-123', 'delay-200', 'delay-[300ms]'])).toMatchInlineSnapshot(`
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
  expect(run(['delay', '-delay-200', '-delay-[300ms]', 'delay-unknown'])).toEqual('')
})

test('duration', () => {
  expect(run(['duration-123', 'duration-200', 'duration-[300ms]'])).toMatchInlineSnapshot(`
    ".duration-123 {
      transition-duration: .123s;
    }

    .duration-200 {
      transition-duration: .2s;
    }

    .duration-\\[300ms\\] {
      transition-duration: .3s;
    }"
  `)
  expect(run(['duration', '-duration-200', '-duration-[300ms]'])).toEqual('')
})

test('ease', () => {
  expect(
    compileCss(
      css`
        @theme {
          --transition-timing-function-in: cubic-bezier(0.4, 0, 1, 1);
          --transition-timing-function-out: cubic-bezier(0, 0, 0.2, 1);
        }
        @tailwind utilities;
      `,
      ['ease-in', 'ease-out', 'ease-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --transition-timing-function-in: cubic-bezier(.4, 0, 1, 1);
      --transition-timing-function-out: cubic-bezier(0, 0, .2, 1);
    }

    .ease-\\[--value\\] {
      transition-timing-function: var(--value);
    }

    .ease-in {
      transition-timing-function: var(--transition-timing-function-in, cubic-bezier(.4, 0, 1, 1));
    }

    .ease-out {
      transition-timing-function: var(--transition-timing-function-out, cubic-bezier(0, 0, .2, 1));
    }"
  `)
  expect(run(['-ease-in', '-ease-out', '-ease-[--value]'])).toEqual('')
})

test('will-change', () => {
  expect(
    run([
      'will-change-auto',
      'will-change-contents',
      'will-change-transform',
      'will-change-scroll',
      'will-change-[--value]',
    ]),
  ).toMatchInlineSnapshot(`
    ".will-change-\\[--value\\] {
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
    run([
      'will-change',
      '-will-change-auto',
      '-will-change-contents',
      '-will-change-transform',
      '-will-change-scroll',
      '-will-change-[--value]',
    ]),
  ).toEqual('')
})

test('contain', () => {
  expect(
    run([
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
    ".contain-\\[unset\\] {
      contain: unset;
    }

    .contain-content {
      contain: content;
    }

    .contain-inline-size {
      --tw-contain-size: inline-size;
      contain: var(--tw-contain-size, ) var(--tw-contain-layout, ) var(--tw-contain-paint, ) var(--tw-contain-style, );
    }

    .contain-layout {
      --tw-contain-layout: layout;
      contain: var(--tw-contain-size, ) var(--tw-contain-layout, ) var(--tw-contain-paint, ) var(--tw-contain-style, );
    }

    .contain-none {
      contain: none;
    }

    .contain-paint {
      --tw-contain-paint: paint;
      contain: var(--tw-contain-size, ) var(--tw-contain-layout, ) var(--tw-contain-paint, ) var(--tw-contain-style, );
    }

    .contain-size {
      --tw-contain-size: size;
      contain: var(--tw-contain-size, ) var(--tw-contain-layout, ) var(--tw-contain-paint, ) var(--tw-contain-style, );
    }

    .contain-strict {
      contain: strict;
    }

    .contain-style {
      --tw-contain-style: style;
      contain: var(--tw-contain-size, ) var(--tw-contain-layout, ) var(--tw-contain-paint, ) var(--tw-contain-style, );
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-contain-size: ;
          --tw-contain-layout: ;
          --tw-contain-paint: ;
          --tw-contain-style: ;
        }
      }
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
})

test('content', () => {
  expect(run(['content-["hello_world"]'])).toMatchInlineSnapshot(`
    ".content-\\[\\"hello_world\\"\\] {
      --tw-content: "hello world";
      content: var(--tw-content);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-content: "";
        }
      }
    }

    @property --tw-content {
      syntax: "*";
      inherits: false;
      initial-value: "";
    }"
  `)
  expect(run(['content', '-content-["hello_world"]'])).toEqual('')
})

test('forced-color-adjust', () => {
  expect(run(['forced-color-adjust-none', 'forced-color-adjust-auto'])).toMatchInlineSnapshot(`
    ".forced-color-adjust-auto {
      forced-color-adjust: auto;
    }

    .forced-color-adjust-none {
      forced-color-adjust: none;
    }"
  `)
  expect(
    run([
      'forced',
      'forced-color',
      'forced-color-adjust',
      '-forced-color-adjust-none',
      '-forced-color-adjust-auto',
    ]),
  ).toEqual('')
})

test('leading', () => {
  expect(
    compileCss(
      css`
        @theme {
          --line-height-none: 1;
          --line-height-6: 1.5rem;
        }
        @tailwind utilities;
      `,
      ['leading-none', 'leading-6', 'leading-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --line-height-none: 1;
      --line-height-6: 1.5rem;
    }

    .leading-6 {
      line-height: var(--line-height-6, 1.5rem);
    }

    .leading-\\[--value\\] {
      line-height: var(--value);
    }

    .leading-none {
      line-height: var(--line-height-none, 1);
    }"
  `)
  expect(run(['leading', '-leading-none', '-leading-6', '-leading-[--value]'])).toEqual('')
})

test('tracking', () => {
  expect(
    compileCss(
      css`
        @theme {
          --letter-spacing-normal: 0em;
          --letter-spacing-wide: 0.025em;
        }
        @tailwind utilities;
      `,
      ['tracking-normal', 'tracking-wide', 'tracking-[--value]', '-tracking-[--value]'],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --letter-spacing-normal: 0em;
      --letter-spacing-wide: .025em;
    }

    .-tracking-\\[--value\\] {
      letter-spacing: calc(var(--value) * -1);
    }

    .tracking-\\[--value\\] {
      letter-spacing: var(--value);
    }

    .tracking-normal {
      letter-spacing: var(--letter-spacing-normal, 0em);
    }

    .tracking-wide {
      letter-spacing: var(--letter-spacing-wide, .025em);
    }"
  `)
  expect(run(['tracking'])).toEqual('')
})

test('font-smoothing', () => {
  expect(run(['antialiased', 'subpixel-antialiased'])).toMatchInlineSnapshot(`
    ".antialiased {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .subpixel-antialiased {
      -webkit-font-smoothing: auto;
      -moz-osx-font-smoothing: auto;
    }"
  `)
  expect(run(['-antialiased', '-subpixel-antialiased'])).toEqual('')
})

test('font-variant-numeric', () => {
  expect(
    run([
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
    ".diagonal-fractions {
      --tw-numeric-fraction: diagonal-fractions;
      font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );
    }

    .lining-nums {
      --tw-numeric-figure: lining-nums;
      font-variant-numeric: var(--tw-ordinal, ) var(--tw-slashed-zero, ) var(--tw-numeric-figure, ) var(--tw-numeric-spacing, ) var(--tw-numeric-fraction, );
    }

    .normal-nums {
      font-variant-numeric: normal;
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

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-ordinal: ;
          --tw-slashed-zero: ;
          --tw-numeric-figure: ;
          --tw-numeric-spacing: ;
          --tw-numeric-fraction: ;
        }
      }
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
    run([
      '-normal-nums',
      '-ordinal',
      '-slashed-zero',
      '-lining-nums',
      '-oldstyle-nums',
      '-proportional-nums',
      '-tabular-nums',
      '-diagonal-fractions',
      '-stacked-fractions',
    ]),
  ).toEqual('')
})

test('outline', () => {
  expect(
    compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        'outline',

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
        'outline-[--value]',
        'outline-[--value]/50',
        'outline-[--value]/[0.5]',
        'outline-[--value]/[50%]',
        'outline-[color:--value]',
        'outline-[color:--value]/50',
        'outline-[color:--value]/[0.5]',
        'outline-[color:--value]/[50%]',

        // outline-width
        'outline-0',
        'outline-[1.5]',
        'outline-[12px]',
        'outline-[50%]',
        'outline-[number:--my-width]',
        'outline-[length:--my-width]',
        'outline-[percentage:--my-width]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --color-red-500: #ef4444;
    }

    .outline-none {
      outline-offset: 2px;
      outline: 2px solid #0000;
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

    .outline-\\[length\\:--my-width\\], .outline-\\[number\\:--my-width\\], .outline-\\[percentage\\:--my-width\\] {
      outline-style: var(--tw-outline-style);
      outline-width: var(--my-width);
    }

    .outline-\\[\\#0088cc\\] {
      outline-color: #08c;
    }

    .outline-\\[\\#0088cc\\]\\/50, .outline-\\[\\#0088cc\\]\\/\\[0\\.5\\], .outline-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      outline-color: #0088cc80;
    }

    .outline-\\[--value\\] {
      outline-color: var(--value);
    }

    .outline-\\[--value\\]\\/50, .outline-\\[--value\\]\\/\\[0\\.5\\], .outline-\\[--value\\]\\/\\[50\\%\\] {
      outline-color: color-mix(in srgb, var(--value) 50%, transparent);
    }

    .outline-\\[black\\] {
      outline-color: #000;
    }

    .outline-\\[black\\]\\/50, .outline-\\[black\\]\\/\\[0\\.5\\], .outline-\\[black\\]\\/\\[50\\%\\] {
      outline-color: #00000080;
    }

    .outline-\\[color\\:--value\\] {
      outline-color: var(--value);
    }

    .outline-\\[color\\:--value\\]\\/50, .outline-\\[color\\:--value\\]\\/\\[0\\.5\\], .outline-\\[color\\:--value\\]\\/\\[50\\%\\] {
      outline-color: color-mix(in srgb, var(--value) 50%, transparent);
    }

    .outline-current {
      outline-color: currentColor;
    }

    .outline-current\\/50, .outline-current\\/\\[0\\.5\\], .outline-current\\/\\[50\\%\\] {
      outline-color: color-mix(in srgb, currentColor 50%, transparent);
    }

    .outline-inherit {
      outline-color: inherit;
    }

    .outline-red-500 {
      outline-color: var(--color-red-500, #ef4444);
    }

    .outline-red-500\\/50, .outline-red-500\\/\\[0\\.5\\], .outline-red-500\\/\\[50\\%\\] {
      outline-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
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

    .outline-solid {
      --tw-outline-style: solid;
      outline-style: solid;
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-outline-style: solid;
        }
      }
    }

    @property --tw-outline-style {
      syntax: "<custom-ident>";
      inherits: false;
      initial-value: solid;
    }"
  `)
  expect(
    run([
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
    ]),
  ).toEqual('')
})

test('outline-offset', () => {
  expect(
    run([
      'outline-offset-4',
      '-outline-offset-4',
      'outline-offset-[--value]',
      '-outline-offset-[--value]',
    ]),
  ).toMatchInlineSnapshot(`
    ".-outline-offset-4 {
      outline-offset: calc(4px * -1);
    }

    .-outline-offset-\\[--value\\] {
      outline-offset: calc(var(--value) * -1);
    }

    .outline-offset-4 {
      outline-offset: 4px;
    }

    .outline-offset-\\[--value\\] {
      outline-offset: var(--value);
    }"
  `)
  expect(run(['outline-offset', 'outline-offset-unknown'])).toEqual('')
})

test('opacity', () => {
  expect(run(['opacity-15', 'opacity-[--value]'])).toMatchInlineSnapshot(`
    ".opacity-15 {
      opacity: .15;
    }

    .opacity-\\[--value\\] {
      opacity: var(--value);
    }"
  `)
  expect(run(['opacity', '-opacity-15', '-opacity-[--value]', 'opacity-unknown'])).toEqual('')
})

test('underline-offset', () => {
  expect(
    compileCss(
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
        'underline-offset-[--value]',
        '-underline-offset-[--value]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ".-underline-offset-4 {
      text-underline-offset: calc(4px * -1);
    }

    .-underline-offset-123 {
      text-underline-offset: calc(123px * -1);
    }

    .-underline-offset-\\[--value\\] {
      text-underline-offset: calc(var(--value) * -1);
    }

    .underline-offset-4 {
      text-underline-offset: 4px;
    }

    .underline-offset-123 {
      text-underline-offset: 123px;
    }

    .underline-offset-\\[--value\\] {
      text-underline-offset: var(--value);
    }

    .underline-offset-auto {
      text-underline-offset: auto;
    }"
  `)
  expect(run(['underline-offset', '-underline-offset-auto', 'underline-offset-unknown'])).toEqual(
    '',
  )
})

test('text', () => {
  expect(
    compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --line-height-6: 1.5rem;
          --font-size-sm: 0.875rem;
          --font-size-sm--line-height: 1.25rem;
          --line-height-9: 2.25rem;
        }
        @tailwind utilities;
      `,
      [
        // color
        'text-red-500',
        'text-red-500/50',
        'text-red-500/[0.5]',
        'text-red-500/[50%]',
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

        'text-[--my-color]',
        'text-[--my-color]/50',
        'text-[--my-color]/[0.5]',
        'text-[--my-color]/[50%]',
        'text-[color:--my-color]',
        'text-[color:--my-color]/50',
        'text-[color:--my-color]/[0.5]',
        'text-[color:--my-color]/[50%]',

        // font-size / line-height / letter-spacing / font-weight
        'text-sm',
        'text-sm/6',
        'text-sm/[4px]',
        'text-[12px]',
        'text-[12px]/6',
        'text-[50%]',
        'text-[50%]/6',
        'text-[xx-large]',
        'text-[xx-large]/6',
        'text-[larger]',
        'text-[larger]/6',
        'text-[length:--my-size]',
        'text-[percentage:--my-size]',
        'text-[absolute-size:--my-size]',
        'text-[relative-size:--my-size]',
        'text-[clamp(1rem,2rem,3rem)]',
        'text-[clamp(1rem,var(--size),3rem)]',
        'text-[clamp(1rem,var(--size),3rem)]/9',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --color-red-500: #ef4444;
      --line-height-6: 1.5rem;
      --font-size-sm: .875rem;
      --font-size-sm--line-height: 1.25rem;
      --line-height-9: 2.25rem;
    }

    .text-sm {
      font-size: var(--font-size-sm, .875rem);
      line-height: var(--font-size-sm--line-height, 1.25rem);
    }

    .text-\\[12px\\]\\/6 {
      font-size: 12px;
      line-height: var(--line-height-6, 1.5rem);
    }

    .text-\\[50\\%\\]\\/6 {
      font-size: 50%;
      line-height: var(--line-height-6, 1.5rem);
    }

    .text-\\[clamp\\(1rem\\,var\\(--size\\)\\,3rem\\)\\]\\/9 {
      font-size: clamp(1rem, var(--size), 3rem);
      line-height: var(--line-height-9, 2.25rem);
    }

    .text-\\[larger\\]\\/6 {
      font-size: larger;
      line-height: var(--line-height-6, 1.5rem);
    }

    .text-\\[xx-large\\]\\/6 {
      font-size: xx-large;
      line-height: var(--line-height-6, 1.5rem);
    }

    .text-sm\\/6 {
      font-size: var(--font-size-sm, .875rem);
      line-height: var(--line-height-6, 1.5rem);
    }

    .text-sm\\/\\[4px\\] {
      font-size: var(--font-size-sm, .875rem);
      line-height: 4px;
    }

    .text-\\[12px\\] {
      font-size: 12px;
    }

    .text-\\[50\\%\\] {
      font-size: 50%;
    }

    .text-\\[absolute-size\\:--my-size\\] {
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

    .text-\\[length\\:--my-size\\], .text-\\[percentage\\:--my-size\\], .text-\\[relative-size\\:--my-size\\] {
      font-size: var(--my-size);
    }

    .text-\\[xx-large\\] {
      font-size: xx-large;
    }

    .text-\\[\\#0088cc\\] {
      color: #08c;
    }

    .text-\\[\\#0088cc\\]\\/50, .text-\\[\\#0088cc\\]\\/\\[0\\.5\\], .text-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      color: #0088cc80;
    }

    .text-\\[--my-color\\] {
      color: var(--my-color);
    }

    .text-\\[--my-color\\]\\/50, .text-\\[--my-color\\]\\/\\[0\\.5\\], .text-\\[--my-color\\]\\/\\[50\\%\\] {
      color: color-mix(in srgb, var(--my-color) 50%, transparent);
    }

    .text-\\[color\\:--my-color\\] {
      color: var(--my-color);
    }

    .text-\\[color\\:--my-color\\]\\/50, .text-\\[color\\:--my-color\\]\\/\\[0\\.5\\], .text-\\[color\\:--my-color\\]\\/\\[50\\%\\] {
      color: color-mix(in srgb, var(--my-color) 50%, transparent);
    }

    .text-current {
      color: currentColor;
    }

    .text-current\\/50, .text-current\\/\\[0\\.5\\], .text-current\\/\\[50\\%\\] {
      color: color-mix(in srgb, currentColor 50%, transparent);
    }

    .text-inherit {
      color: inherit;
    }

    .text-red-500 {
      color: var(--color-red-500, #ef4444);
    }

    .text-red-500\\/50, .text-red-500\\/\\[0\\.5\\], .text-red-500\\/\\[50\\%\\] {
      color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    .text-transparent {
      color: #0000;
    }"
  `)
  expect(
    run([
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
      '-text-sm/[4px]',
    ]),
  ).toEqual('')
})

test('shadow', () => {
  expect(
    compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
          --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
          --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
        @tailwind utilities;
      `,
      [
        // Shadows
        'shadow',
        'shadow-xl',
        'shadow-none',
        'shadow-[12px_12px_#0088cc]',
        'shadow-[10px_10px]',
        'shadow-[--value]',
        'shadow-[shadow:--value]',

        // Colors
        'shadow-red-500',
        'shadow-red-500/50',
        'shadow-red-500/[0.5]',
        'shadow-red-500/[50%]',
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
        'shadow-[color:--value]',
        'shadow-[color:--value]/50',
        'shadow-[color:--value]/[0.5]',
        'shadow-[color:--value]/[50%]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --color-red-500: #ef4444;
      --shadow: 0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a;
      --shadow-xl: 0 20px 25px -5px #0000001a, 0 8px 10px -6px #0000001a;
    }

    .shadow {
      --tw-shadow: 0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a;
      --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-\\[--value\\] {
      --tw-shadow: var(--value);
      --tw-shadow-colored: var(--value);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-\\[10px_10px\\] {
      --tw-shadow: 10px 10px;
      --tw-shadow-colored: 10px 10px;
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-\\[12px_12px_\\#0088cc\\] {
      --tw-shadow: 12px 12px #08c;
      --tw-shadow-colored: 12px 12px var(--tw-shadow-color);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-\\[shadow\\:--value\\] {
      --tw-shadow: var(--value);
      --tw-shadow-colored: var(--value);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-none {
      --tw-shadow: 0 0 #0000;
      --tw-shadow-colored: 0 0 #0000;
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-xl {
      --tw-shadow: 0 20px 25px -5px #0000001a, 0 8px 10px -6px #0000001a;
      --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .shadow-\\[\\#0088cc\\] {
      --tw-shadow-color: #08c;
      --tw-shadow: var(--tw-shadow-colored);
    }

    .shadow-\\[\\#0088cc\\]\\/50, .shadow-\\[\\#0088cc\\]\\/\\[0\\.5\\], .shadow-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-shadow-color: #0088cc80;
      --tw-shadow: var(--tw-shadow-colored);
    }

    .shadow-\\[color\\:--value\\] {
      --tw-shadow-color: var(--value);
      --tw-shadow: var(--tw-shadow-colored);
    }

    .shadow-\\[color\\:--value\\]\\/50, .shadow-\\[color\\:--value\\]\\/\\[0\\.5\\], .shadow-\\[color\\:--value\\]\\/\\[50\\%\\] {
      --tw-shadow-color: color-mix(in srgb, var(--value) 50%, transparent);
      --tw-shadow: var(--tw-shadow-colored);
    }

    .shadow-current {
      --tw-shadow-color: currentColor;
      --tw-shadow: var(--tw-shadow-colored);
    }

    .shadow-current\\/50, .shadow-current\\/\\[0\\.5\\], .shadow-current\\/\\[50\\%\\] {
      --tw-shadow-color: color-mix(in srgb, currentColor 50%, transparent);
      --tw-shadow: var(--tw-shadow-colored);
    }

    .shadow-inherit {
      --tw-shadow-color: inherit;
      --tw-shadow: var(--tw-shadow-colored);
    }

    .shadow-red-500 {
      --tw-shadow-color: var(--color-red-500, #ef4444);
      --tw-shadow: var(--tw-shadow-colored);
    }

    .shadow-red-500\\/50, .shadow-red-500\\/\\[0\\.5\\], .shadow-red-500\\/\\[50\\%\\] {
      --tw-shadow-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
      --tw-shadow: var(--tw-shadow-colored);
    }

    .shadow-transparent {
      --tw-shadow-color: transparent;
      --tw-shadow: var(--tw-shadow-colored);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-shadow: 0 0 #0000;
          --tw-shadow-colored: 0 0 #0000;
          --tw-inset-shadow: 0 0 #0000;
          --tw-inset-shadow-colored: 0 0 #0000;
          --tw-ring-color: ;
          --tw-ring-shadow: 0 0 #0000;
          --tw-inset-ring-color: ;
          --tw-inset-ring-shadow: 0 0 #0000;
          --tw-ring-inset: ;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-offset-shadow: 0 0 #0000;
        }
      }
    }

    @property --tw-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-shadow-colored {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow-colored {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
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
    run([
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
      '-shadow-[--value]',
    ]),
  ).toEqual('')
})

test('inset-shadow', () => {
  expect(
    compileCss(
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
        'inset-shadow-[10px_10px]',
        'inset-shadow-[--value]',
        'inset-shadow-[shadow:--value]',

        // Colors
        'inset-shadow-red-500',
        'inset-shadow-red-500/50',
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
        'inset-shadow-[color:--value]',
        'inset-shadow-[color:--value]/50',
        'inset-shadow-[color:--value]/[0.5]',
        'inset-shadow-[color:--value]/[50%]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --color-red-500: #ef4444;
      --inset-shadow: inset 0 2px 4px #0000000d;
      --inset-shadow-sm: inset 0 1px 1px #0000000d;
    }

    .inset-shadow {
      --tw-inset-shadow: inset 0 2px 4px #0000000d;
      --tw-inset-shadow-colored: inset 0 2px 4px var(--tw-inset-shadow-color);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-\\[--value\\] {
      --tw-inset-shadow: inset var(--value);
      --tw-inset-shadow-colored: inset var(--value);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-\\[10px_10px\\] {
      --tw-inset-shadow: inset 10px 10px;
      --tw-inset-shadow-colored: inset 10px 10px;
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-\\[12px_12px_\\#0088cc\\] {
      --tw-inset-shadow: inset 12px 12px #08c;
      --tw-inset-shadow-colored: inset 12px 12px var(--tw-inset-shadow-color);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-\\[shadow\\:--value\\] {
      --tw-inset-shadow: inset var(--value);
      --tw-inset-shadow-colored: inset var(--value);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-none {
      --tw-inset-shadow: 0 0 #0000;
      --tw-inset-shadow-colored: 0 0 #0000;
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-sm {
      --tw-inset-shadow: inset 0 1px 1px #0000000d;
      --tw-inset-shadow-colored: inset 0 1px 1px var(--tw-inset-shadow-color);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-shadow-\\[\\#0088cc\\] {
      --tw-inset-shadow-color: #08c;
      --tw-inset-shadow: var(--tw-inset-shadow-colored);
    }

    .inset-shadow-\\[\\#0088cc\\]\\/50, .inset-shadow-\\[\\#0088cc\\]\\/\\[0\\.5\\], .inset-shadow-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-inset-shadow-color: #0088cc80;
      --tw-inset-shadow: var(--tw-inset-shadow-colored);
    }

    .inset-shadow-\\[color\\:--value\\] {
      --tw-inset-shadow-color: var(--value);
      --tw-inset-shadow: var(--tw-inset-shadow-colored);
    }

    .inset-shadow-\\[color\\:--value\\]\\/50, .inset-shadow-\\[color\\:--value\\]\\/\\[0\\.5\\], .inset-shadow-\\[color\\:--value\\]\\/\\[50\\%\\] {
      --tw-inset-shadow-color: color-mix(in srgb, var(--value) 50%, transparent);
      --tw-inset-shadow: var(--tw-inset-shadow-colored);
    }

    .inset-shadow-current {
      --tw-inset-shadow-color: currentColor;
      --tw-inset-shadow: var(--tw-inset-shadow-colored);
    }

    .inset-shadow-current\\/50, .inset-shadow-current\\/\\[0\\.5\\], .inset-shadow-current\\/\\[50\\%\\] {
      --tw-inset-shadow-color: color-mix(in srgb, currentColor 50%, transparent);
      --tw-inset-shadow: var(--tw-inset-shadow-colored);
    }

    .inset-shadow-inherit {
      --tw-inset-shadow-color: inherit;
      --tw-inset-shadow: var(--tw-inset-shadow-colored);
    }

    .inset-shadow-red-500 {
      --tw-inset-shadow-color: var(--color-red-500, #ef4444);
      --tw-inset-shadow: var(--tw-inset-shadow-colored);
    }

    .inset-shadow-red-500\\/50, .inset-shadow-red-500\\/\\[0\\.5\\], .inset-shadow-red-500\\/\\[50\\%\\] {
      --tw-inset-shadow-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
      --tw-inset-shadow: var(--tw-inset-shadow-colored);
    }

    .inset-shadow-transparent {
      --tw-inset-shadow-color: transparent;
      --tw-inset-shadow: var(--tw-inset-shadow-colored);
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-shadow: 0 0 #0000;
          --tw-shadow-colored: 0 0 #0000;
          --tw-inset-shadow: 0 0 #0000;
          --tw-inset-shadow-colored: 0 0 #0000;
          --tw-ring-color: ;
          --tw-ring-shadow: 0 0 #0000;
          --tw-inset-ring-color: ;
          --tw-inset-ring-shadow: 0 0 #0000;
          --tw-ring-inset: ;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-offset-shadow: 0 0 #0000;
        }
      }
    }

    @property --tw-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-shadow-colored {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow-colored {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
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
    run([
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
      '-inset-shadow-[--value]',
    ]),
  ).toEqual('')
})

test('ring', () => {
  expect(
    compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
        }
        @tailwind utilities;
      `,
      [
        // ring color
        'ring-inset',
        'ring-red-500',
        'ring-red-500/50',
        'ring-red-500/[0.5]',
        'ring-red-500/[50%]',
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
        'ring-[--my-color]',
        'ring-[--my-color]/50',
        'ring-[--my-color]/[0.5]',
        'ring-[--my-color]/[50%]',
        'ring-[color:--my-color]',
        'ring-[color:--my-color]/50',
        'ring-[color:--my-color]/[0.5]',
        'ring-[color:--my-color]/[50%]',

        // ring width
        'ring',
        'ring-0',
        'ring-1',
        'ring-2',
        'ring-4',
        'ring-[12px]',
        'ring-[length:--my-width]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --color-red-500: #ef4444;
    }

    .ring {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-0 {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-1 {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-2 {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-4 {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-\\[12px\\] {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(12px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-\\[length\\:--my-width\\] {
      --tw-ring-shadow: var(--tw-ring-inset, ) 0 0 0 calc(var(--my-width)  + var(--tw-ring-offset-width)) var(--tw-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .ring-\\[\\#0088cc\\] {
      --tw-ring-color: #08c;
    }

    .ring-\\[\\#0088cc\\]\\/50, .ring-\\[\\#0088cc\\]\\/\\[0\\.5\\], .ring-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-ring-color: #0088cc80;
    }

    .ring-\\[--my-color\\] {
      --tw-ring-color: var(--my-color);
    }

    .ring-\\[--my-color\\]\\/50, .ring-\\[--my-color\\]\\/\\[0\\.5\\], .ring-\\[--my-color\\]\\/\\[50\\%\\] {
      --tw-ring-color: color-mix(in srgb, var(--my-color) 50%, transparent);
    }

    .ring-\\[color\\:--my-color\\] {
      --tw-ring-color: var(--my-color);
    }

    .ring-\\[color\\:--my-color\\]\\/50, .ring-\\[color\\:--my-color\\]\\/\\[0\\.5\\], .ring-\\[color\\:--my-color\\]\\/\\[50\\%\\] {
      --tw-ring-color: color-mix(in srgb, var(--my-color) 50%, transparent);
    }

    .ring-current {
      --tw-ring-color: currentColor;
    }

    .ring-current\\/50, .ring-current\\/\\[0\\.5\\], .ring-current\\/\\[50\\%\\] {
      --tw-ring-color: color-mix(in srgb, currentColor 50%, transparent);
    }

    .ring-inherit {
      --tw-ring-color: inherit;
    }

    .ring-red-500 {
      --tw-ring-color: var(--color-red-500, #ef4444);
    }

    .ring-red-500\\/50, .ring-red-500\\/\\[0\\.5\\], .ring-red-500\\/\\[50\\%\\] {
      --tw-ring-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    .ring-transparent {
      --tw-ring-color: transparent;
    }

    .ring-inset {
      --tw-ring-inset: inset;
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-shadow: 0 0 #0000;
          --tw-shadow-colored: 0 0 #0000;
          --tw-inset-shadow: 0 0 #0000;
          --tw-inset-shadow-colored: 0 0 #0000;
          --tw-ring-color: ;
          --tw-ring-shadow: 0 0 #0000;
          --tw-inset-ring-color: ;
          --tw-inset-ring-shadow: 0 0 #0000;
          --tw-ring-inset: ;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-offset-shadow: 0 0 #0000;
        }
      }
    }

    @property --tw-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-shadow-colored {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow-colored {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
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
    run([
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
      '-ring-0',
      '-ring-1',
      '-ring-2',
      '-ring-4',
    ]),
  ).toEqual('')
})

test('inset-ring', () => {
  expect(
    compileCss(
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
        'inset-ring-[--my-color]',
        'inset-ring-[--my-color]/50',
        'inset-ring-[--my-color]/[0.5]',
        'inset-ring-[--my-color]/[50%]',
        'inset-ring-[color:--my-color]',
        'inset-ring-[color:--my-color]/50',
        'inset-ring-[color:--my-color]/[0.5]',
        'inset-ring-[color:--my-color]/[50%]',

        // ring width
        'inset-ring',
        'inset-ring-0',
        'inset-ring-1',
        'inset-ring-2',
        'inset-ring-4',
        'inset-ring-[12px]',
        'inset-ring-[length:--my-width]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --color-red-500: #ef4444;
    }

    .inset-ring {
      --tw-inset-ring-shadow: inset 0 0 0 1px var(--tw-inset-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-0 {
      --tw-inset-ring-shadow: inset 0 0 0 0px var(--tw-inset-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-1 {
      --tw-inset-ring-shadow: inset 0 0 0 1px var(--tw-inset-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-2 {
      --tw-inset-ring-shadow: inset 0 0 0 2px var(--tw-inset-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-4 {
      --tw-inset-ring-shadow: inset 0 0 0 4px var(--tw-inset-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-\\[12px\\] {
      --tw-inset-ring-shadow: inset 0 0 0 12px var(--tw-inset-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-\\[length\\:--my-width\\] {
      --tw-inset-ring-shadow: inset 0 0 0 var(--my-width) var(--tw-inset-ring-color, currentColor);
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }

    .inset-ring-\\[\\#0088cc\\] {
      --tw-inset-ring-color: #08c;
    }

    .inset-ring-\\[\\#0088cc\\]\\/50, .inset-ring-\\[\\#0088cc\\]\\/\\[0\\.5\\], .inset-ring-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-inset-ring-color: #0088cc80;
    }

    .inset-ring-\\[--my-color\\] {
      --tw-inset-ring-color: var(--my-color);
    }

    .inset-ring-\\[--my-color\\]\\/50, .inset-ring-\\[--my-color\\]\\/\\[0\\.5\\], .inset-ring-\\[--my-color\\]\\/\\[50\\%\\] {
      --tw-inset-ring-color: color-mix(in srgb, var(--my-color) 50%, transparent);
    }

    .inset-ring-\\[color\\:--my-color\\] {
      --tw-inset-ring-color: var(--my-color);
    }

    .inset-ring-\\[color\\:--my-color\\]\\/50, .inset-ring-\\[color\\:--my-color\\]\\/\\[0\\.5\\], .inset-ring-\\[color\\:--my-color\\]\\/\\[50\\%\\] {
      --tw-inset-ring-color: color-mix(in srgb, var(--my-color) 50%, transparent);
    }

    .inset-ring-current {
      --tw-inset-ring-color: currentColor;
    }

    .inset-ring-current\\/50, .inset-ring-current\\/\\[0\\.5\\], .inset-ring-current\\/\\[50\\%\\] {
      --tw-inset-ring-color: color-mix(in srgb, currentColor 50%, transparent);
    }

    .inset-ring-inherit {
      --tw-inset-ring-color: inherit;
    }

    .inset-ring-red-500 {
      --tw-inset-ring-color: var(--color-red-500, #ef4444);
    }

    .inset-ring-red-500\\/50, .inset-ring-red-500\\/\\[0\\.5\\], .inset-ring-red-500\\/\\[50\\%\\] {
      --tw-inset-ring-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    .inset-ring-transparent {
      --tw-inset-ring-color: transparent;
    }

    @supports (-moz-orient: inline) {
      @layer base {
        *, :before, :after, ::backdrop {
          --tw-shadow: 0 0 #0000;
          --tw-shadow-colored: 0 0 #0000;
          --tw-inset-shadow: 0 0 #0000;
          --tw-inset-shadow-colored: 0 0 #0000;
          --tw-ring-color: ;
          --tw-ring-shadow: 0 0 #0000;
          --tw-inset-ring-color: ;
          --tw-inset-ring-shadow: 0 0 #0000;
          --tw-ring-inset: ;
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-offset-shadow: 0 0 #0000;
        }
      }
    }

    @property --tw-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-shadow-colored {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
    }

    @property --tw-inset-shadow-colored {
      syntax: "*";
      inherits: false;
      initial-value: 0 0 #0000;
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
    run([
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
      '-inset-ring-0',
      '-inset-ring-1',
      '-inset-ring-2',
      '-inset-ring-4',
    ]),
  ).toEqual('')
})

test('ring-offset', () => {
  expect(
    compileCss(
      css`
        @theme {
          --color-red-500: #ef4444;
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

        'ring-offset-[--my-color]',
        'ring-offset-[--my-color]/50',
        'ring-offset-[--my-color]/[0.5]',
        'ring-offset-[--my-color]/[50%]',
        'ring-offset-[color:--my-color]',
        'ring-offset-[color:--my-color]/50',
        'ring-offset-[color:--my-color]/[0.5]',
        'ring-offset-[color:--my-color]/[50%]',

        // ring width
        'ring-offset-0',
        'ring-offset-1',
        'ring-offset-2',
        'ring-offset-4',
        'ring-offset-[12px]',
        'ring-offset-[length:--my-width]',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ":root {
      --color-red-500: #ef4444;
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

    .ring-offset-\\[length\\:--my-width\\] {
      --tw-ring-offset-width: var(--my-width);
      --tw-ring-offset-shadow: var(--tw-ring-inset, ) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    }

    .ring-offset-\\[\\#0088cc\\] {
      --tw-ring-offset-color: #08c;
    }

    .ring-offset-\\[\\#0088cc\\]\\/50, .ring-offset-\\[\\#0088cc\\]\\/\\[0\\.5\\], .ring-offset-\\[\\#0088cc\\]\\/\\[50\\%\\] {
      --tw-ring-offset-color: #0088cc80;
    }

    .ring-offset-\\[--my-color\\] {
      --tw-ring-offset-color: var(--my-color);
    }

    .ring-offset-\\[--my-color\\]\\/50, .ring-offset-\\[--my-color\\]\\/\\[0\\.5\\], .ring-offset-\\[--my-color\\]\\/\\[50\\%\\] {
      --tw-ring-offset-color: color-mix(in srgb, var(--my-color) 50%, transparent);
    }

    .ring-offset-\\[color\\:--my-color\\] {
      --tw-ring-offset-color: var(--my-color);
    }

    .ring-offset-\\[color\\:--my-color\\]\\/50, .ring-offset-\\[color\\:--my-color\\]\\/\\[0\\.5\\], .ring-offset-\\[color\\:--my-color\\]\\/\\[50\\%\\] {
      --tw-ring-offset-color: color-mix(in srgb, var(--my-color) 50%, transparent);
    }

    .ring-offset-current {
      --tw-ring-offset-color: currentColor;
    }

    .ring-offset-current\\/50, .ring-offset-current\\/\\[0\\.5\\], .ring-offset-current\\/\\[50\\%\\] {
      --tw-ring-offset-color: color-mix(in srgb, currentColor 50%, transparent);
    }

    .ring-offset-inherit {
      --tw-ring-offset-color: inherit;
    }

    .ring-offset-red-500 {
      --tw-ring-offset-color: var(--color-red-500, #ef4444);
    }

    .ring-offset-red-500\\/50, .ring-offset-red-500\\/\\[0\\.5\\], .ring-offset-red-500\\/\\[50\\%\\] {
      --tw-ring-offset-color: color-mix(in srgb, var(--color-red-500, #ef4444) 50%, transparent);
    }

    .ring-offset-transparent {
      --tw-ring-offset-color: transparent;
    }"
  `)
  expect(
    run([
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
      '-ring-offset-0',
      '-ring-offset-1',
      '-ring-offset-2',
      '-ring-offset-4',
    ]),
  ).toEqual('')
})

test('@container', () => {
  expect(
    run([
      '@container',
      '@container-normal',
      '@container/sidebar',
      '@container-normal/sidebar',
      '@container-[size]',
      '@container-[size]/sidebar',
    ]),
  ).toMatchInlineSnapshot(`
    ".\\@container {
      container-type: inline-size;
    }

    .\\@container-\\[size\\] {
      container-type: size;
    }

    .\\@container-\\[size\\]\\/sidebar {
      container: sidebar / size;
    }

    .\\@container-normal {
      container-type: normal;
    }

    .\\@container-normal\\/sidebar {
      container: sidebar;
    }

    .\\@container\\/sidebar {
      container: sidebar / inline-size;
    }"
  `)
  expect(
    run([
      '-@container',
      '-@container-normal',
      '-@container/sidebar',
      '-@container-normal/sidebar',
      '-@container-[size]',
      '-@container-[size]/sidebar',
    ]),
  ).toEqual('')
})
