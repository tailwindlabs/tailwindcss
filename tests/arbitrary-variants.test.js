import { run, html, css, defaults } from './util/run'

test('basic arbitrary variants', () => {
  let config = {
    content: [{ raw: html`<div class="[&>*]:underline"></div>` }],
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

      .\[\&\>\*\]\:underline > * {
        text-decoration-line: underline;
      }
    `)
  })
})

test('spaces in selector (using _)', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[.a.b_&]:underline"></div>`,
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

      .a.b .\[\.a\.b_\&\]\:underline {
        text-decoration-line: underline;
      }
    `)
  })
})

test('arbitrary variants with modifiers', () => {
  let config = {
    content: [{ raw: html`<div class="dark:lg:hover:[&>*]:underline"></div>` }],
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
          .dark\:lg\:hover\:\[\&\>\*\]\:underline > *:hover {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

test('variants without & or an at-rule are ignored', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="[div]:underline"></div>
          <div class="[:hover]:underline"></div>
          <div class="[wtf-bbq]:underline"></div>
          <div class="[lol]:hover:underline"></div>
        `,
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

test('arbitrary variants are sorted after other variants', () => {
  let config = {
    content: [{ raw: html`<div class="[&>*]:underline underline lg:underline"></div>` }],
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

      .underline {
        text-decoration-line: underline;
      }

      @media (min-width: 1024px) {
        .lg\:underline {
          text-decoration-line: underline;
        }
      }

      .\[\&\>\*\]\:underline > * {
        text-decoration-line: underline;
      }
    `)
  })
})

test('using the important modifier', () => {
  let config = {
    content: [{ raw: html`<div class="[&>*]:!underline"></div>` }],
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

      .\[\&\>\*\]\:\!underline > * {
        text-decoration-line: underline !important;
      }
    `)
  })
})

test('at-rules', () => {
  let config = {
    content: [{ raw: html`<div class="[@supports(what:ever)]:underline"></div>` }],
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

      @supports (what: ever) {
        .\[\@supports\(what\:ever\)\]\:underline {
          text-decoration-line: underline;
        }
      }
    `)
  })
})

test('nested at-rules', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[@media_screen{@media(hover:hover)}]:underline"></div>`,
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

      @media screen {
        @media (hover: hover) {
          .\[\@media_screen\{\@media\(hover\:hover\)\}\]\:underline {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

test('at-rules with selector modifications', () => {
  let config = {
    content: [{ raw: html`<div class="[@media(hover:hover){&:hover}]:underline"></div>` }],
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

      @media (hover: hover) {
        .\[\@media\(hover\:hover\)\{\&\:hover\}\]\:underline:hover {
          text-decoration-line: underline;
        }
      }
    `)
  })
})

test('nested at-rules with selector modifications', () => {
  let config = {
    content: [
      {
        raw: html`<div class="[@media_screen{@media(hover:hover){&:hover}}]:underline"></div>`,
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

      @media screen {
        @media (hover: hover) {
          .\[\@media_screen\{\@media\(hover\:hover\)\{\&\:hover\}\}\]\:underline:hover {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

test('attribute selectors', () => {
  let config = {
    content: [{ raw: html`<div class="[&[data-open]]:underline"></div>` }],
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

      .\[\&\[data-open\]\]\:underline[data-open] {
        text-decoration-line: underline;
      }
    `)
  })
})

test('multiple attribute selectors', () => {
  let config = {
    content: [{ raw: html`<div class="[&[data-foo][data-bar]:not([data-baz])]:underline"></div>` }],
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

      .\[\&\[data-foo\]\[data-bar\]\:not\(\[data-baz\]\)\]\:underline[data-foo][data-bar]:not([data-baz]) {
        text-decoration-line: underline;
      }
    `)
  })
})

test('multiple attribute selectors with custom separator (1)', () => {
  let config = {
    separator: '__',
    content: [
      { raw: html`<div class="[&[data-foo][data-bar]:not([data-baz])]__underline"></div>` },
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

      .\[\&\[data-foo\]\[data-bar\]\:not\(\[data-baz\]\)\]__underline[data-foo][data-bar]:not([data-baz]) {
        text-decoration-line: underline;
      }
    `)
  })
})

test('multiple attribute selectors with custom separator (2)', () => {
  let config = {
    separator: '_@',
    content: [
      { raw: html`<div class="[&[data-foo][data-bar]:not([data-baz])]_@underline"></div>` },
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

      .\[\&\[data-foo\]\[data-bar\]\:not\(\[data-baz\]\)\]_\@underline[data-foo][data-bar]:not([data-baz]) {
        text-decoration-line: underline;
      }
    `)
  })
})

test('with @apply', () => {
  let config = {
    content: [
      {
        raw: html`<div class="foo"></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    .foo {
      @apply [@media_screen{@media(hover:hover){&:hover}}]:underline;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults}

      @media screen {
        @media (hover: hover) {
          .foo:hover {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

test('partial arbitrary variants', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="container-[sidebar] container-type-inline-size">
            <div class="contain-[sidebar,min:500px]:flex"></div>
            <div class="contain-[sidebar,max:500px]:flex"></div>
            <div class="contain-[min:500px]:flex"></div>
            <div class="contain-[max:500px]:flex"></div>
            <div class="contain-[500px]:flex"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ addUtilities, matchVariant, matchUtilities }) => {
        addUtilities({
          '.container-type-size': { 'container-type': 'size' },
          '.container-type-inline-size': { 'container-type': 'inline-size' },
          '.container-type-block-size': { 'container-type': 'block-size' },
          '.container-type-style': { 'container-type': 'style' },
          '.container-type-state': { 'container-type': 'state' },
        })

        matchUtilities({
          container: (value) => {
            return {
              'container-name': value,
            }
          },
        })

        matchVariant({
          contain: (args) => {
            if (args.includes(',')) {
              let [name, query] = args.split(',')
              let [type, value] = query.split(':')
              return `@container ${name} (${
                { min: 'min-width', max: 'max-width' }[type]
              }: ${value})`
            } else if (args.includes(':')) {
              let [type, value] = args.split(':')
              return `@container (${{ min: 'min-width', max: 'max-width' }[type]}: ${value})`
            } else {
              return `@container (min-width: ${args})`
            }
          },
        })
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .container-type-inline-size {
        container-type: inline-size;
      }

      .container-\[sidebar\] {
        container-name: sidebar;
      }

      @container sidebar (min-width: 500px) {
        .contain-\[sidebar\2c min\:500px\]\:flex {
          display: flex;
        }
      }

      @container sidebar (max-width: 500px) {
        .contain-\[sidebar\2c max\:500px\]\:flex {
          display: flex;
        }
      }

      @container (min-width: 500px) {
        .contain-\[min\:500px\]\:flex {
          display: flex;
        }
      }

      @container (max-width: 500px) {
        .contain-\[max\:500px\]\:flex {
          display: flex;
        }
      }

      @container (min-width: 500px) {
        .contain-\[500px\]\:flex {
          display: flex;
        }
      }
    `)
  })
})
