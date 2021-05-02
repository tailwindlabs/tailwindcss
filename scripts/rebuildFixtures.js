import fs from 'fs'
import postcss from 'postcss'
import tailwind from '..'

function build({ from, to, config }) {
  return new Promise((resolve, reject) => {
    console.log(`Processing ./${from}...`)

    fs.readFile(`./${from}`, (err, css) => {
      if (err) throw err

      return postcss([tailwind(config)])
        .process(css, {
          from: undefined,
        })
        .then((result) => {
          fs.writeFileSync(`./${to}`, result.css)
          return result
        })
        .then(resolve)
        .catch((error) => {
          console.log(error)
          reject()
        })
    })
  })
}

console.info('\nRebuilding fixtures...\n')

Promise.all([
  build({
    from: 'tests/fixtures/tailwind-input.css',
    to: 'tests/fixtures/tailwind-output.css',
    config: {},
  }),
  build({
    from: 'tests/fixtures/tailwind-input.css',
    to: 'tests/fixtures/tailwind-output-important.css',
    config: { important: true },
  }),
  build({
    from: 'tests/fixtures/tailwind-input.css',
    to: 'tests/fixtures/tailwind-output-no-color-opacity.css',
    config: {
      corePlugins: {
        textOpacity: false,
        backgroundOpacity: false,
        borderOpacity: false,
        placeholderOpacity: false,
        divideOpacity: false,
      },
    },
  }),
  build({
    from: 'tests/fixtures/tailwind-input.css',
    to: 'tests/fixtures/tailwind-output-flagged.css',
    config: {
      future: 'all',
      experimental: 'all',
    },
  }),
]).then(() => {
  console.log('\nFinished rebuilding fixtures.')
  console.log(
    '\nPlease triple check that the fixture output matches what you expect before committing this change.'
  )
})
