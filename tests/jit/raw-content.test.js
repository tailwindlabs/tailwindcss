import postcss from 'postcss'
import fs from 'fs'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  return postcss(tailwind(config)).process(input, {
    from: path.resolve(__filename),
  })
}

test('raw content', () => {
  let config = {
    mode: 'jit',
    purge: [{ raw: fs.readFileSync(path.resolve(__dirname, './raw-content.test.html'), 'utf8') }],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(css, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './raw-content.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
