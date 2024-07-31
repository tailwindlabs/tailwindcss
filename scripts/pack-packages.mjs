import { execSync, exec, spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path, { dirname } from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
let root = path.resolve(__dirname, '..')

let rawPaths = execSync('pnpm --silent --filter=!./playgrounds/* -r exec pwd').toString()

let paths = rawPaths
  .trim()
  .split('\n')
  .map((x) => path.resolve(x, 'package.json'))

let workspaces = new Map()

// Track all the workspaces
for (let path of paths) {
  let pkg = await fs.readFile(path, 'utf8').then(JSON.parse)
  if (pkg.private) continue
  workspaces.set(pkg.name, { version: pkg.version ?? '', dir: dirname(path) })
}

// Clean dist folder
await fs.rm(path.join(root, 'dist'), { recursive: true, force: true })

Promise.all(
  [...workspaces.entries()].map(async ([name, { version, dir }]) => {
    function pack() {
      return new Promise((resovle) => {
        exec(
          `pnpm pack --pack-destination='${path.join(root, 'dist')}'`,
          {
            cwd: dir,
          },
          (err, stdout, stderr) => {
            if (err) {
              console.error(err, stdout, stderr)
            }

            resovle()
          },
        )
      })
    }

    await pack()
    // Remove version suffix
    await fs.rename(
      path.join(root, 'dist', pkgToFilename(name, version)),
      path.join(root, 'dist', pkgToFilename(name)),
    )
  }),
).then(() => {
  console.log('Done.')
})

function pkgToFilename(name, version) {
  return `${name.replace('@', '').replace('/', '-')}${version ? `-${version}` : ''}.tgz`
}
