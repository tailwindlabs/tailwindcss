import postcss from 'postcss'
import fs from 'fs'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  return postcss(tailwind(config)).process(input, {
    from: path.resolve(__filename),
  })
}

test('animations', () => {
  let config = {
    darkMode: 'class',
    mode: 'jit',
    purge: [path.resolve(__dirname, './animations.test.html')],
    corePlugins: {},
    theme: {},
    plugins: [],
  }

  let css = `@tailwind utilities`

  return run(css, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './animations.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
