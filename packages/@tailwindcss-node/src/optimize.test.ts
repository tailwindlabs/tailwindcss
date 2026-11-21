import { expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({ bindingAvailable: false }))

// Simulate a platform without a lightningcss native binding (e.g. OpenHarmony, see
// #20628). Importing the package must not touch lightningcss, only `optimize()` may.
vi.mock('lightningcss', () => {
  throw new Error('lightningcss native binding is not available')
})

// `optimize()` loads lightningcss through `createRequire(…)`, which `vi.mock` cannot
// intercept, so make that require fail for `lightningcss` as well.
vi.mock('node:module', async (importOriginal) => {
  let actual = await importOriginal<typeof import('node:module')>()

  return {
    ...actual,
    createRequire(url: string | URL) {
      let localRequire = actual.createRequire(url)

      let mockedRequire = ((id: string) => {
        if (id === 'lightningcss' && !state.bindingAvailable) {
          throw new Error('lightningcss native binding is not available')
        }

        return localRequire(id)
      }) as NodeRequire

      mockedRequire.resolve = localRequire.resolve

      return mockedRequire
    },
  }
})

it('should not load lightningcss when the package is imported', async () => {
  let mod = await import('@tailwindcss/node')

  expect(mod.optimize).toBeTypeOf('function')
})

it('should only throw when optimize() is called without a binding', async () => {
  let { optimize } = await import('@tailwindcss/node')

  expect(() => optimize('.foo { color: red }')).toThrow(
    'lightningcss native binding is not available',
  )
})

it('should still optimize CSS when the binding is available', async () => {
  state.bindingAvailable = true
  let { optimize } = await import('@tailwindcss/node')

  expect(optimize('.foo { color: red }').code).toContain('color: red')
})
