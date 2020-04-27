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
        .then(result => {
          fs.writeFileSync(`./${to}`, result.css)
          return result
        })
        .then(resolve)
        .catch(error => {
          console.log(error)
          reject()
        })
    })
  })
}

console.info('\nRebuilding fixtures...\n')

Promise.all([
  build({
    from: '__tests__/fixtures/tailwind-input.css',
    to: '__tests__/fixtures/tailwind-output.css',
    config: {},
  }),
  build({
    from: '__tests__/fixtures/tailwind-input.css',
    to: '__tests__/fixtures/tailwind-output-important.css',
    config: { important: true },
  }),
  build({
    from: '__tests__/fixtures/tailwind-input.css',
    to: '__tests__/fixtures/tailwind-output-purged.css',
    config: {
      theme: {
        extend: {
          colors: {
            'black!': '#000',
          },
          spacing: {
            '(1/2+8)': 'calc(50% + 2rem)',
          },
          minHeight: {
            '(screen-100)': 'calc(100vh - 1rem)',
          },
          fontFamily: {
            '%#$@': 'Comic Sans',
          },
        },
      },
      purge: { enabled: true, paths: ['./__tests__/fixtures/**/*.html'] },
    },
  }),
]).then(() => {
  console.log('\nFinished rebuilding fixtures.')
  console.log(
    '\nPlease triple check that the fixture output matches what you expect before committing this change.'
  )
})
