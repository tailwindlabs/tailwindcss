const fs = require('fs')
const path = require('path')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const gzipSize = require('gzip-size')
const brotliSize = require('brotli-size')
const CleanCSS = require('clean-css')
const { loopWhile } = require('deasync')

const convertToKB = (bytes) => (bytes / 1000).toFixed(1) + 'kB'

const stats = {}
const configDir = path.resolve(__dirname, '../src/fixtures/configs')
const configs = fs.readdirSync(configDir)

configs.forEach((config) => {
  let css

  postcss([tailwindcss(path.join(configDir, config)), autoprefixer()])
    .process(['@tailwind base;', '@tailwind components;', '@tailwind utilities;'].join('\n'), {
      from: undefined,
    })
    .then((result) => {
      css = result.css
    })

  loopWhile(() => !css)

  const { styles: minified } = new CleanCSS().minify(css)

  stats[config.split('.')[0]] = {
    original: convertToKB(Buffer.byteLength(css, 'utf8')),
    minified: convertToKB(Buffer.byteLength(minified, 'utf8')),
    gzipped: convertToKB(gzipSize.sync(minified)),
    brotlified: convertToKB(brotliSize.sync(minified)),
  }
})

fs.writeFileSync('./src/utils/stats.json', JSON.stringify(stats), 'utf8')
