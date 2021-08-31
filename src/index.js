import jitPlugins from './jit'

module.exports = function tailwindcss(config) {
  return {
    postcssPlugin: 'tailwindcss',
    plugins: jitPlugins(config),
  }
}

module.exports.postcss = true
