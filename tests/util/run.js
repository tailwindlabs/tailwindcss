import pkg from '../../package.json'
import postcss from 'postcss'
import tailwind from '../../src'
import corePluginList from '../../src/corePluginList'
import resolveConfig from '../../src/public/resolve-config'
import { createContext } from '../../src/lib/setupContextUtils'
import { variantPlugins } from '../../src/corePlugins'

import { css } from './strings'

export * from './strings'
export * from './defaults'

export let map = JSON.stringify({
  version: 3,
  file: null,
  sources: [],
  names: [],
  mappings: '',
})

export function run(input, config, plugin = tailwind) {
  let { currentTestName, testPath } = expect.getState()
  let path = `${testPath}?test=${Buffer.from(currentTestName).toString('base64')}`

  return postcss(plugin(config)).process(input, {
    from: path,
    to: path,
  })
}

export function runWithSourceMaps(
  input,
  config,
  options = { map: { prev: map } },
  plugin = tailwind
) {
  let { currentTestName, testPath } = expect.getState()
  let path = `${testPath}?test=${Buffer.from(currentTestName).toString('base64')}`

  return postcss(plugin(config)).process(input, {
    from: path,
    to: path,
    ...options,
  })
}

export function quickPluginTest(pluginName, extendedConfig = {}) {
  return new Proxy(
    {},
    {
      get: (_, prop) => {
        return (...args) => {
          it(`should test the '${pluginName}' plugin`, () => {
            expect.assertions(3)

            // Ensure the plugin exists, this will help if you made a typo in the plugin name and
            // didn't realize it.
            expect(corePluginList).toContain(pluginName)

            let { safelist = [], corePlugins = [], ...rest } = extendedConfig || {}

            let config = {
              safelist: [{ pattern: /./g }, ...safelist], // Generate all known classes
              corePlugins: [pluginName, ...corePlugins], // Only load the plugin we're testing
              content: [], // Be explicit about the empty content, otherwise auto-detection will kick in
              ...rest,
            }

            let input = css`
              @tailwind base;
              @tailwind components;
              @tailwind utilities;
            `

            return run(input, config).then((result) => {
              let firstNewLine = result.css.indexOf('\n')

              let license = result.css.slice(0, firstNewLine)
              let css = result.css.slice(firstNewLine)

              // Ensure we have a license
              expect(license).toEqual(
                `/* ! tailwindcss v${pkg.version} | MIT License | https://tailwindcss.com */`
              )

              expect(css)[prop](...args)
            })
          })
        }
      },
    }
  )
}

export function quickVariantPluginTest(pluginName, extendedConfig = {}) {
  // Drop the _other_ variant related plugins
  for (let variant in variantPlugins) {
    if (variant !== pluginName) {
      variantPlugins[variant] = () => {}
    }
  }

  return new Proxy(
    {},
    {
      get: (_, prop) => {
        return (...args) => {
          it(`should test the '${pluginName}' plugin`, () => {
            expect.assertions(3)

            // Ensure the plugin exists, this will help if you made a typo in the plugin name and
            // didn't realize it.
            expect(Object.keys(variantPlugins)).toContain(pluginName)

            let context
            let config = {
              corePlugins: [],
              get content() {
                if (!context) return [] // Context is not ready yet

                return context
                  .getVariants()
                  .flatMap((variant) => {
                    return variant.values.length > 0
                      ? variant.values.map((value) => `${variant.name}-${value}`)
                      : variant.name
                  })
                  .map((variant) => ({ raw: `${variant}:flex` }))
              },
              plugins: [
                function testPlugin({ addUtilities }) {
                  addUtilities({
                    '.flex': { display: 'flex' },
                  })
                },
              ],
              ...extendedConfig,
            }

            context = createContext(resolveConfig(config))

            let input = css`
              @tailwind base;
              @tailwind components;
              @tailwind utilities;
            `

            return run(input, config).then((result) => {
              let firstNewLine = result.css.indexOf('\n')

              let license = result.css.slice(0, firstNewLine)
              let css = result.css.slice(firstNewLine)

              // Ensure we have a license
              expect(license).toEqual(
                `/* ! tailwindcss v${pkg.version} | MIT License | https://tailwindcss.com */`
              )

              expect(css)[prop](...args)
            })
          })
        }
      },
    }
  )
}
