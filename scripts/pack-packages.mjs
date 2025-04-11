import { exec, execSync } from 'node:child_process'
import fs from 'node:fs/promises'
import { platform } from 'node:os'
import path, { dirname } from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
let root = path.resolve(__dirname, '..')

let command = platform() === 'win32' ? 'cd' : 'pwd'
let rawPaths = execSync(`pnpm --silent --filter=!./playgrounds/* -r exec ${command}`).toString()

let paths = rawPaths
  .trim()
  .split(/\r?\n/)
  .map((x) => path.join(x, 'package.json'))

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
      return new Promise((resolve) => {
        exec(
          `pnpm pack --pack-gzip-level=0 --pack-destination="${path.join(root, 'dist').replace(/\\/g, '\\\\')}"`,
          { cwd: dir },
          (err, stdout, stderr) => {
            if (err) {
              console.error(err, stdout, stderr)
            }

            resolve(lastLine(stdout.trim()))
          },
        )
      })
    }

    let filename = await pack()
    // Remove version suffix
    await fs.rename(
      path.join(root, 'dist', path.basename(filename)),
      path.join(root, 'dist', pkgToFilename(name)),
    )
  }),
).then(() => {
  console.log('Done.')
})

function pkgToFilename(name) {
  return `${name.replace('@', '').replace('/', '-')}.tgz`
}

function lastLine(str) {
  let index = str.lastIndexOf('\n')
  if (index === -1) return str
  return str.slice(index + 1)
}
