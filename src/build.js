import CleanCSS from 'clean-css'
import fs from 'fs'
import postcss from 'postcss'
import tailwind from '..'

const buildDistFile = filename =>
  new Promise((resolve, reject) => {
    console.log(`Processing ./${filename}.css...`)

    fs.readFile(`./${filename}.css`, (err, css) => {
      if (err) {
        throw err
      }

      return postcss([tailwind(), require('autoprefixer')])
        .process(css, {
          from: `./${filename}.css`,
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

console.info('Building Tailwind!')

Promise.all([
  buildDistFile('base'),
  buildDistFile('components'),
  buildDistFile('utilities'),
  buildDistFile('tailwind'),
]).then(() => {
  console.log('Finished Building Tailwind!')
})
