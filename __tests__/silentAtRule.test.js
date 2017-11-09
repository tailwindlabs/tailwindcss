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
