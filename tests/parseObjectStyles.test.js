import parseObjectStyles from '../src/util/parseObjectStyles'
import postcss from 'postcss'

function css(nodes) {
  return postcss.root({ nodes }).toString()
}

test('it parses simple single class definitions', () => {
  const result = parseObjectStyles({
    '.foobar': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
    },
  })

  expect(css(result)).toMatchCss(`
    .foobar {
      background-color: red;
      color: white;
      padding: 1rem
    }
  `)
})

test('it parses multiple class definitions', () => {
  const result = parseObjectStyles({
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

  expect(css(result)).toMatchCss(`
    .foo {
      background-color: red;
      color: white;
      padding: 1rem
    }
    .bar {
      width: 200px;
      height: 100px
    }
  `)
})

test('it parses nested pseudo-selectors', () => {
  const result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      ':hover': {
        backgroundColor: 'orange',
      },
      ':focus': {
        backgroundColor: 'blue',
      },
    },
  })

  expect(css(result)).toMatchCss(`
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
  const result = parseObjectStyles({
    '@media (min-width: 200px)': {
      '.foo': {
        backgroundColor: 'orange',
      },
    },
  })

  expect(css(result)).toMatchCss(`
    @media (min-width: 200px) {
      .foo {
        background-color: orange
      }
    }
  `)
})

test('it parses nested media queries', () => {
  const result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      '@media (min-width: 200px)': {
        backgroundColor: 'orange',
      },
    },
  })

  expect(css(result)).toMatchCss(`
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
  const result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      '@screen sm': {
        backgroundColor: 'orange',
      },
    },
  })

  expect(css(result)).toMatchCss(`
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
  const result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      ':hover': {
        '@media (min-width: 200px)': {
          backgroundColor: 'orange',
        },
      },
    },
  })

  expect(css(result)).toMatchCss(`
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
  const result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      '.bar': {
        backgroundColor: 'orange',
      },
    },
  })

  expect(css(result)).toMatchCss(`
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
  const result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      '&.bar': {
        backgroundColor: 'orange',
      },
    },
  })

  expect(css(result)).toMatchCss(`
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
  const result = parseObjectStyles({
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

  expect(css(result)).toMatchCss(`
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
  const result = parseObjectStyles({
    '.foo': {
      '.bar': {
        backgroundColor: 'orange',
      },
    },
  })

  expect(css(result)).toMatchCss(`
    .foo .bar {
      background-color: orange
    }
  `)
})

test('it can parse an array of styles', () => {
  const result = parseObjectStyles([
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

  expect(css(result)).toMatchCss(`
    .foo {
      background-color: orange
    }
    .bar {
      background-color: red
    }
    .foo {
      background-color: blue
    }
  `)
})

test('custom properties preserve their case', () => {
  const result = parseObjectStyles({
    ':root': {
      '--colors-aColor-500': '0',
    },
  })

  expect(css(result)).toMatchCss(`
    :root {
      --colors-aColor-500: 0;
    }
  `)
})
