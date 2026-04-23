import { spawnSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { isWindows, rustEnv } from './rust-env.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const cwd = process.cwd()

const task = process.argv[2]
const passthrough = process.argv.slice(3)

const predefinedCommands = {
  build: [['turbo', ['build', '--filter=!./playgrounds/*']]],
  dev: [['turbo', ['dev', '--filter=!./playgrounds/*']]],
  test: [
    ['cargo', ['test']],
    ['vitest', ['run', '--hideSkippedTests']],
  ],
  'test:integrations': [['vitest', ['--root=./integrations']]],
  'test:ui': [
    ['pnpm', ['run', '--filter=tailwindcss', 'test:ui']],
    ['pnpm', ['run', '--filter=@tailwindcss/browser', 'test:ui']],
  ],
  vite: [['pnpm', ['run', '--filter=vite-playground', 'dev']]],
  nextjs: [['pnpm', ['run', '--filter=nextjs-playground', 'dev']]],
}

let commands = predefinedCommands[task]

if (passthrough[0] === '--') {
  commands = [[passthrough[1], passthrough.slice(2)]]
} else if (commands && passthrough.length > 0) {
  commands = commands.map((entry, index) => {
    if (index !== commands.length - 1) return entry
    return [entry[0], [...entry[1], ...passthrough]]
  })
}

if (!task || !commands) {
  console.error(`Unknown task: ${task ?? '(missing)'}`)
  process.exit(1)
}

let preflight = spawnSync(process.execPath, [path.join(root, 'scripts', 'preflight.mjs'), task], {
  cwd,
  env: rustEnv,
  stdio: 'inherit',
})

if (preflight.status !== 0) {
  process.exit(preflight.status ?? 1)
}

for (let [command, args] of commands) {
  let result = spawnSync(command, args, {
    cwd,
    env: rustEnv,
    stdio: 'inherit',
    shell: isWindows,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}