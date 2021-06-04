export let postcss = require('postcss')

export function lazyAutoprefixer() {
  return require('autoprefixer')
}

export function lazyCssnano() {
  return require('cssnano')
}
