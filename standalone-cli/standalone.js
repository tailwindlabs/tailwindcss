let log = require('tailwindcss/lib/util/log').default

let localModules = {
  'tailwindcss/colors': require('tailwindcss/colors'),
  'tailwindcss/defaultConfig': require('tailwindcss/defaultConfig'),
  'tailwindcss/defaultTheme': require('tailwindcss/defaultTheme'),
  'tailwindcss/resolveConfig': require('tailwindcss/resolveConfig'),
  'tailwindcss/plugin': require('tailwindcss/plugin'),

  '@tailwindcss/aspect-ratio': require('@tailwindcss/aspect-ratio'),
  '@tailwindcss/container-queries': require('@tailwindcss/container-queries'),
  '@tailwindcss/forms': require('@tailwindcss/forms'),
  '@tailwindcss/line-clamp': () => {
    log.warn('line-clamp-in-core', [
      'As of Tailwind CSS v3.3, the `@tailwindcss/line-clamp` plugin is now included by default.',
      'Remove it from the `plugins` array in your configuration to eliminate this warning.',
    ])
  },
  '@tailwindcss/typography': require('@tailwindcss/typography'),

  // These are present to allow them to be specified in the PostCSS config file
  autoprefixer: require('autoprefixer'),
  tailwindcss: require('tailwindcss'),
}

// Swap out the default JITI implementation with one that has the built-in modules above preloaded as "native modules"
// NOTE: This uses a private, internal API of Tailwind CSS and is subject to change at any time
let { useCustomJiti } = require('tailwindcss/lib/lib/load-config')
let { transform } = require('sucrase')

useCustomJiti(() =>
  require('jiti')(__filename, {
    interopDefault: true,
    nativeModules: Object.keys(localModules),
    transform: (opts) => {
      // Sucrase can't transform import.meta so we have to use Babel
      if (opts.source.includes('import.meta')) {
        return require('jiti/dist/babel.js')(opts)
      }

      return transform(opts.source, {
        transforms: ['typescript', 'imports'],
      })
    },
  })
)

let { patchRequire } = require('./patch-require.js')
patchRequire(
  // Patch require(…) to return the bundled modules above so they don't need to be installed
  localModules,

  // Create a require cache that maps module IDs to module objects
  // This MUST be done before require is patched to handle caching
  Object.fromEntries(
    Object.keys(localModules).map((id) => [
      id,
      id === '@tailwindcss/line-clamp'
        ? `node_modules/@tailwindcss/line-clamp/`
        : require.cache[require.resolve(id)],
    ])
  )
)

require('tailwindcss/lib/cli')
