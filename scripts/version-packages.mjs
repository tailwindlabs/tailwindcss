import { exec, spawnSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import url from 'node:url'
import prettier from 'prettier'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const version = process.argv[2] || null

// The known workspace is: @tailwindcss/oxide
// All the workspaces in `crates/node/npm/*` should always be in sync with
// `@tailwindcss/oxide`. You can think of them as one big package, but they are
// split into multiple packages because they are OS specific.
const syncedWorkspaces = new Map([
  [
    '@tailwindcss/oxide',
    [
      'crates/node/npm/android-arm-eabi',
      'crates/node/npm/android-arm64',
      'crates/node/npm/darwin-arm64',
      'crates/node/npm/darwin-x64',
      'crates/node/npm/freebsd-x64',
      'crates/node/npm/linux-arm-gnueabihf',
      'crates/node/npm/linux-arm64-gnu',
      'crates/node/npm/linux-arm64-musl',
      'crates/node/npm/linux-x64-gnu',
      'crates/node/npm/linux-x64-musl',
      'crates/node/npm/wasm32-wasi',
      'crates/node/npm/win32-arm64-msvc',
      'crates/node/npm/win32-x64-msvc',
    ],
  ],
  ['@tailwindcss/cli', ['packages/@tailwindcss-standalone']],
])

const inverseSyncedWorkspaces = new Map()

for (let [name, paths] of syncedWorkspaces) {
  for (let [idx, filePath] of paths.entries()) {
    // Make sure all the paths are absolute paths
    paths[idx] = path.resolve(root, filePath, 'package.json')

    // Make sure inverse lookup table exists
    inverseSyncedWorkspaces.set(paths[idx], name)
  }
}

exec(
  "pnpm --silent --filter='!./playgrounds/*' --filter='!./integrations' --filter='!./packages/internal-example-plugin' -r exec pwd",
  async (err, stdout) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    if (version !== null) {
      for (let pkgPath of stdout
        .trim()
        .split('\n')
        .map((x) => path.resolve(x, 'package.json'))) {
        let pkg = await fs.readFile(pkgPath, 'utf8').then(JSON.parse)
        let name = pkg.name
        if (version !== '') {
          // Ensure the version is set after the name and before everything else
          delete pkg.name
          delete pkg.version

          // This allows us to keep the order of the keys in the package.json
          pkg = { name, version, ...pkg }
        }

        await fs.writeFile(
          pkgPath,
          await prettier
            .format(JSON.stringify(pkg, null, 2), { filepath: pkgPath })
            .then((x) => `${x.trim()}\n`),
        )
      }

      console.log('Done.')
      return
    }

    let paths = stdout
      .trim()
      .split('\n')
      .map((x) => path.resolve(x, 'package.json'))
      // Workspaces that are in sync with another workspace should not be updated
      // manually, they should be updated by updating the main workspace.
      .filter((x) => !inverseSyncedWorkspaces.has(x))

    let workspaces = new Map()

    // Track all the workspaces
    for (let path of paths) {
      let pkg = await fs.readFile(path, 'utf8').then(JSON.parse)
      if (pkg.private) continue
      workspaces.set(pkg.name, { version: pkg.version ?? '', path })
    }

    // Build the editable output
    let lines = ['# Update the versions of the packages you want to change', '']
    for (let [name, info] of workspaces) {
      lines.push(`${name}: ${info.version}`)
    }
    let output = lines.join('\n')

    // Edit the file
    {
      // Figure out which editor to use.
      //
      // In this case we still split on whitespace, because it can happen that the
      // EDITOR env variable is configured as `code --wait`. This means that we
      // want `code` as the editor, but `--wait` is one of the arguments.
      let args = process.env.EDITOR.split(' ')
      let editor = args.shift()

      // Create a temporary file which will be edited
      let filepath = path.resolve(tmpdir(), `version-${randomUUID()}.txt`)
      await fs.writeFile(filepath, output)

      // Edit the file, once the editor is closed, the file will be saved and we
      // can read the changes
      spawnSync(editor, [...args, filepath], {
        stdio: 'inherit',
      })

      let newOutput = await fs.readFile(filepath, 'utf8').then((x) => x.trim().split('\n'))

      // Cleanup temporary file
      await fs.unlink(filepath)

      // Update the package.json files
      for (let line of newOutput) {
        if (line[0] === '#') continue // Skip comment lines
        if (line.trim() === '') continue // Skip empty lines

        let [name, version = ''] = line.split(':').map((x) => x.trim())

        // Figure out all the paths to the package.json files that need to be
        // updated with the new version
        let paths = [
          // The package.json file of the main workspace
          workspaces.get(name).path,

          // The package.json files of the workspaces that are in sync with the
          // main workspace
          ...(syncedWorkspaces.get(name) ?? []),
        ]

        for (let pkgPath of paths) {
          let pkg = await fs.readFile(pkgPath, 'utf8').then(JSON.parse)
          let name = pkg.name
          if (version !== '') {
            // Ensure the version is set after the name and before everything else
            delete pkg.name
            delete pkg.version

            // This allows us to keep the order of the keys in the package.json
            pkg = { name, version, ...pkg }
          }

          await fs.writeFile(
            pkgPath,
            await prettier
              .format(JSON.stringify(pkg, null, 2), { filepath: pkgPath })
              .then((x) => `${x.trim()}\n`),
          )
        }
      }
    }

    console.log('Done.')
  },
)
