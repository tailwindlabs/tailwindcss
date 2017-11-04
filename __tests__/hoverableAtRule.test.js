import postcss from 'postcss'
import plugin from '../src/lib/substituteHoverableAtRules'

function run(input, opts = () => {}) {
  return postcss([plugin(opts)]).process(input)
}

test('it adds a hoverable variant to each nested class definition', () => {
  const input = `
    @hoverable {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana, .hover\\:banana:hover { color: yellow; }
      .chocolate, .hover\\:chocolate:hover { color: brown; }
  `

  return run(input).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})
