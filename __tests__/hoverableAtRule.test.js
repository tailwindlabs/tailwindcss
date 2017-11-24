import postcss from 'postcss'
import plugin from '../src/lib/substituteHoverableAtRules'
import config from '../defaultConfig.stub.js'

const separator = config.options.separator

function run(input, opts = () => config) {
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
      .banana { color: yellow; }
      .chocolate { color: brown; }
      .hover${separator}banana:hover { color: yellow; }
      .hover${separator}chocolate:hover { color: brown; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})
