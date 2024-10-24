import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const cwd = path.join(__dirname, '..')

let originalLockfile = await fs.readFile(path.join(cwd, '../../pnpm-lock.yaml'), 'utf-8')

console.log('Overwriting dependencies for @tailwindcss/upgrade')

// Apply package patches
let json = JSON.parse(await fs.readFile('package.json', 'utf-8'))
json.pnpm = {
  overrides: {
    '@tailwindcss/upgrade>tailwindcss': 'file:../../dist/tailwindcss.tgz',
    '@tailwindcss/upgrade>@tailwindcss/node': 'file:../../dist/tailwindcss-node.tgz',
  },
}
json.devDependencies['@tailwindcss/upgrade'] = 'file:../../dist/tailwindcss-upgrade.tgz'
await fs.writeFile('package.json', JSON.stringify(json, null, 2))

try {
  execSync('pnpm install --ignore-workspace', { cwd })
} catch (error) {
  console.error(error.stdout?.toString() ?? error)
}

execSync('npx @tailwindcss/upgrade --force', { cwd, stdio: 'inherit' })

// Undo package patches
json = JSON.parse(await fs.readFile('package.json', 'utf-8'))
delete json.pnpm
delete json.devDependencies['@tailwindcss/upgrade']
await fs.writeFile('package.json', JSON.stringify(json, null, 2))

// Restore original lockfile (to avoid unnecessary changes in git diff)
await fs.writeFile(path.join(cwd, '../../pnpm-lock.yaml'), originalLockfile)
await fs.unlink(path.join(cwd, 'pnpm-lock.yaml'))
