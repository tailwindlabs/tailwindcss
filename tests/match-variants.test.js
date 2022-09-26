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
        matchVariant('potato', ({ value: flavor }) => `.potato-${flavor} &`)
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
        matchVariant('potato', ({ value: flavor }) => `@media (potato: ${flavor})`)
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
        matchVariant('potato', ({ value: flavor }) => `@media (potato: ${flavor}) { &:potato }`)
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
        matchVariant('tooltip', ({ value: side }) => `&${side}`, {
          values: {
            bottom: '[data-location="bottom"]',
            top: '[data-location="top"]',
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
        matchVariant('alphabet', ({ value: side }) => `&${side}`, {
          values: {
            a: '[data-value="a"]',
            b: '[data-value="b"]',
            c: '[data-value="c"]',
            d: '[data-value="d"]',
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
        matchVariant('test', ({ value: selector }) =>
          selector.split(',').map((selector) => `&.${selector} > *`)
        )
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

it('should be possible to sort variants', () => {
  let config = {
    experimental: { matchVariant: true },
    content: [
      {
        raw: html`
          <div>
            <div class="min-[500px]:underline min-[700px]:italic"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('min', ({ value }) => `@media (min-width: ${value})`, {
          sort(a, z) {
            return parseInt(a) - parseInt(z)
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
      @media (min-width: 500px) {
        .min-\[500px\]\:underline {
          text-decoration-line: underline;
        }
      }

      @media (min-width: 700px) {
        .min-\[700px\]\:italic {
          font-style: italic;
        }
      }
    `)
  })
})

it('should be possible to compare arbitrary variants and hardcoded variants', () => {
  let config = {
    experimental: { matchVariant: true },
    content: [
      {
        raw: html`
          <div>
            <div class="min-[700px]:italic min-example:italic min-[500px]:italic"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('min', ({ value }) => `@media (min-width: ${value})`, {
          values: {
            example: '600px',
          },
          sort(a, z) {
            return parseInt(a) - parseInt(z)
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
      @media (min-width: 500px) {
        .min-\[500px\]\:italic {
          font-style: italic;
        }
      }

      @media (min-width: 600px) {
        .min-example\:italic {
          font-style: italic;
        }
      }

      @media (min-width: 700px) {
        .min-\[700px\]\:italic {
          font-style: italic;
        }
      }
    `)
  })
})

it('should be possible to sort stacked arbitrary variants correctly', () => {
  let config = {
    experimental: { matchVariant: true },
    content: [
      {
        raw: html`
          <div>
            <!-- 4 -->
            <div class="min-[150px]:max-[400px]:underline"></div>
            <!-- 2 -->
            <div class="min-[100px]:max-[350px]:underline"></div>
            <!-- 1 -->
            <div class="min-[100px]:max-[300px]:underline"></div>
            <!-- 3 -->
            <div class="min-[100px]:max-[400px]:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('min', ({ value }) => `@media (min-width: ${value})`, {
          sort(a, z) {
            return parseInt(a) - parseInt(z)
          },
        })

        matchVariant('max', ({ value }) => `@media (max-width: ${value})`, {
          sort(a, z) {
            return parseInt(z) - parseInt(a)
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
      @media (min-width: 100px) {
        @media (max-width: 400px) {
          .min-\[100px\]\:max-\[400px\]\:underline {
            text-decoration-line: underline;
          }
        }
        @media (max-width: 350px) {
          .min-\[100px\]\:max-\[350px\]\:underline {
            text-decoration-line: underline;
          }
        }
        @media (max-width: 300px) {
          .min-\[100px\]\:max-\[300px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }

      @media (min-width: 150px) {
        @media (max-width: 400px) {
          .min-\[150px\]\:max-\[400px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

it('should maintain sort from other variants, if sort functions of arbitrary variants return 0', () => {
  let config = {
    experimental: { matchVariant: true },
    content: [
      {
        raw: html`
          <div>
            <div class="min-[100px]:max-[200px]:focus:underline"></div>
            <div class="min-[100px]:max-[200px]:hover:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('min', ({ value }) => `@media (min-width: ${value})`, {
          sort(a, z) {
            return parseInt(a) - parseInt(z)
          },
        })

        matchVariant('max', ({ value }) => `@media (max-width: ${value})`, {
          sort(a, z) {
            return parseInt(z) - parseInt(a)
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
      @media (min-width: 100px) {
        @media (max-width: 200px) {
          .min-\[100px\]\:max-\[200px\]\:hover\:underline:hover {
            text-decoration-line: underline;
          }
          .min-\[100px\]\:max-\[200px\]\:focus\:underline:focus {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

it('should sort arbitrary variants left to right (1)', () => {
  let config = {
    experimental: { matchVariant: true },
    content: [
      {
        raw: html`
          <div>
            <div class="min-[200px]:max-[400px]:underline"></div>
            <div class="min-[200px]:max-[300px]:underline"></div>
            <div class="min-[100px]:max-[400px]:underline"></div>
            <div class="min-[100px]:max-[300px]:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('min', ({ value }) => `@media (min-width: ${value})`, {
          sort(a, z) {
            return parseInt(a) - parseInt(z)
          },
        })
        matchVariant('max', ({ value }) => `@media (max-width: ${value})`, {
          sort(a, z) {
            return parseInt(z) - parseInt(a)
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
      @media (min-width: 100px) {
        @media (max-width: 400px) {
          .min-\[100px\]\:max-\[400px\]\:underline {
            text-decoration-line: underline;
          }
        }

        @media (max-width: 300px) {
          .min-\[100px\]\:max-\[300px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }

      @media (min-width: 200px) {
        @media (max-width: 400px) {
          .min-\[200px\]\:max-\[400px\]\:underline {
            text-decoration-line: underline;
          }
        }

        @media (max-width: 300px) {
          .min-\[200px\]\:max-\[300px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

it('should sort arbitrary variants left to right (2)', () => {
  let config = {
    experimental: { matchVariant: true },
    content: [
      {
        raw: html`
          <div>
            <div class="max-[400px]:min-[200px]:underline"></div>
            <div class="max-[300px]:min-[200px]:underline"></div>
            <div class="max-[400px]:min-[100px]:underline"></div>
            <div class="max-[300px]:min-[100px]:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('min', ({ value }) => `@media (min-width: ${value})`, {
          sort(a, z) {
            return parseInt(a) - parseInt(z)
          },
        })
        matchVariant('max', ({ value }) => `@media (max-width: ${value})`, {
          sort(a, z) {
            return parseInt(z) - parseInt(a)
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
      @media (max-width: 400px) {
        @media (min-width: 100px) {
          .max-\[400px\]\:min-\[100px\]\:underline {
            text-decoration-line: underline;
          }
        }
        @media (min-width: 200px) {
          .max-\[400px\]\:min-\[200px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }

      @media (max-width: 300px) {
        @media (min-width: 100px) {
          .max-\[300px\]\:min-\[100px\]\:underline {
            text-decoration-line: underline;
          }
        }
        @media (min-width: 200px) {
          .max-\[300px\]\:min-\[200px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

it('should guarantee that we are not passing values from other variants to the wrong function', () => {
  let config = {
    experimental: { matchVariant: true },
    content: [
      {
        raw: html`
          <div>
            <div class="min-[200px]:max-[400px]:underline"></div>
            <div class="min-[200px]:max-[300px]:underline"></div>
            <div class="min-[100px]:max-[400px]:underline"></div>
            <div class="min-[100px]:max-[300px]:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('min', ({ value }) => `@media (min-width: ${value})`, {
          sort(a, z) {
            let lookup = ['100px', '200px']
            if (lookup.indexOf(a) === -1 || lookup.indexOf(z) === -1) {
              throw new Error('We are seeing values that should not be there!')
            }
            return lookup.indexOf(a) - lookup.indexOf(z)
          },
        })
        matchVariant('max', ({ value }) => `@media (max-width: ${value})`, {
          sort(a, z) {
            let lookup = ['300px', '400px']
            if (lookup.indexOf(a) === -1 || lookup.indexOf(z) === -1) {
              throw new Error('We are seeing values that should not be there!')
            }
            return lookup.indexOf(z) - lookup.indexOf(a)
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
      @media (min-width: 100px) {
        @media (max-width: 400px) {
          .min-\[100px\]\:max-\[400px\]\:underline {
            text-decoration-line: underline;
          }
        }

        @media (max-width: 300px) {
          .min-\[100px\]\:max-\[300px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }

      @media (min-width: 200px) {
        @media (max-width: 400px) {
          .min-\[200px\]\:max-\[400px\]\:underline {
            text-decoration-line: underline;
          }
        }

        @media (max-width: 300px) {
          .min-\[200px\]\:max-\[300px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})
