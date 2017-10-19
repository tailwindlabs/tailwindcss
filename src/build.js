import fs from 'fs'
import postcss from 'postcss'
import tailwind from '..'
import defaultConfig from './defaultConfig'
import CleanCSS from 'clean-css'

console.info('Building Tailwind!')

fs.readFile('./css/tailwind.css', (err, css) => {
  postcss([tailwind(defaultConfig)])
    .process(css, {
      from: './css/tailwind.css',
      to: './dist/tailwind.css',
      map: { inline: false },
    })
    .then(result => {
      fs.writeFileSync('./dist/tailwind.css', result.css)
      if (result.map) {
        fs.writeFileSync('./dist/tailwind.css.map', result.map)
      }
      return result
    })
    .then(result => {
      const minified = new CleanCSS().minify(result.css)
      fs.writeFileSync('./dist/tailwind.min.css', minified.styles)
    })
    .catch(error => console.log(error))
})

console.log('Finished Building Tailwind!')
