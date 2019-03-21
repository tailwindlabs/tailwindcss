const argv = require('yargs').argv
const command = require('node-cmd')
const mix = require('laravel-mix')
const OnBuild = require('on-build-webpack')
const Watch = require('webpack-watch')
const tailwind = require('tailwindcss')
const config = require('tailwindcss/defaultConfig')
const resolveConfig = require('tailwindcss/lib/util/resolveConfig').default
const fs = require('fs')
const path = require('path')

fs.writeFileSync('./tailwind.json', JSON.stringify(resolveConfig([config])))

const env = argv.e || argv.env || 'local'
const plugins = [
    new OnBuild(() => {
        command.get(`${path.normalize('./vendor/bin/jigsaw build')} ${env}`, (error, stdout, stderr) => {
            if (error) {
                console.log(stderr)
                process.exit(1)
            }
            console.log(stdout)
        })
    }),
    new Watch({
        paths: ['source/**/*.md', 'source/**/*.php', '*.php', '*.js'],
        options: { ignoreInitial: true }
    }),
]

mix.webpackConfig({ plugins })
mix.setPublicPath('source')

mix
  .js('source/_assets/js/nav.js', 'source/js')
  .js('source/_assets/js/app.js', 'source/js')
  .less('source/_assets/less/main.less', 'source/css')
  .options({
    postCss: [
      tailwind('tailwind.config.js'),
    ]
  })
  .version()
