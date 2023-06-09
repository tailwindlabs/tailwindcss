import parseObjectStyles from '../src/util/parseObjectStyles'
import postcss from 'postcss'
import { css } from './util/run'

function toCss(nodes) {
  return postcss.root({ nodes }).toString()
}

test('it parses simple single class definitions', () => {
  let result = parseObjectStyles({
    '.foobar': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
    },
  })

  expect(toCss(result)).toMatchFormattedCss(css`
    .foobar {
      background-color: red;
      color: white;
      padding: 1rem;
    }
  `)
})

test('it parses multiple class definitions', () => {
  let result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
    },
    '.bar': {
      width: '200px',
      height: '100px',
    },
  })

  expect(toCss(result)).toMatchFormattedCss(css`
    .foo {
      background-color: red;
      color: white;
      padding: 1rem;
    }
    .bar {
      width: 200px;
      height: 100px;
    }
  `)
})

test('it parses nested pseudo-selectors', () => {
  let result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      '&:hover': {
        backgroundColor: 'orange',
      },
      '&:focus': {
        backgroundColor: 'blue',
      },
    },
  })

  expect(toCss(result)).toMatchFormattedCss(css`
    .foo {
      background-color: red;
      color: white;
      padding: 1rem;
    }
    .foo:hover {
      background-color: orange;
    }
    .foo:focus {
      background-color: blue;
    }
  `)
})

test('it parses top-level media queries', () => {
  let result = parseObjectStyles({
    '@media (min-width: 200px)': {
      '.foo': {
        backgroundColor: 'orange',
      },
    },
  })

  expect(toCss(result)).toMatchFormattedCss(css`
    @media (min-width: 200px) {
      .foo {
        background-color: orange;
      }
    }
  `)
})

test('it parses nested media queries', () => {
  let result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      '@media (min-width: 200px)': {
        backgroundColor: 'orange',
      },
    },
  })

  expect(toCss(result)).toMatchFormattedCss(css`
    .foo {
      background-color: red;
      color: white;
      padding: 1rem;
    }
    @media (min-width: 200px) {
      .foo {
        background-color: orange;
      }
    }
  `)
})

test('it bubbles nested screen rules', () => {
  let result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      '@screen sm': {
        backgroundColor: 'orange',
      },
    },
  })

  expect(toCss(result)).toMatchFormattedCss(css`
    .foo {
      background-color: red;
      color: white;
      padding: 1rem;
    }
    @screen sm {
      .foo {
        background-color: orange;
      }
    }
  `)
})

test('it parses pseudo-selectors in nested media queries', () => {
  let result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      '&:hover': {
        '@media (min-width: 200px)': {
          backgroundColor: 'orange',
        },
      },
    },
  })

  expect(toCss(result)).toMatchFormattedCss(css`
    .foo {
      background-color: red;
      color: white;
      padding: 1rem;
    }
    @media (min-width: 200px) {
      .foo:hover {
        background-color: orange;
      }
    }
  `)
})

test('it parses descendant selectors', () => {
  let result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      '.bar': {
        backgroundColor: 'orange',
      },
    },
  })

  expect(toCss(result)).toMatchFormattedCss(css`
    .foo {
      background-color: red;
      color: white;
      padding: 1rem;
    }
    .foo .bar {
      background-color: orange;
    }
  `)
})

test('it parses nested multi-class selectors', () => {
  let result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      '&.bar': {
        backgroundColor: 'orange',
      },
    },
  })

  expect(toCss(result)).toMatchFormattedCss(css`
    .foo {
      background-color: red;
      color: white;
      padding: 1rem;
    }
    .foo.bar {
      background-color: orange;
    }
  `)
})

test('it parses nested multi-class selectors in media queries', () => {
  let result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      '@media (min-width: 200px)': {
        '&.bar': {
          backgroundColor: 'orange',
        },
      },
    },
  })

  expect(toCss(result)).toMatchFormattedCss(css`
    .foo {
      background-color: red;
      color: white;
      padding: 1rem;
    }
    @media (min-width: 200px) {
      .foo.bar {
        background-color: orange;
      }
    }
  `)
})

test('it strips empty selectors when nesting', () => {
  let result = parseObjectStyles({
    '.foo': {
      '.bar': {
        backgroundColor: 'orange',
      },
    },
  })

  expect(toCss(result)).toMatchFormattedCss(css`
    .foo .bar {
      background-color: orange;
    }
  `)
})

test('it can parse an array of styles', () => {
  let result = parseObjectStyles([
    {
      '.foo': {
        backgroundColor: 'orange',
      },
    },
    {
      '.bar': {
        backgroundColor: 'red',
      },
    },
    {
      '.foo': {
        backgroundColor: 'blue',
      },
    },
  ])

  expect(toCss(result)).toMatchFormattedCss(css`
    .foo {
      background-color: orange;
    }
    .bar {
      background-color: red;
    }
    .foo {
      background-color: blue;
    }
  `)
})

test('custom properties preserve their case', () => {
  let result = parseObjectStyles({
    ':root': {
      '--colors-aColor-500': '0',
    },
  })

  expect(toCss(result)).toMatchFormattedCss(css`
    :root {
      --colors-aColor-500: 0;
    }
  `)
})
