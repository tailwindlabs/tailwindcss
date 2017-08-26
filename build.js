console.info('Building Tailwind!')

const fs = require('fs')
const postcss = require('postcss')
const defaultConfig = require('./src/default-config')

fs.readFile('./src/tailwind.css', (err, css) => {
  postcss([
    require('./src/tailwind')(defaultConfig),
  ]).process(css, {
    from: './src/tailwind.css',
    to: './dist/tailwind.css',
    map: {inline: false},
  }).then(result => {
    fs.writeFileSync('dist/tailwind.css', result.css)
    if (result.map) {
      fs.writeFileSync('dist/tailwind.css.map', result.map)
    }
  })
})

console.log('Finished Building Tailwind!')
