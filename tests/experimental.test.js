import { run, html, css } from './util/run'

test('experimental universal selector improvements (box-shadow)', () => {
  let config = {
    experimental: 'all',
    content: [{ raw: html`<div class="resize shadow"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchCss(css`
      .shadow {
        --tw-ring-offset-shadow: 0 0 #0000;
        --tw-ring-shadow: 0 0 #0000;
        --tw-shadow: 0 0 #0000;
        --tw-shadow-colored: 0 0 #0000;
      }
      .resize {
        resize: both;
      }
      .shadow {
        --tw-shadow: 0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a;
        --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
          0 1px 2px -1px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
    `)
  })
})

test('experimental universal selector improvements (pseudo hover)', () => {
  let config = {
    experimental: 'all',
    content: [{ raw: html`<div class="resize hover:shadow"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchCss(css`
      .hover\:shadow {
        --tw-ring-offset-shadow: 0 0 #0000;
        --tw-ring-shadow: 0 0 #0000;
        --tw-shadow: 0 0 #0000;
        --tw-shadow-colored: 0 0 #0000;
      }
      .resize {
        resize: both;
      }
      .hover\:shadow:hover {
        --tw-shadow: 0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a;
        --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
          0 1px 2px -1px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
    `)
  })
})

test('experimental universal selector improvements (multiple classes: group)', () => {
  let config = {
    experimental: 'all',
    content: [{ raw: html`<div class="resize group-hover:shadow"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchCss(css`
      .group-hover\:shadow {
        --tw-ring-offset-shadow: 0 0 #0000;
        --tw-ring-shadow: 0 0 #0000;
        --tw-shadow: 0 0 #0000;
        --tw-shadow-colored: 0 0 #0000;
      }
      .resize {
        resize: both;
      }
      .group:hover .group-hover\:shadow {
        --tw-shadow: 0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a;
        --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
          0 1px 2px -1px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
    `)
  })
})

test('experimental universal selector improvements (child selectors: divide-y)', () => {
  let config = {
    experimental: 'all',
    content: [{ raw: html`<div class="resize divide-y"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchCss(css`
      .resize {
        resize: both;
      }
      .divide-y > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-y-reverse: 0;
        border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
        border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
      }
    `)
  })
})

test('experimental universal selector improvements (hover:divide-y)', () => {
  let config = {
    experimental: 'all',
    content: [{ raw: html`<div class="resize hover:divide-y"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchCss(css`
      .resize {
        resize: both;
      }
      .hover\:divide-y:hover > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-y-reverse: 0;
        border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
        border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
      }
    `)
  })
})

test('experimental universal selector improvements (#app important)', () => {
  let config = {
    experimental: 'all',
    important: '#app',
    content: [{ raw: html`<div class="resize divide-y shadow"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchCss(css`
      .shadow {
        --tw-ring-offset-shadow: 0 0 #0000;
        --tw-ring-shadow: 0 0 #0000;
        --tw-shadow: 0 0 #0000;
        --tw-shadow-colored: 0 0 #0000;
      }
      #app :is(.resize) {
        resize: both;
      }
      #app :is(.divide-y > :not([hidden]) ~ :not([hidden])) {
        --tw-divide-y-reverse: 0;
        border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
        border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
      }
      #app :is(.shadow) {
        --tw-shadow: 0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a;
        --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
          0 1px 2px -1px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
    `)
  })
})
