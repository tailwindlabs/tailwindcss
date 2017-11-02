import fs from 'fs'
import postcss from 'postcss'
import tailwind from '..'
import CleanCSS from 'clean-css'

function buildDistFile(filename) {
  return new Promise((resolve, reject) => {
    console.log(`Processing ./css/${filename}.css...`)

    fs.readFile(`./css/${filename}.css`, (err, css) => {
      return postcss([tailwind()])
        .process(css, {
          from: `./css/${filename}.css`,
          to: `./dist/${filename}.css`,
          map: { inline: false },
        })
        .then(result => {
          fs.writeFileSync(`./dist/${filename}.css`, result.css)
          if (result.map) {
            fs.writeFileSync(`./dist/${filename}.css.map`, result.map)
          }
          return result
        })
        .then(result => {
          const minified = new CleanCSS().minify(result.css)
          fs.writeFileSync(`./dist/${filename}.min.css`, minified.styles)
        })
        .then(resolve)
        .catch(error => {
          console.log(error)
          reject()
        })
    })
  })
}

console.info('Building Tailwind!')

Promise.all([
  buildDistFile('preflight'),
  buildDistFile('utilities'),
  buildDistFile('tailwind'),
]).then(() => {
  console.log('Finished Building Tailwind!')
})

