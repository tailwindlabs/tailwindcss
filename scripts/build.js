import fs from 'fs'
import postcss from 'postcss'
import tailwind from '..'
import CleanCSS from 'clean-css'
import cssnano from 'cssnano'

function buildDistFile(filename, config = {}, outFilename = filename) {
  return new Promise((resolve, reject) => {
    console.log(`Processing ./${filename}.css...`)

    fs.readFile(`./${filename}.css`, (err, css) => {
      if (err) throw err

      return postcss([tailwind(config), require('autoprefixer')])
        .process(css, {
          from: `./${filename}.css`,
          to: `./dist/${outFilename}.css`,
        })
        .then((result) => {
          fs.writeFileSync(`./dist/${outFilename}.css`, result.css)
          return result
        })
        .then((result) => {
          return postcss([cssnano]).process(result.css, {
            from: `./${filename}.css`,
            to: `./dist/${outFilename}.min.css`,
          })
        })
        .then((result) => {
          fs.writeFileSync(`./dist/${outFilename}.min.css`, result.css)
        })
        .then(resolve)
        .catch((error) => {
          console.log(error)
          reject()
        })
    })
  })
}

console.info('Building Tailwind!')

Promise.all([
  buildDistFile('base'),
  buildDistFile('components'),
  buildDistFile('utilities'),
  buildDistFile('tailwind'),
  buildDistFile('tailwind', { darkMode: 'class' }, 'tailwind-dark'),
  buildDistFile('tailwind', { future: 'all', experimental: 'all' }, 'tailwind-experimental'),
]).then(() => {
  console.log('Finished Building Tailwind!')
})
