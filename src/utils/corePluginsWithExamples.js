// @preval
const glob = require('glob')
const path = require('path')
const dlv = require('dlv')
const { defaultConfig } = require('./defaultConfig')

const plugins = [
  'preflight',
  'container',
  ...glob
    .sync('node_modules/tailwindcss/lib/plugins/*.js')
    .map((filename) => path.basename(filename, '.js'))
    .filter((name) => name !== 'index'),
].filter((x, i, a) => a.indexOf(x) === i)

module.exports.corePluginsWithExamples = plugins.map((plugin) => {
  const utilities = {}
  const mod = require('tailwindcss/lib/plugins/' + plugin)
  ;(mod.default || mod)()({
    addUtilities: (utils) => {
      utils = Array.isArray(utils) ? utils : [utils]
      for (let i = 0; i < utils.length; i++) {
        Object.assign(utilities, utils[i])
      }
    },
    addComponents: () => {},
    addBase: () => {},
    config: () => ({ future: 'all' }),
    theme: (path, defaultValue) => dlv(defaultConfig.theme, path, defaultValue),
    variants: () => [],
    e: (x) => x.replace(/([:.])/g, '\\$1'),
    corePlugins: () => true,
    prefix: (x) => x,
  })
  return {
    plugin,
    example:
      Object.keys(utilities).length > 0
        ? Object.keys(utilities)
            [Math.floor((Object.keys(utilities).length - 1) / 2)].split(/[>:]/)[0]
            .trim()
            .substr(1)
            .replace(/\\/g, '')
        : undefined,
  }
})
