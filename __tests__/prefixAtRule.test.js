import postcss from 'postcss'
import plugin from '../src/lib/substitutePrefixAtRules'

function run(input, opts = () => {}) {
  return postcss([plugin(opts)]).process(input)
}

test('it prefixes classes with the provided prefix', () => {
  const input = `
    .foo { color: red; }
    @prefix 'tw-' {
      .banana { color: yellow; }
      .chocolate { color: brown; }
      .apple, .pear { color: green; }
    }
    .bar { color: blue; }
  `

  const output = `
    .foo { color: red; }
    .tw-banana { color: yellow; }
    .tw-chocolate { color: brown; }
    .tw-apple, .tw-pear { color: green; }
    .bar { color: blue; }
  `

  return run(input).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})
