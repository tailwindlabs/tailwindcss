let fs = require('fs')
let path = require('path')

let engines = {
  stable: {
    files: [
      path.resolve(__dirname, '..', 'package.stable.json'),
      path.resolve(__dirname, '..', 'package-lock.stable.json'),
    ],
  },
  oxide: {
    files: [
      path.resolve(__dirname, '..', 'package.oxide.json'),
      path.resolve(__dirname, '..', 'package-lock.oxide.json'),
    ],
  },
}

// Find out what the current engine is that we are using:
let [otherEngine, info] = Object.entries(engines).find(([, info]) =>
  info.files.every((file) => fs.existsSync(file))
)
let currentEngine = otherEngine === 'oxide' ? 'stable' : 'oxide'

console.log(`Current engine: \`${currentEngine}\`, swapping to \`${otherEngine}\``)

// Swap the engines
for (let file of info.files) {
  fs.renameSync(
    file.replace(`.${otherEngine}`, ''),
    file.replace(`.${otherEngine}`, `.${currentEngine}`)
  )
}
for (let file of engines[otherEngine].files) {
  fs.renameSync(file, file.replace(`.${otherEngine}`, ''))
}

console.log(
  'Engines have been swapped. Make sure to run `npm install` to update your dependencies.'
)
