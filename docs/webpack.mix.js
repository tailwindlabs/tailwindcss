const mix = require('laravel-mix');

/*
|--------------------------------------------------------------------------
| Mix Asset Management
|--------------------------------------------------------------------------
|
| Mix provides a clean, fluent API for defining some Webpack build steps
| for your Laravel application. By default, we are compiling the Sass
| file for the application as well as bundling up all the JS files.
|
*/

mix.less('source/_assets/less/main.less', 'source/css')
  .options({
    postCss: [
      require('./../src/tailwind.js')(),
      require('postcss-cssnext')()
    ]
  })
