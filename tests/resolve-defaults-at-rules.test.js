import { run, html, css } from './util/run'

test('basic utilities', async () => {
  let config = {
    content: [{ raw: html`<div class="rotate-3 skew-y-6 scale-x-110"></div>` }],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let input = css`
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      *,
      ::before,
      ::after,
      ::backdrop {
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
      }

      /* --- */
      .rotate-3 {
        --tw-rotate: 3deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .skew-y-6 {
        --tw-skew-y: 6deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .scale-x-110 {
        --tw-scale-x: 1.1;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})

test('with pseudo-class variants', async () => {
  let config = {
    content: [
      { raw: html`<div class="hover:scale-x-110 focus:rotate-3 hover:focus:skew-y-6"></div>` },
    ],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let input = css`
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      *,
      ::before,
      ::after,
      ::backdrop {
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
      }

      /* --- */
      .hover\:scale-x-110:hover {
        --tw-scale-x: 1.1;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .focus\:rotate-3:focus {
        --tw-rotate: 3deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .hover\:focus\:skew-y-6:focus:hover {
        --tw-skew-y: 6deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})

test('with pseudo-element variants', async () => {
  let config = {
    content: [{ raw: html`<div class="before:scale-x-110 after:rotate-3"></div>` }],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let input = css`
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      *,
      ::before,
      ::after,
      ::backdrop {
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
      }

      /* --- */
      .before\:scale-x-110::before {
        content: var(--tw-content);
        --tw-scale-x: 1.1;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .after\:rotate-3::after {
        content: var(--tw-content);
        --tw-rotate: 3deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})

test('with multi-class variants', async () => {
  let config = {
    content: [{ raw: html`<div class="group-hover:scale-x-110 peer-focus:rotate-3"></div>` }],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let input = css`
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      *,
      ::before,
      ::after,
      ::backdrop {
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
      }

      /* --- */
      .group:hover .group-hover\:scale-x-110 {
        --tw-scale-x: 1.1;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .peer:focus ~ .peer-focus\:rotate-3 {
        --tw-rotate: 3deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})

test('with multi-class pseudo-element variants', async () => {
  let config = {
    content: [
      { raw: html`<div class="group-hover:before:scale-x-110 peer-focus:after:rotate-3"></div>` },
    ],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let input = css`
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      *,
      ::before,
      ::after,
      ::backdrop {
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
      }

      /* --- */
      .group:hover .group-hover\:before\:scale-x-110::before {
        content: var(--tw-content);
        --tw-scale-x: 1.1;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .peer:focus ~ .peer-focus\:after\:rotate-3::after {
        content: var(--tw-content);
        --tw-rotate: 3deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})

test('with multi-class pseudo-element and pseudo-class variants', async () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="group-hover:hover:before:scale-x-110 peer-focus:focus:after:rotate-3"
        ></div>`,
      },
    ],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let input = css`
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      *,
      ::before,
      ::after,
      ::backdrop {
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
      }

      /* --- */
      .group:hover .group-hover\:hover\:before\:scale-x-110:hover::before {
        content: var(--tw-content);
        --tw-scale-x: 1.1;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .peer:focus ~ .peer-focus\:focus\:after\:rotate-3:focus::after {
        content: var(--tw-content);
        --tw-rotate: 3deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})

test('with apply', async () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let input = css`
    @tailwind base;
    /* --- */
    @tailwind utilities;

    @layer utilities {
      .foo {
        @apply rotate-3;
      }
    }

    .bar {
      @apply before:scale-110;
    }

    .baz::before {
      @apply rotate-45;
    }

    .whats ~ .next > span:hover {
      @apply skew-x-6;
    }

    .media-queries {
      @apply md:rotate-45;
    }

    .a,
    .b,
    .c {
      @apply skew-y-3;
    }

    .a,
    .b {
      @apply rotate-45;
    }

    .a::before,
    .b::after {
      @apply rotate-90;
    }

    .recursive {
      @apply foo;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      *,
      ::before,
      ::after,
      ::backdrop {
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
      }

      /* --- */
      .foo {
        --tw-rotate: 3deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .bar::before {
        content: var(--tw-content);
        --tw-scale-x: 1.1;
        --tw-scale-y: 1.1;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .baz::before {
        --tw-rotate: 45deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .whats ~ .next > span:hover {
        --tw-skew-x: 6deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      @media (min-width: 768px) {
        .media-queries {
          --tw-rotate: 45deg;
          transform: translate(var(--tw-translate-x), var(--tw-translate-y))
            rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
            scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
        }
      }
      .a,
      .b,
      .c {
        --tw-skew-y: 3deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .a,
      .b {
        --tw-rotate: 45deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .a::before,
      .b::after {
        --tw-rotate: 90deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .recursive {
        --tw-rotate: 3deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})

test('legacy pseudo-element syntax is supported', async () => {
  let config = {
    experimental: { optimizeUniversalDefaults: true },
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let input = css`
    @tailwind base;
    /* --- */
    @tailwind utilities;

    .a:before {
      @apply rotate-45;
    }

    .b:after {
      @apply rotate-3;
    }

    .c:first-line {
      @apply rotate-1;
    }

    .d:first-letter {
      @apply rotate-6;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .a:before,
      .b:after,
      .c:first-line,
      .d:first-letter {
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
      }
      /* --- */
      .a:before {
        --tw-rotate: 45deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .b:after {
        --tw-rotate: 3deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .c:first-line {
        --tw-rotate: 1deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .d:first-letter {
        --tw-rotate: 6deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})

test('with borders', async () => {
  let config = {
    content: [{ raw: html`<div class="border border-red-500 md:border-2"></div>` }],
    corePlugins: ['borderWidth', 'borderColor', 'borderOpacity'],
  }

  let input = css`
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      /* --- */
      .border {
        border-width: 1px;
      }
      .border-red-500 {
        --tw-border-opacity: 1;
        border-color: rgb(239 68 68 / var(--tw-border-opacity));
      }
      @media (min-width: 768px) {
        .md\:border-2 {
          border-width: 2px;
        }
      }
    `)
  })
})

test('with shadows', async () => {
  let config = {
    content: [{ raw: html`<div class="shadow ring-1 ring-black/25 md:shadow-xl"></div>` }],
    corePlugins: ['boxShadow', 'ringColor', 'ringWidth'],
  }

  let input = css`
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      *,
      ::before,
      ::after,
      ::backdrop {
        --tw-ring-inset: ;
        --tw-ring-offset-width: 0px;
        --tw-ring-offset-color: #fff;
        --tw-ring-color: rgb(59 130 246 / 0.5);
        --tw-ring-offset-shadow: 0 0 #0000;
        --tw-ring-shadow: 0 0 #0000;
        --tw-shadow: 0 0 #0000;
        --tw-shadow-colored: 0 0 #0000;
      }

      /* --- */
      .shadow {
        --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
          0 1px 2px -1px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
      .ring-1 {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
      .ring-black\/25 {
        --tw-ring-color: rgb(0 0 0 / 0.25);
      }
      @media (min-width: 768px) {
        .md\:shadow-xl {
          --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color),
            0 8px 10px -6px var(--tw-shadow-color);
          box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
            var(--tw-shadow);
        }
      }
    `)
  })
})

test('when no utilities that need the defaults are used', async () => {
  let config = {
    content: [{ raw: html`<div class=""></div>` }],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let input = css`
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      *,
      ::before,
      ::after,
      ::backdrop {
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
      }

      /* --- */
    `)
  })
})

test('when a utility uses defaults but they do not exist', async () => {
  let config = {
    content: [{ raw: html`<div class="rotate-3"></div>` }],
    corePlugins: ['rotate'],
  }

  let input = css`
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      /* --- */
      .rotate-3 {
        --tw-rotate: 3deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})

test('selectors are reduced to the lowest possible specificity', async () => {
  let config = {
    experimental: { optimizeUniversalDefaults: true },
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: [],
  }

  let input = css`
    @defaults test {
      --color: black;
    }

    /* --- */

    .foo {
      @defaults test;
      background-color: var(--color);
    }

    #app {
      @defaults test;
      border-color: var(--color);
    }

    span#page {
      @defaults test;
      color: var(--color);
    }

    div[data-foo='bar']#other {
      @defaults test;
      fill: var(--color);
    }

    div[data-bar='baz'] {
      @defaults test;
      stroke: var(--color);
    }

    article {
      @defaults test;
      --article: var(--color);
    }

    div[data-foo='bar']#another::before {
      @defaults test;
      fill: var(--color);
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo,
      [id='app'],
      [id='page'],
      [id='other'],
      [data-bar='baz'],
      article,
      [id='another']::before {
        --color: black;
      }

      /* --- */

      .foo {
        background-color: var(--color);
      }

      #app {
        border-color: var(--color);
      }

      span#page {
        color: var(--color);
      }

      div[data-foo='bar']#other {
        fill: var(--color);
      }

      div[data-bar='baz'] {
        stroke: var(--color);
      }

      article {
        --article: var(--color);
      }

      div[data-foo='bar']#another::before {
        fill: var(--color);
      }
    `)
  })
})

test('No defaults without @tailwind base', () => {
  let config = {
    experimental: { optimizeUniversalDefaults: true },
    content: [{ raw: html`<div class="scale-150"></div>` }],
    corePlugins: { preflight: false },
  }

  // Optimize universal defaults doesn't work well with isolated modules
  // We require you to use @tailwind base to inject the defaults
  let input = css`
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .scale-150 {
        --tw-scale-x: 1.5;
        --tw-scale-y: 1.5;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})

test('no defaults and apply without @tailwind base', () => {
  let config = {
    experimental: { optimizeUniversalDefaults: true },
    content: [{ raw: html`<div class="my-card"></div>` }],
    corePlugins: { preflight: false },
  }

  // Optimize universal defaults doesn't work well with isolated modules
  // We require you to use @tailwind base to inject the defaults
  let input = css`
    @tailwind components;
    @tailwind utilities;

    .my-card {
      @apply scale-150;
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .my-card {
        --tw-scale-x: 1.5;
        --tw-scale-y: 1.5;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})
