import { css, js, json, test } from '../utils'

// The build plugin used to cache a `Root` (and its compiler) for the
// lifetime of the plugin instance without ever releasing it, which kept the
// `PluginContext` of the `transform` call that created it (and everything
// reachable through it, e.g. a finished Rolldown bundle) alive long after
// the build finished. Only observable with Vite 8's Rolldown bundler, not
// with Rollup.
//
// https://github.com/tailwindlabs/tailwindcss/issues/20501
test(
  'does not keep the transform PluginContext alive after a build finishes',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "vite": "^8"
          }
        }
      `,
      'src/app.css': css`@import 'tailwindcss';`,
      'src/main.js': js`import './app.css'`,
      'probe.mjs': js`
        import { build } from 'vite'
        import tailwindcss from '@tailwindcss/vite'

        const NAME = '@tailwindcss/vite:generate:build'

        let ctxRef = null

        function instrument(plugins) {
          return plugins.map((plugin) => {
            if (plugin.name !== NAME) return plugin
            let original = plugin.transform.handler
            return {
              ...plugin,
              transform: {
                ...plugin.transform,
                handler(...args) {
                  ctxRef ??= new WeakRef(this)
                  return original.apply(this, args)
                },
              },
            }
          })
        }

        await build({
          root: import.meta.dirname,
          logLevel: 'error',
          configFile: false,
          build: {
            write: false,
            lib: { entry: 'src/main.js', formats: ['es'], fileName: 'out' },
          },
          plugins: [instrument(tailwindcss())],
        })

        for (let i = 0; i < 5; i++) {
          global.gc()
          await new Promise((resolve) => setImmediate(resolve))
        }

        console.log('pluginContextAlive=' + (ctxRef?.deref() !== undefined))
      `,
    },
  },
  async ({ exec, expect }) => {
    let output = await exec('node --expose-gc probe.mjs')
    expect(output).toContain('pluginContextAlive=false')
  },
)
