let Module = require('module')
let origRequire = Module.prototype.require
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

Module.prototype.require = function (id) {
  if (localModules.hasOwnProperty(id)) {
    return localModules[id]
  }
  return origRequire.apply(this, arguments)
}

require('tailwindcss/lib/cli')
