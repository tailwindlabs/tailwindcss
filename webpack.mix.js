const mix = require('laravel-mix')
const tailwind = require('tailwindcss')
const config = require('tailwindcss/defaultConfig')
const resolveConfig = require('tailwindcss/lib/util/resolveConfig').default
const fs = require('fs')
const build = require('./tasks/build.js')

fs.writeFileSync('./tailwind.json', JSON.stringify(resolveConfig([config])))

mix.webpackConfig({
  plugins: [
    build.jigsaw,
    build.watch(['source/**/*.md', 'source/**/*.php', 'source/**/*.scss', '!source/**/_tmp/*']),
  ]
})
mix.setPublicPath('source/assets/build')

const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './source/**/*.blade.php',
    './source/**/*.blade.md',
    './source/**/*.vue',
    './source/**/*.js',
  ],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/\?\(\)]+/g) || []
})

mix
  .js('source/_assets/js/nav.js', 'js')
  .js('source/_assets/js/app.js', 'js')
  .js('source/_assets/js/workflow-animation.js', 'js')
  .less('source/_assets/less/main.less', 'css')
  .options({
    postCss: [
      tailwind('tailwind.config.js'),
      ...process.env.NODE_ENV === 'production'
        ? [purgecss]
        : []
    ],
    cssNano: { discardComments: false, mergeRules: false }
  })
  .version()
