import { expect, test } from 'vitest'
import tailwindcss from './index'

// Vite's experimental `bundledDev` mode calls `hotUpdate` without a `server`,
// so the handler must not dereference it.
// https://github.com/tailwindlabs/tailwindcss/issues/20378
test('hotUpdate does not crash when Vite omits the server (bundledDev)', () => {
  let plugin = tailwindcss().find((plugin) => plugin.name === '@tailwindcss/vite:generate:serve')!

  let hotUpdate = plugin.hotUpdate as unknown as (options: {
    file: string
    modules: unknown[]
    timestamp: number
    server: undefined
  }) => unknown

  expect(() =>
    hotUpdate.call(plugin, {
      file: '/app/template.html',
      modules: [{ type: 'asset', id: undefined }],
      timestamp: Date.now(),
      server: undefined,
    }),
  ).not.toThrow()
})
