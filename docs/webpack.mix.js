const argv = require('yargs').argv
const command = require('node-cmd')
const mix = require('laravel-mix')
const OnBuild = require('on-build-webpack')
const Watch = require('webpack-watch')
const tailwind = require('./../lib/index.js')
const config = require('./../defaultConfig.js')
const fs = require('fs')

fs.writeFileSync('./tailwind.json', JSON.stringify(require('./tailwind.js')))

const env = argv.e || argv.env || 'local'
const plugins = [
    new OnBuild(() => {
        command.get('./vendor/bin/jigsaw build ' + env, (error, stdout, stderr) => {
            if (error) {
                console.log(stderr)
                process.exit(1)
            }
            console.log(stdout)
        })
    }),
    new Watch({
        paths: ['source/**/*.md', 'source/**/*.php'],
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
      tailwind('tailwind.js'),
    ]
  })
  .version()
