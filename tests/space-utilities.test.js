import { run, html, css, defaults } from './util/run'

test('space-x uses non-logical properties', () => {
  let config = {
    future: {
      logicalSiblingUtilities: false,
    },
    content: [{ raw: html`<div class="space-x-4"></div>` }],
    corePlugins: { preflight: false },
  }

  return run('@tailwind base; @tailwind utilities;', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults}
      .space-x-4 > :not([hidden]) ~ :not([hidden]) {
        --tw-space-x-reverse: 0;
        margin-right: calc(1rem * var(--tw-space-x-reverse));
        margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
      }
    `)
  })
})

test('space-x uses logical properties', () => {
  let config = {
    future: {
      logicalSiblingUtilities: true,
    },
    content: [{ raw: html`<div class="space-x-4"></div>` }],
    corePlugins: { preflight: false },
  }

  return run('@tailwind base; @tailwind utilities;', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults}
      .space-x-4 > :not([hidden]) ~ :not([hidden]) {
        --tw-space-x-reverse: 0;
        margin-inline-start: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
        margin-inline-end: calc(1rem * var(--tw-space-x-reverse));
      }
    `)
  })
})
