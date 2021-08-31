const fs = require('fs')
const path = require('path')
const postcss = require('postcss')
const tailwind = require('../index.js')
const sharedState = require('../lib/sharedState.js')
const configPath = path.resolve(__dirname, './context-reuse.tailwind.config.js')

function run(input, config = {}, from = null) {
  from = from || path.resolve(__filename)

  return postcss(tailwind(config)).process(input, { from })
}

async function runTest() {
  let messages = []

  let config = {
    darkMode: 'class',
    purge: [path.resolve(__dirname, './context-reuse.test.html')],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let from = path.resolve(__filename)

  fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config)};`)

  let results = [
    await run(`@tailwind utilities;`, configPath, `${from}?id=1`),
    await run(`body { @apply bg-blue-400; }`, configPath, `${from}?id=2`),
    await run(`body { @apply text-red-400; }`, configPath, `${from}?id=3`),
    await run(`body { @apply mb-4; }`, configPath, `${from}?id=4`),
  ]

  results.forEach(() => {
    messages.push({
      activeContexts: sharedState.contextSourcesMap.size,
    })
  })

  process.stdout.write(JSON.stringify(messages))
}

runTest().finally(() => {
  fs.unlinkSync(configPath)
})
