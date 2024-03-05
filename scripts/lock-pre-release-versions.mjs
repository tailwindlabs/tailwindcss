import { exec } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import prettier from 'prettier'

exec('pnpm --silent --filter=!./playgrounds/* -r exec pwd', async (err, stdout) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  let paths = stdout
    .trim()
    .split('\n')
    .map((x) => path.resolve(x, 'package.json'))

  for (let path of paths) {
    let pkg = await fs.readFile(path, 'utf8').then(JSON.parse)

    // In our case, all pre-release like versions have a `-` in the version
    // number.
    //
    // E.g.:
    //
    // - `0.0.0-development.0`
    // - `0.0.0-insiders.{hash}`
    if (!pkg.version?.includes('-')) continue

    let shouldUpdate = false

    for (let group of [
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ]) {
      for (let [name, version] of Object.entries(pkg[group] ?? {})) {
        if (version === 'workspace:*' || !version.startsWith('workspace:')) continue

        // Set the version to `workspace:*`, we don't need to know the exact
        // version because `pnpm` will handle it for us at publishing time.
        pkg[group][name] = 'workspace:*'

        // Whether or not we should update the `package.json` file.
        shouldUpdate = true
      }
    }

    if (shouldUpdate) {
      await fs.writeFile(
        path,
        await prettier
          .format(JSON.stringify(pkg, null, 2), { filepath: path })
          .then((x) => `${x.trim()}\n`),
      )
    }
  }

  console.log('Done.')
})
