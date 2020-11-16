const fs = require('fs')
const path = require('path')
const merge = require('lodash/merge')

function fromRootPath(...paths) {
  return path.resolve(process.cwd(), ...paths)
}

function copy(fromPath, toPath) {
  fs.copyFileSync(fromPath, toPath)
}

if (process.argv.includes('--prepare')) {
  if (
    fs.existsSync(fromRootPath('package.postcss8.json')) ||
    fs.existsSync(fromRootPath('src', 'index.postcss8.js'))
  ) {
    console.error('\n\n[ABORT] Already in PostCSS 7 compatibility mode!\n\n')
    process.exit(1)
  }

  const mainPackageJson = require('../package.json')
  const compatPackageJson = require('../package.postcss7.json')

  // 1. Backup original package.json file
  copy(fromRootPath('package.json'), fromRootPath('package.postcss8.json'))

  // 2. Backup src/index.js file
  copy(fromRootPath('src', 'index.js'), fromRootPath('src', 'index.postcss8.js'))

  // 3. Use the PostCSS 7 compat file
  copy(fromRootPath('src', 'index.postcss7.js'), fromRootPath('src', 'index.js'))

  // 4. Deep merge package.json contents
  const packageJson = merge({}, mainPackageJson, compatPackageJson)

  // 5. Remove peerDependencies
  delete packageJson.peerDependencies

  // 6. Write package.json with the new contents
  fs.writeFileSync(fromRootPath('package.json'), JSON.stringify(packageJson, null, 2), 'utf8')

  // 7. Print some useful information to make publishing easy
  console.log()
  console.log('You can safely publish `tailwindcss` in PostCSS 7 compatibility mode:\n')
  console.log(
    [
      // Not necessary, but a quick 'hash', basically the current date/time
      `git checkout -b compat-${new Date()
        .toJSON()
        .replace(/[-:.TZ]/g, '') // Remove weird characters
        .slice(0, -3)}`, // Remove milliseconds precision
      'git add .',
      'git commit -m "compat"',
      'npm version',
      'npm publish --tag compat',
      'npm run compat:restore',
    ]
      .map((v) => `  ${v}`)
      .join('\n')
  )
  console.log()
} else if (process.argv.includes('--restore')) {
  if (
    !fs.existsSync(fromRootPath('package.postcss8.json')) ||
    !fs.existsSync(fromRootPath('src', 'index.postcss8.js'))
  ) {
    console.error('\n\n[ABORT] Already in latest PostCSS mode!\n\n')
    process.exit(1)
  }

  // 1. Restore original package.json file
  copy(fromRootPath('package.postcss8.json'), fromRootPath('package.json'))

  // 2. Restore src/index.js file
  copy(fromRootPath('src', 'index.postcss8.js'), fromRootPath('src', 'index.js'))

  // 3. Cleanup PostCSS 8 related files
  fs.unlinkSync(fromRootPath('package.postcss8.json'))
  fs.unlinkSync(fromRootPath('src', 'index.postcss8.js'))

  // 4. Done
  console.log()
  console.log('Restored from PostCSS 7 mode to latest PostCSS mode!')
  console.log()
}
