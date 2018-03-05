import _ from 'lodash'
import parseObjectStyles from '../src/util/parseObjectStyles'
import cxs from 'cxs'
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

  expect(result).toMatchCss(`
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

  expect(result).toMatchCss(`
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

  expect(result).toMatchCss(`
    .foo {
      background-color: red;
      color: white;
      padding: 1rem
    }
    .foo:hover {
      background-color: orange
    }
    .foo:focus {
      background-color: blue
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

  expect(result).toMatchCss(`
    .foo {
      background-color: red;
      color: white;
      padding: 1rem
    }
    @media (min-width: 200px) {
      .foo {
        background-color: orange
      }
    }
  `)
})

// test('it parses pseudo-selectors in nested media queries', () => {
//   const result = parseObjectStyles({
//     '.foo': {
//       backgroundColor: 'red',
//       color: 'white',
//       padding: '1rem',
//       ':hover': {
//         '@media (min-width: 200px)': {
//           backgroundColor: 'orange',
//         }
//       },
//     },
//   })

//   expect(result).toMatchCss(`
//     .foo {
//       background-color: red;
//       color: white;
//       padding: 1rem
//     }
//     @media (min-width: 200px) {
//       .foo:hover {
//         background-color: orange
//       }
//     }
//   `)
// })
