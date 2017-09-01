import fs from 'fs'
import postcss from 'postcss'
import tailwind from '..'
import defaultConfig from './defaultConfig'

console.info('Building Tailwind!')

fs.readFile('./src/tailwind.css', (err, css) => {
  postcss([tailwind(defaultConfig)])
    .process(css, {
      from: './tailwind.css',
      to: './dist/tailwind.css',
      map: {inline: false},
    })
    .then(result => {
      fs.writeFileSync('./dist/tailwind.css', result.css)
      if (result.map) fs.writeFileSync('./dist/tailwind.css.map', result.map)
    })
    .catch(error => console.log(error))
})

console.log('Finished Building Tailwind!')
