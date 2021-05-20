import postcss from 'postcss'
import fs from 'fs'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  return postcss(tailwind(config)).process(input, {
    from: path.resolve(__filename),
  })
}

test('relative purge paths', () => {
  let css = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(css, path.resolve(__dirname, './relative-purge-paths.config.js')).then((result) => {
    let expectedPath = path.resolve(__dirname, './relative-purge-paths.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
