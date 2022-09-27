import { run, html, css } from './util/run'

let warn

beforeEach(() => {
  let log = require('../src/util/log')
  warn = jest.spyOn(log.default, 'warn')
})

afterEach(() => {
  warn.mockClear()
})

describe('@apply warnings', () => {
  it('does not warn for simple utilities', async () => {
    let config = {
      content: [{ raw: html`<div class="bar"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      @layer utilities {
        .foo {
          color: blue;
        }
      }
      .bar {
        @apply foo;
      }
    `

    await doesNotShowWarnings(run(input, config))
  })

  it('does not warn for simple utilities with simple variants', async () => {
    let config = {
      content: [{ raw: html`<div class="bar"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      @layer utilities {
        .foo {
          color: blue;
        }
      }
      .bar {
        @apply hover:foo;
      }
    `

    await doesNotShowWarnings(run(input, config))
  })

  it('does not warn for simple utilities with complex variants', async () => {
    let config = {
      content: [{ raw: html`<div class="bar"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      @layer utilities {
        .foo {
          color: blue;
        }
      }
      .bar {
        @apply group-hover:foo;
      }
    `

    await doesNotShowWarnings(run(input, config))
  })

  it('does not warn when matching rules with multiple simple selectors without multiple classes', async () => {
    let config = {
      content: [{ raw: html`<div class="bar"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      @layer utilities {
        header .foo {
          color: blue;
        }
      }
      .bar {
        @apply foo;
      }
    `

    await doesNotShowWarnings(run(input, config))
  })

  it('does not warn when using pseudo elements in a utility', async () => {
    let config = {
      content: [{ raw: html`<div class="bar"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      .bar {
        @apply placeholder-blue-600;
      }
    `

    await doesNotShowWarnings(run(input, config))
  })

  it('does not warn when using pseudo elements from variants', async () => {
    let config = {
      content: [{ raw: html`<div class="bar"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      .bar {
        @apply placeholder:text-blue-600;
      }
    `

    await doesNotShowWarnings(run(input, config))
  })

  it('does not warn when using built in utilities that have multiple selector components', async () => {
    let config = {
      content: [{ raw: html`<div class="bar baz"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      .bar {
        @apply divide-x-4;
      }
      .baz {
        @apply space-x-4;
      }
    `

    await doesNotShowWarnings(run(input, config))
  })

  it('does not warn when using an important selector', async () => {
    let config = {
      important: '.myapp',
      content: [{ raw: html`<div class="bar"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      .baz {
        @apply underline;
      }
    `

    await doesNotShowWarnings(run(input, config))
  })

  it('warns when matching multiple rules', async () => {
    let config = {
      content: [{ raw: html`<div class="bar"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      @layer utilities {
        .foo {
          color: blue;
        }
        .foo {
          background: green;
        }
      }
      .bar {
        @apply foo;
      }
    `

    // TODO: This is showing multiple warnings for the same thing, which is not ideal
    await showsWarnings(run(input, config), [/multiple-rules/, /multiple-rules/])
  })

  it('warns when matching rules that extend built in utilities', async () => {
    let config = {
      content: [{ raw: html`<div class="bar"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      @layer utilities {
        header .bg-red-500 {
          text-decoration: underline;
        }
      }
      .bar {
        @apply bg-red-500;
      }
    `

    // TODO: This is showing multiple warnings for the same thing, which is not ideal
    await showsWarnings(run(input, config), [/multiple-rules/, /multiple-rules/])
  })

  it('warns when matching rules with multiple of the same class', async () => {
    let config = {
      content: [{ raw: html`<div class="bar"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      @layer utilities {
        .foo .foo {
          color: blue;
        }
      }
      .bar {
        @apply foo;
      }
    `

    // TODO: This is showing multiple warnings for the same thing, which is not ideal
    await showsWarnings(run(input, config), [/multiple-classes/, /multiple-classes/])
  })

  it('warns when matching rules with multiple different classes', async () => {
    let config = {
      content: [{ raw: html`<div class="bar"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      @layer utilities {
        .foo .baz {
          color: blue;
        }
      }
      .bar {
        @apply foo;
      }
    `

    // TODO: This is showing multiple warnings for the same thing, which is not ideal
    await showsWarnings(run(input, config), [/multiple-classes/, /multiple-classes/])
  })

  it('warns when matching rules with multiple selectors', async () => {
    let config = {
      content: [{ raw: html`<div class="bar"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      @layer utilities {
        .foo,
        .baz {
          color: blue;
        }
      }
      .bar {
        @apply foo;
      }
    `

    // TODO: This is showing multiple warnings for the same thing, which is not ideal
    await showsWarnings(run(input, config), [/multiple-selectors/, /multiple-selectors/])
  })

  it('warns when using multiple classes when one is inside :has()', async () => {
    let config = {
      content: [{ raw: html`<div class="bar"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      @layer utilities {
        .foo:has(.baz) {
          color: blue;
        }
      }
      .bar {
        @apply foo;
      }
    `

    // TODO: This is showing multiple warnings for the same thing, which is not ideal
    await showsWarnings(run(input, config), [/multiple-classes/, /multiple-classes/])
  })

  it('warns when nested applies are encountered', async () => {
    let config = {
      content: [{ raw: html`<div class="qux"></div>` }],
      plugins: [],
    }

    let input = css`
      @tailwind utilities;
      @layer utilities {
        .foo {
          color: red;
        }
        .bar {
          @apply foo;
        }
        .baz {
          @apply bar;
        }
      }
      .qux {
        @apply baz;
      }
    `

    await showsWarnings(run(input, config), [/nested expansion/, /nested expansion/])
  })
})

async function showsWarnings(promise, expectedWarnings) {
  let result = await promise

  let warnings = []

  // Surface warnings from PostCSS
  warnings = warnings.concat(
    result.messages.filter((msg) => msg.type === 'warning').map((msg) => msg.text)
  )

  // Surface warnings from our logger
  warnings = warnings.concat(warn.mock.calls.map((x) => x[0]))

  // Ignore the `content-problems` warning because it's not relevant to this test
  warnings = warnings.filter((x) => !x.includes('content-problems'))

  expect(warnings).toHaveLength(expectedWarnings.length)

  for (let [index, actual] of warnings.entries()) {
    expect(actual).toMatch(expectedWarnings[index])
  }
}

async function doesNotShowWarnings(promise) {
  await showsWarnings(promise, [])
}
