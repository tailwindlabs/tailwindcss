import _ from 'lodash'
import postcss from 'postcss'
import tailwind from '../src/index'

it('removes silenced rules while still making them available to @apply', () => {
  const input = _.trim(`
@silent {
  @responsive {
    .foo {
      color: red;
    }
  }
  @tailwind screens;
}


.bar {
  @apply .foo;
}
  `)

  const expected = _.trim(`
.bar {
  color: red;
}
  `)

  return postcss([tailwind()])
    .process(input)
    .then(result => {
      expect(result.css).toBe(expected)
    })
})

it('throws an error if @silent is used anywhere but the root of the tree', () => {
  const input = _.trim(`
@media (min-width: 100px) {
  @silent {
    .foo {
      color: red;
    }
  }
  .bar {
    @apply .foo;
  }
}
  `)

  expect.assertions(1)
  return postcss([tailwind()]).process(input).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})
