// @preval
const fs = require('fs')
const path = require('path')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const gzipSize = require('gzip-size')
const brotliSize = require('brotli-size')
const CleanCSS = require('clean-css')
const { loopWhile } = require('deasync')

const convertToKB = (bytes) => (bytes / 1024).toFixed(1) + 'K'

const compareTailwindBuilds = (configDirectory, cssPath) => {
  const configs = fs.readdirSync(configDirectory)
  return configs.map((config) => {
    let css

    postcss([tailwindcss(path.join(configDirectory, config)), autoprefixer()])
      .process(['@tailwind base;', '@tailwind components;', '@tailwind utilities;'].join('\n'), {
        from: undefined,
      })
      .then((result) => {
        css = result.css
      })

    loopWhile(() => !css)

    const { styles: minified } = new CleanCSS().minify(css)

    return {
      [config.split('.')[0]]: {
        original: convertToKB(Buffer.byteLength(css, 'utf8')),
        minified: convertToKB(Buffer.byteLength(minified, 'utf8')),
        gzipped: convertToKB(gzipSize.sync(minified)),
        brotlified: convertToKB(brotliSize.sync(minified)),
      },
    }
  })
}

module.exports = function () {
  const tailwindData = compareTailwindBuilds(path.resolve(__dirname, '../fixtures/configs'))

  return tailwindData.reduce((flattened, config) => {
    Object.entries(config).forEach(([key, value]) => {
      flattened[key] = value
    })

    return flattened
  }, {})
}
