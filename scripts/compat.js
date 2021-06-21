let fs = require('fs')
let path = require('path')
let merge = require('lodash/merge')
let fastGlob = require('fast-glob')

let postcss7 = fastGlob.sync(['./**/*.postcss7.*']).filter((file) => !file.startsWith('lib/'))
let postcss8 = fastGlob.sync(['./**/*.postcss8.*']).filter((file) => !file.startsWith('lib/'))

if (process.argv.includes('--prepare')) {
  if (postcss8.length > 0) {
    console.error('\n\n[ABORT] Already in PostCSS 7 compatibility mode!\n\n')
    process.exit(1)
  }

  let mainPackageJson = require('../package.json')
  let compatPackageJson = require('../package.postcss7.json')

  // Use postcss7 files
  for (let file of postcss7) {
    let bareFile = file.replace('.postcss7', '')
    let postcss8File = file.replace('.postcss7', '.postcss8')

    // Backup
    copy(fromRootPath(bareFile), fromRootPath(postcss8File))

    // Swap
    copy(fromRootPath(file), fromRootPath(bareFile))
  }

  // Deep merge package.json contents
  let packageJson = merge({}, mainPackageJson, compatPackageJson)

  // Remove peerDependencies
  delete packageJson.peerDependencies

  // Cleanup devDependencies
  for (let key in packageJson.devDependencies) {
    if (key.includes('postcss')) delete packageJson.devDependencies[key]
  }

  // Use new name
  packageJson.name = '@tailwindcss/postcss7-compat'

  // Make sure you can publish
  packageJson.publishConfig = { access: 'public' }

  // Write package.json with the new contents
  fs.writeFileSync(fromRootPath('package.json'), JSON.stringify(packageJson, null, 2), 'utf8')

  // Print some useful information to make publishing easy
  console.log()
  console.log('You can safely publish `tailwindcss` in PostCSS 7 compatibility mode:\n')
  console.log()
} else if (process.argv.includes('--restore')) {
  if (postcss8.length === 0) {
    console.error('\n\n[ABORT] Already in latest PostCSS mode!\n\n')
    process.exit(1)
  }

  // Use postcss8 files
  for (let file of postcss8) {
    let bareFile = file.replace('.postcss8', '')

    // Restore
    copy(fromRootPath(file), fromRootPath(bareFile))

    // Remove
    fs.unlinkSync(fromRootPath(file))
  }

  // Done
  console.log()
  console.log('Restored from PostCSS 7 mode to latest PostCSS mode!')
  console.log()
}

// ---

function fromRootPath(...paths) {
  return path.resolve(process.cwd(), ...paths)
}

function copy(fromPath, toPath) {
  fs.copyFileSync(fromPath, toPath)
}
