import resolveConfig from '../src/public/resolve-config'
import { createContext } from '../src/lib/setupContextUtils'

import { run, html, css } from './util/run'

test('partial arbitrary variants', () => {
  let config = {
    content: [
      {
        raw: html`<div class="potato-[yellow]:bg-yellow-200 potato-[baked]:w-3"></div> `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('potato', (flavor) => `.potato-${flavor} &`)
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
    content: [
      {
        raw: html`<div class="potato-[yellow]:bg-yellow-200 potato-[baked]:w-3"></div> `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('potato', (flavor) => `@media (potato: ${flavor})`)
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
    content: [
      {
        raw: html`<div class="potato-[yellow]:bg-yellow-200 potato-[baked]:w-3"></div> `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('potato', (flavor) => `@media (potato: ${flavor}) { &:potato }`)
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
    content: [
      {
        raw: html`<div class="tooltip-bottom:mt-2 tooltip-top:mb-2"></div>`,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('tooltip', (side) => `&${side}`, {
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
        matchVariant('alphabet', (side) => `&${side}`, {
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
      .alphabet-a\:underline[data-value='a'],
      .alphabet-b\:underline[data-value='b'],
      .alphabet-c\:underline[data-value='c'],
      .alphabet-d\:underline[data-value='d'] {
        text-decoration-line: underline;
      }
    `)
  })
})

test('matchVariant can return an array of format strings from the function', () => {
  let config = {
    content: [
      {
        raw: html`<div class="test-[a,b,c]:underline"></div>`,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('test', (selector) =>
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
      .test-\[a\,b\,c\]\:underline.a > *,
      .test-\[a\,b\,c\]\:underline.b > *,
      .test-\[a\,b\,c\]\:underline.c > * {
        text-decoration-line: underline;
      }
    `)
  })
})

it('should be possible to sort variants', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="testmin-[500px]:underline testmin-[700px]:italic"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
          sort(a, z) {
            return parseInt(a.value) - parseInt(z.value)
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
        .testmin-\[500px\]\:underline {
          text-decoration-line: underline;
        }
      }
      @media (min-width: 700px) {
        .testmin-\[700px\]\:italic {
          font-style: italic;
        }
      }
    `)
  })
})

it('should be possible to compare arbitrary variants and hardcoded variants', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="testmin-[700px]:italic testmin-example:italic testmin-[500px]:italic"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
          values: {
            example: '600px',
          },
          sort(a, z) {
            return parseInt(a.value) - parseInt(z.value)
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
        .testmin-\[500px\]\:italic {
          font-style: italic;
        }
      }
      @media (min-width: 600px) {
        .testmin-example\:italic {
          font-style: italic;
        }
      }
      @media (min-width: 700px) {
        .testmin-\[700px\]\:italic {
          font-style: italic;
        }
      }
    `)
  })
})

it('should be possible to sort stacked arbitrary variants correctly', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <!-- 4 -->
            <div class="testmin-[150px]:testmax-[400px]:underline"></div>
            <!-- 2 -->
            <div class="testmin-[100px]:testmax-[350px]:underline"></div>
            <!-- 1 -->
            <div class="testmin-[100px]:testmax-[300px]:underline"></div>
            <!-- 3 -->
            <div class="testmin-[100px]:testmax-[400px]:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
          sort(a, z) {
            return parseInt(a.value) - parseInt(z.value)
          },
        })

        matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
          sort(a, z) {
            return parseInt(z.value) - parseInt(a.value)
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
          .testmin-\[100px\]\:testmax-\[400px\]\:underline {
            text-decoration-line: underline;
          }
        }
        @media (max-width: 350px) {
          .testmin-\[100px\]\:testmax-\[350px\]\:underline {
            text-decoration-line: underline;
          }
        }
        @media (max-width: 300px) {
          .testmin-\[100px\]\:testmax-\[300px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }
      @media (min-width: 150px) {
        @media (max-width: 400px) {
          .testmin-\[150px\]\:testmax-\[400px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

it('should maintain sort from other variants, if sort functions of arbitrary variants return 0', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="testmin-[100px]:testmax-[200px]:focus:underline"></div>
            <div class="testmin-[100px]:testmax-[200px]:hover:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
          sort(a, z) {
            return parseInt(a.value) - parseInt(z.value)
          },
        })

        matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
          sort(a, z) {
            return parseInt(z.value) - parseInt(a.value)
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
          .testmin-\[100px\]\:testmax-\[200px\]\:hover\:underline:hover,
          .testmin-\[100px\]\:testmax-\[200px\]\:focus\:underline:focus {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

it('should sort arbitrary variants left to right (1)', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="testmin-[200px]:testmax-[400px]:underline"></div>
            <div class="testmin-[200px]:testmax-[300px]:underline"></div>
            <div class="testmin-[100px]:testmax-[400px]:underline"></div>
            <div class="testmin-[100px]:testmax-[300px]:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
          sort(a, z) {
            return parseInt(a.value) - parseInt(z.value)
          },
        })
        matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
          sort(a, z) {
            return parseInt(z.value) - parseInt(a.value)
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
          .testmin-\[100px\]\:testmax-\[400px\]\:underline {
            text-decoration-line: underline;
          }
        }
        @media (max-width: 300px) {
          .testmin-\[100px\]\:testmax-\[300px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }
      @media (min-width: 200px) {
        @media (max-width: 400px) {
          .testmin-\[200px\]\:testmax-\[400px\]\:underline {
            text-decoration-line: underline;
          }
        }
        @media (max-width: 300px) {
          .testmin-\[200px\]\:testmax-\[300px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

it('should sort arbitrary variants left to right (2)', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="testmax-[400px]:testmin-[200px]:underline"></div>
            <div class="testmax-[300px]:testmin-[200px]:underline"></div>
            <div class="testmax-[400px]:testmin-[100px]:underline"></div>
            <div class="testmax-[300px]:testmin-[100px]:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
          sort(a, z) {
            return parseInt(a.value) - parseInt(z.value)
          },
        })
        matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
          sort(a, z) {
            return parseInt(z.value) - parseInt(a.value)
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
          .testmax-\[400px\]\:testmin-\[100px\]\:underline {
            text-decoration-line: underline;
          }
        }
        @media (min-width: 200px) {
          .testmax-\[400px\]\:testmin-\[200px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }

      @media (max-width: 300px) {
        @media (min-width: 100px) {
          .testmax-\[300px\]\:testmin-\[100px\]\:underline {
            text-decoration-line: underline;
          }
        }
        @media (min-width: 200px) {
          .testmax-\[300px\]\:testmin-\[200px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

it('should guarantee that we are not passing values from other variants to the wrong function', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="testmin-[200px]:testmax-[400px]:underline"></div>
            <div class="testmin-[200px]:testmax-[300px]:underline"></div>
            <div class="testmin-[100px]:testmax-[400px]:underline"></div>
            <div class="testmin-[100px]:testmax-[300px]:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
          sort(a, z) {
            let lookup = ['100px', '200px']
            if (lookup.indexOf(a.value) === -1 || lookup.indexOf(z.value) === -1) {
              throw new Error('We are seeing values that should not be there!')
            }
            return lookup.indexOf(a.value) - lookup.indexOf(z.value)
          },
        })
        matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
          sort(a, z) {
            let lookup = ['300px', '400px']
            if (lookup.indexOf(a.value) === -1 || lookup.indexOf(z.value) === -1) {
              throw new Error('We are seeing values that should not be there!')
            }
            return lookup.indexOf(z.value) - lookup.indexOf(a.value)
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
          .testmin-\[100px\]\:testmax-\[400px\]\:underline {
            text-decoration-line: underline;
          }
        }

        @media (max-width: 300px) {
          .testmin-\[100px\]\:testmax-\[300px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }

      @media (min-width: 200px) {
        @media (max-width: 400px) {
          .testmin-\[200px\]\:testmax-\[400px\]\:underline {
            text-decoration-line: underline;
          }
        }

        @media (max-width: 300px) {
          .testmin-\[200px\]\:testmax-\[300px\]\:underline {
            text-decoration-line: underline;
          }
        }
      }
    `)
  })
})

it('should default to the DEFAULT value for variants', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="foo:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('foo', (value) => `.foo${value} &`, {
          values: {
            DEFAULT: '.bar',
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
      .foo.bar .foo\:underline {
        text-decoration-line: underline;
      }
    `)
  })
})

it('should not generate anything if the matchVariant does not have a DEFAULT value configured', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="foo:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('foo', (value) => `.foo${value} &`)
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css``)
  })
})

it('should be possible to use `null` as a DEFAULT value', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="foo:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('foo', (value) => `.foo${value === null ? '-good' : '-bad'} &`, {
          values: { DEFAULT: null },
        })
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo-good .foo\:underline {
        text-decoration-line: underline;
      }
    `)
  })
})

it('should be possible to use `undefined` as a DEFAULT value', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="foo:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('foo', (value) => `.foo${value === undefined ? '-good' : '-bad'} &`, {
          values: { DEFAULT: undefined },
        })
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo-good .foo\:underline {
        text-decoration-line: underline;
      }
    `)
  })
})

it('should be possible to use `undefined` as a DEFAULT value', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="foo:underline"></div>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      ({ matchVariant }) => {
        matchVariant('foo', (value) => `.foo${value === undefined ? '-good' : '-bad'} &`, {
          values: { DEFAULT: undefined },
        })
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo-good .foo\:underline {
        text-decoration-line: underline;
      }
    `)
  })
})

it('should not break things', () => {
  let config = {}

  let context = createContext(resolveConfig(config))
  let [[, fn]] = context.variantMap.get('group')

  let format

  expect(
    fn({
      format(input) {
        format = input
      },
    })
  ).toBe(undefined)

  expect(format).toBe(':merge(.group) &')
})
