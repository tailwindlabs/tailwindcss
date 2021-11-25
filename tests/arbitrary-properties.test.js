import { run, html, css } from './util/run'

test('basic arbitrary properties', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[paint-order:markers]"></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .\[paint-order\:markers\] {
        paint-order: markers;
      }
    `)
  })
})

test('arbitrary properties with modifiers', () => {
  let config = {
    content: [
      {
        raw: html`<div class="dark:lg:hover:[paint-order:markers]"></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (prefers-color-scheme: dark) {
        @media (min-width: 1024px) {
          .dark\:lg\:hover\:\[paint-order\:markers\]:hover {
            paint-order: markers;
          }
        }
      }
    `)
  })
})

test('arbitrary properties are sorted after utilities', () => {
  let config = {
    content: [
      {
        raw: html`<div class="content-none [paint-order:markers] hover:pointer-events-none"></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .content-none {
        --tw-content: none;
        content: var(--tw-content);
      }
      .\[paint-order\:markers\] {
        paint-order: markers;
      }
      .hover\:pointer-events-none:hover {
        pointer-events: none;
      }
    `)
  })
})

test('using CSS variables', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[--my-var:auto]"></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .\[--my-var\:auto\] {
        --my-var: auto;
      }
    `)
  })
})

test('using underscores as spaces', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[--my-var:2px_4px]"></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .\[--my-var\:2px_4px\] {
        --my-var: 2px 4px;
      }
    `)
  })
})

test('using the important modifier', () => {
  let config = {
    content: [
      {
        raw: html`<div class="![--my-var:2px_4px]"></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .\!\[--my-var\:2px_4px\] {
        --my-var: 2px 4px !important;
      }
    `)
  })
})

test('colons are allowed in quotes', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[content:'foo:bar']"></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .\[content\:\'foo\:bar\'\] {
        content: 'foo:bar';
      }
    `)
  })
})

test('colons are allowed in braces', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[background-image:url(http://example.com/picture.jpg)]"></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .\[background-image\:url\(http\:\/\/example\.com\/picture\.jpg\)\] {
        background-image: url(http://example.com/picture.jpg);
      }
    `)
  })
})

test('invalid class', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[a:b:c:d]"></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css``)
  })
})
