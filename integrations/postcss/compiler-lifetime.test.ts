import { js, json, test } from '../utils'

test(
  'compiler releases loader callbacks after compilation',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^"
          }
        }
      `,
      'index.mjs': js`
        import assert from 'node:assert/strict'
        import { setImmediate } from 'node:timers/promises'
        import { compile } from 'tailwindcss'

        let plugin = () => {}

        async function createCompiler() {
          let loadStylesheet = async () => ({
            path: 'utilities.css',
            base: '.',
            content: '@tailwind utilities;',
          })
          let loadModule = async () => ({ path: 'plugin.js', base: '.', module: plugin })
          let callbacks = [new WeakRef(loadStylesheet), new WeakRef(loadModule)]
          let compiler = await compile('@import "utilities"; @plugin "fixture";', {
            from: 'input.css',
            loadStylesheet,
            loadModule,
          })
          return { compiler, callbacks }
        }

        let { compiler, callbacks } = await createCompiler()
        await setImmediate()
        globalThis.gc()

        assert.deepEqual(
          callbacks.map((callback) => callback.deref()),
          [undefined, undefined],
        )
        assert.ok(compiler.build(['flex']).includes('.flex {'))
      `,
    },
  },
  async ({ exec }) => {
    await exec('node --expose-gc index.mjs')
  },
)
