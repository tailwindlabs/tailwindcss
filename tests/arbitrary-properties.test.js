import { run, html, css, defaults } from './util/run'

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
      ${defaults}
      .\[paint-order\:markers\] {
        paint-order: markers;
      }
    `)
  })
})

test('different arbitrary properties are picked up separately', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[foo:bar] [bar:baz]"></div>`,
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
      ${defaults}
      .\[bar\:baz\] {
        bar: baz;
      }
      .\[foo\:bar\] {
        foo: bar;
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
      ${defaults}
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
      ${defaults}
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
      ${defaults}
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
      ${defaults}
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
      ${defaults}
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
      ${defaults}
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
      ${defaults}
      .\[background-image\:url\(http\:\/\/example\.com\/picture\.jpg\)\] {
        background-image: url('http://example.com/picture.jpg');
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
    expect(result.css).toMatchFormattedCss(css`
      ${defaults}
    `)
  })
})

test('invalid arbitrary property', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[autoplay:\${autoplay}]"></div>`,
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
      ${defaults}
    `)
  })
})

test('invalid arbitrary property 2', () => {
  let config = {
    content: [
      {
        raw: html`[0:02]`,
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
      ${defaults}
    `)
  })
})

test('using fractional spacing values inside theme() function', () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="[border:_calc(5vw_-_theme(spacing[2.5]))_double_theme('colors.fuchsia.700')]"
        ></div>`,
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
      ${defaults}
      .\[border\:_calc\(5vw_-_theme\(spacing\[2\.5\]\)\)_double_theme\(\'colors\.fuchsia\.700\'\)\] {
        border: calc(5vw - 0.625rem) double #a21caf;
      }
    `)
  })
})

test('using multiple arbitrary props having fractional spacing values', () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="[height:_calc(100vh_-_theme(spacing[2.5]))] [box-shadow:_0_calc(theme(spacing[0.5])_*_-1)_theme(colors.red.400)_inset]"
        ></div>`,
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
    return expect(result.css).toMatchFormattedCss(css`
      ${defaults}
      .\[box-shadow\:_0_calc\(theme\(spacing\[0\.5\]\)_\*_-1\)_theme\(colors\.red\.400\)_inset\] {
        box-shadow: inset 0 -0.125rem #f87171;
      }
      .\[height\:_calc\(100vh_-_theme\(spacing\[2\.5\]\)\)\] {
        height: calc(100vh - 0.625rem);
      }
    `)
  })
})

it('should be possible to read theme values in arbitrary properties (without quotes)', () => {
  let config = {
    content: [{ raw: html`<div class="[--a:theme(colors.blue.500)] [color:var(--a)]"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      ${defaults}
      .\[--a\:theme\(colors\.blue\.500\)\] {
        --a: #3b82f6;
      }
      .\[color\:var\(--a\)\] {
        color: var(--a);
      }
    `)
  })
})

it('should be possible to read theme values in arbitrary properties (with quotes)', () => {
  let config = {
    content: [{ raw: html`<div class="[color:var(--a)] [--a:theme('colors.blue.500')]"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      ${defaults}
      .\[--a\:theme\(\'colors\.blue\.500\'\)\] {
        --a: #3b82f6;
      }
      .\[color\:var\(--a\)\] {
        color: var(--a);
      }
    `)
  })
})

it('should not generate invalid CSS', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="[https://en.wikipedia.org/wiki]"></div>
          <div class="[http://example.org]"></div>
          <div class="[http://example]"></div>
          <div class="[ftp://example]"></div>
          <div class="[stillworks:/example]"></div>
        `,

        // NOTE: In this case `stillworks:/example` being generated is not ideal
        // but it at least doesn't produce invalid CSS when run through prettier
        // So we can let it through since it is technically valid
      },
    ],
    corePlugins: { preflight: false },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .\[stillworks\:\/example\] {
        stillworks: /example;
      }
    `)
  })
})
