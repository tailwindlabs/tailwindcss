import { css, js, json, test } from '../utils'

// This test runs the the wasm build using the `node:wasi` runtine.
//
// There are currently a known problems that the Node WASI preview implementation does not properly
// handle FS reads on macOS and it does not implement all APIs on Windows. Beacuse of that, this
// test is only run on Linux for now.
//
// https://github.com/nodejs/node/issues/47193
// https://github.com/nodejs/uvwasi/issues/11

let testFn = process.platform === 'linux' ? test : test.skip

testFn(
  '@tailwindcss/oxide-wasm32-wasi can be loaded into a Node.js process',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/oxide-wasm32-wasi": "workspace:^"
          }
        }
      `,
      'src/index.css': css`@import 'tailwindcss/utilities';`,
      'src/index.js': js`
        const className = "content-['src/index.js']"
        module.exports = { className }
      `,
      'index.mjs': js`
        import { Scanner } from '@tailwindcss/oxide-wasm32-wasi'
        import { join, resolve } from 'node:path'

        let scanner = new Scanner({
          sources: [
            {
              base: join(process.cwd(), 'src'),
              pattern: '**/*',
              negated: false,
            },
          ],
        })
        console.log(JSON.stringify(scanner.scan()))
        process.exit()
      `,
    },
  },
  async ({ expect, exec }) => {
    let output = await exec(`node index.mjs`)
    expect(JSON.parse(output)).toMatchInlineSnapshot(`
      [
        "className",
        "const",
        "content-['src/index.js']",
        "exports",
      ]
    `)
  },
)
