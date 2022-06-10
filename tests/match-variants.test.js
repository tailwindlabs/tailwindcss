import { run, html, css } from './util/run'

test('partial arbitrary variants', () => {
  let config = {
    experimental: { matchVariant: true },
    content: [
      {
        raw: html`<div class="potato-[yellow]:bg-yellow-200 potato-[baked]:w-3"></div> `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant({
          potato: (flavor) => `.potato-${flavor} &`,
        })
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .potato-baked .potato-\[baked\]\:w-3 {
        width: 0.75rem;
      }

      .potato-yellow .potato-\[yellow\]\:bg-yellow-200 {
        --tw-bg-opacity: 1;
        background-color: rgb(254 240 138 / var(--tw-bg-opacity));
      }
    `)
  })
})

test('partial arbitrary variants with at-rules', () => {
  let config = {
    experimental: { matchVariant: true },
    content: [
      {
        raw: html`<div class="potato-[yellow]:bg-yellow-200 potato-[baked]:w-3"></div> `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant({
          potato: (flavor) => `@media (potato: ${flavor})`,
        })
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (potato: baked) {
        .potato-\[baked\]\:w-3 {
          width: 0.75rem;
        }
      }
      @media (potato: yellow) {
        .potato-\[yellow\]\:bg-yellow-200 {
          --tw-bg-opacity: 1;
          background-color: rgb(254 240 138 / var(--tw-bg-opacity));
        }
      }
    `)
  })
})

test('partial arbitrary variants with at-rules and placeholder', () => {
  let config = {
    experimental: { matchVariant: true },
    content: [
      {
        raw: html`<div class="potato-[yellow]:bg-yellow-200 potato-[baked]:w-3"></div> `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant({
          potato: (flavor) => `@media (potato: ${flavor}) { &:potato }`,
        })
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (potato: baked) {
        .potato-\[baked\]\:w-3:potato {
          width: 0.75rem;
        }
      }
      @media (potato: yellow) {
        .potato-\[yellow\]\:bg-yellow-200:potato {
          --tw-bg-opacity: 1;
          background-color: rgb(254 240 138 / var(--tw-bg-opacity));
        }
      }
    `)
  })
})

test('partial arbitrary variants with default values', () => {
  let config = {
    experimental: { matchVariant: true },
    content: [
      {
        raw: html`<div class="tooltip-bottom:mt-2 tooltip-top:mb-2"></div>`,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant(
          {
            tooltip: (side) => `&${side}`,
          },
          {
            values: {
              bottom: '[data-location="bottom"]',
              top: '[data-location="top"]',
            },
          }
        )
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .tooltip-bottom\:mt-2[data-location='bottom'] {
        margin-top: 0.5rem;
      }

      .tooltip-top\:mb-2[data-location='top'] {
        margin-bottom: 0.5rem;
      }
    `)
  })
})

test('matched variant values maintain the sort order they are registered in', () => {
  let config = {
    experimental: { matchVariant: true },
    content: [
      {
        raw: html`<div
          class="alphabet-c:underline alphabet-a:underline alphabet-d:underline alphabet-b:underline"
        ></div>`,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant(
          {
            alphabet: (side) => `&${side}`,
          },
          {
            values: {
              a: '[data-value="a"]',
              b: '[data-value="b"]',
              c: '[data-value="c"]',
              d: '[data-value="d"]',
            },
          }
        )
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .alphabet-a\:underline[data-value='a'] {
        text-decoration-line: underline;
      }

      .alphabet-b\:underline[data-value='b'] {
        text-decoration-line: underline;
      }

      .alphabet-c\:underline[data-value='c'] {
        text-decoration-line: underline;
      }

      .alphabet-d\:underline[data-value='d'] {
        text-decoration-line: underline;
      }
    `)
  })
})

test('matchVariant can return an array of format strings from the function', () => {
  let config = {
    experimental: { matchVariant: true },
    content: [
      {
        raw: html`<div class="test-[a,b,c]:underline"></div>`,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant({
          test: (selector) => selector.split(',').map((selector) => `&.${selector} > *`),
        })
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .test-\[a\2c b\2c c\]\:underline.a > * {
        text-decoration-line: underline;
      }

      .test-\[a\2c b\2c c\]\:underline.b > * {
        text-decoration-line: underline;
      }

      .test-\[a\2c b\2c c\]\:underline.c > * {
        text-decoration-line: underline;
      }
    `)
  })
})
