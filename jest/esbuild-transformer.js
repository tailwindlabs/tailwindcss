const esbuild = require('esbuild')

module.exports = {
  process(src, filename) {
    return esbuild.transformSync(src, {
      loader: 'js',
      format: 'cjs',
      minify: false,
      sourcemap: true,
      sourcefile: filename,
    })
  },
}
