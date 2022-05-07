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
