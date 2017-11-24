import postcss from 'postcss'
import plugin from '../src/lib/substituteFocusableAtRules'
import config from '../defaultConfig.stub.js'

const separator = config.options.separator

function run(input, opts = () => config) {
  return postcss([plugin(opts)]).process(input)
}

test('it adds a focusable variant to each nested class definition', () => {
  const input = `
    @focusable {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      .focus${separator}banana:focus { color: yellow; }
      .focus${separator}chocolate:focus { color: brown; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})
