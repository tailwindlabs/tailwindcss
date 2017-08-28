const mix = require('laravel-mix');
const tailwind = require('./../lib/tailwind.js').default;

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
      tailwind(require('./tailwind-config')),
    ]
  })

// mix.js('source/js/prism.js', 'source/js')
//     .postCss('source/_assets/css/main.css', 'source/css', [
//       require('./../src/tailwind.js')(),
//       require('postcss-cssnext')()
//     ])
