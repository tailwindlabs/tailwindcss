const mix = require('laravel-mix')

mix.setPublicPath('dist')
mix.postCss('src/index.css', 'dist/index.css')
mix.disableNotifications()
