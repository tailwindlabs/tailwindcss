const fs = require('fs')
const path = require('path')
const merge = require('lodash/merge')

function fromRootPath(...paths) {
  return path.resolve(process.cwd(), ...paths)
}

function backupPath(...paths) {
  return path.resolve(process.cwd(), 'node_modules', '__tw_cache__', ...paths)
}

function copy(fromPath, toPath) {
  fs.mkdirSync(path.dirname(toPath), { recursive: true })
  fs.copyFileSync(fromPath, toPath)
}

if (process.argv.includes('--prepare')) {
  const mainPackageJson = require('../package.json')
  const compatPackageJson = require('../package.postcss7.json')

  // 1. Backup original package.json file
  copy(fromRootPath('package.json'), backupPath('package.json'))

  // 2. Backup lib/index.js file
  copy(fromRootPath('lib', 'index.js'), backupPath('lib', 'index.js'))

  // 3. Use the postcss7 compat file
  copy(fromRootPath('lib', 'index.postcss7.js'), fromRootPath('lib', 'index.js'))

  // 4. Deep merge package.json contents
  const packageJson = merge({}, mainPackageJson, compatPackageJson)

  // 5. Write package.json with the new contents
  fs.writeFileSync(fromRootPath('package.json'), JSON.stringify(packageJson, null, 2), 'utf8')

  // 6. Print some useful information to make publishing easy
  console.log()
  console.log('You can safely publish `tailwindcss` in PostCSS 7 compatibility mode:\n')
  console.log(
    ['npm version', 'npm publish --tag compat', 'npm run compat:restore']
      .map((v) => `  ${v}`)
      .join('\n')
  )
  console.log()
} else if (process.argv.includes('--restore')) {
  // 1. Restore original package.json file
  copy(backupPath('package.json'), fromRootPath('package.json'))
  fs.unlinkSync(backupPath('package.json'))

  // 2. Restore lib/index.js file
  copy(backupPath('lib', 'index.js'), fromRootPath('lib', 'index.js'))
  fs.unlinkSync(backupPath('lib', 'index.js'))

  // 3. Done
  console.log()
  console.log('Restored from PostCSS 7 mode to latest PostCSS mode!')
  console.log()
}
