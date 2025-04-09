import { css, js, json, test } from '../utils'

test(
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
              // Note: There is currently a known-problem that the Node WASI preview implementation
              // does not properly handle FS reads on macOS. This forces us to scan a folder that
              // does not contain a lot of files.
              //
              // https://github.com/nodejs/node/issues/47193
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
    let output = await exec(`node index.mjs`, { env: { DEBUG: '*' } })
    console.log(output)
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
