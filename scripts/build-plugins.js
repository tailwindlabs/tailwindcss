let fs = require('fs')
let path = require('path')

let plugins = fs.readdirSync(fromRootPath('plugins'))

for (let plugin of plugins) {
  // Cleanup
  let pluginDest = fromRootPath(plugin)
  if (fs.existsSync(pluginDest)) {
    fs.rmdirSync(pluginDest, { recursive: true })
  }

  // Copy plugin over
  copyFolder(fromRootPath('plugins', plugin), pluginDest, (file) => {
    // Ignore test files
    if (file.endsWith('.test.js')) return false
    // Ignore postcss7 files
    if (file.endsWith('.postcss7.js')) return false
    // Ignore postcss8 files
    if (file.endsWith('.postcss8.js')) return false

    return true
  })
}

// ---

function fromRootPath(...paths) {
  return path.resolve(process.cwd(), ...paths)
}

function copy(fromPath, toPath) {
  fs.mkdirSync(path.dirname(toPath), { recursive: true }) // Ensure folder exists
  fs.copyFileSync(fromPath, toPath)
}

function copyFolder(fromPath, toPath, shouldCopy = () => true) {
  let stats = fs.statSync(fromPath)
  if (stats.isDirectory()) {
    let filesAndFolders = fs.readdirSync(fromPath)
    for (let file of filesAndFolders) {
      copyFolder(path.resolve(fromPath, file), path.resolve(toPath, file), shouldCopy)
    }
  } else if (shouldCopy(fromPath)) {
    copy(fromPath, toPath)
  }
}
