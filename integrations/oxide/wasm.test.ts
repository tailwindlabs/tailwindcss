import { css, js, json, test, yaml } from '../utils'

// This test runs the wasm build using the `node:wasi` runtime.
//
// There are currently a known problems that the Node WASI preview implementation does not properly
// handle FS reads on macOS and it does not implement all APIs on Windows. Because of that, this
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

testFn(
  '`@tailwindcss/oxide` falls back to the wasm build when no native binding is available',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/oxide": "workspace:^"
          }
        }
      `,
      'pnpm-workspace.yaml': yaml`
        # Trick pnpm in only supporting an architecture that @tailwindcss/oxide
        # doesn't support, and therefore should fallback to the wasm version.
        supportedArchitectures:
          os:
            - openbsd
          cpu:
            - x64
      `,
      'src/index.js': js`
        const className = "content-['src/index.js']"
        module.exports = { className }
      `,
      'index.mjs': js`
        import { createRequire } from 'node:module'
        import { join } from 'node:path'

        let require = createRequire(import.meta.url)
        let { Scanner } = require('@tailwindcss/oxide')

        let loaded = Object.keys(require.cache)

        let scanner = new Scanner({
          sources: [
            {
              base: join(process.cwd(), 'src'),
              pattern: '**/*',
              negated: false,
            },
          ],
        })

        console.log(
          JSON.stringify({
            native: loaded.filter((file) => file.endsWith('.node')),
            wasi: loaded.some((file) => file.endsWith('tailwindcss-oxide.wasi.cjs')),
            candidates: scanner.scan(),
          }),
        )
        process.exit()
      `,
    },
  },
  async ({ expect, exec }) => {
    // Since vitest runs under `pnpm run`, pnpm's bin shims export a NODE_PATH
    // that includes the repository's hidden hoist directory
    // (`node_modules/.pnpm/node_modules`), which links every workspace package,
    // including all native `@tailwindcss/oxide-*` bindings.
    //
    // Node uses `NODE_PATH` exactly when the local `node_modules` lookup fails,
    // which would defeat the simulated unsupported platform, so clear it.
    let output = await exec(`node index.mjs`, { env: { NODE_PATH: '' } })
    let { native, wasi, candidates } = JSON.parse(output)

    // No native binding was installed or loaded, ...
    expect(native).toEqual([])

    // ... the wasm32-wasi binding is what actually loaded, ...
    expect(wasi).toBe(true)

    // ... and scanning real files on disk works through it.
    expect(candidates).toMatchInlineSnapshot(`
      [
        "className",
        "const",
        "content-['src/index.js']",
        "exports",
      ]
    `)
  },
)
