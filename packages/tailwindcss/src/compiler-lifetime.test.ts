import { setImmediate } from 'node:timers/promises'
import { setFlagsFromString } from 'node:v8'
import { runInNewContext } from 'node:vm'
import { expect, test } from 'vitest'
import { compile } from './index'

// Expose `gc()` without requiring the `--expose-gc` Node.js flag. The flag is
// process-wide, so we turn it off again once we have a reference to `gc()`.
setFlagsFromString('--expose-gc')
const gc: () => void = runInNewContext('gc')
setFlagsFromString('--no-expose-gc')

test('compiler releases loader callbacks after compilation', async () => {
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
  gc()

  expect(callbacks.map((callback) => callback.deref())).toEqual([undefined, undefined])
  expect(compiler.build(['flex'])).toContain('.flex {')
})
