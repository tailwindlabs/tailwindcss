const mix = require('laravel-mix')
const tailwind = require('./../lib/index.js')
const config = require('./tailwind.js')
const fs = require('fs')

mix.setPublicPath('source/');

fs.writeFileSync('./tailwind.json', JSON.stringify(config))

mix
  .js('source/_assets/js/nav.js', 'source/js')
  .js('source/_assets/js/app.js', 'source/js')
  .less('source/_assets/less/main.less', 'source/css')
  .options({
    postCss: [
      tailwind('tailwind.js'),
    ]
  })
  .version()
