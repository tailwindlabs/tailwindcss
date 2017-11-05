import postcss from 'postcss'
import plugin from '../src/lib/substituteImportantAtRules'

function run(input, opts = () => {}) {
  return postcss([plugin(opts)]).process(input)
}

test("it makes every property of every nested rule !important", () => {
  const input = `
    .foo { color: blue; }
    @important {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
    .bar { color: red; }
  `

  const output = `
    .foo { color: blue; }
    .banana { color: yellow !important; }
    .chocolate { color: brown !important; }
    .bar { color: red; }
  `

  return run(input).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})
