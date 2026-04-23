import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  cargoBin,
  commandExists,
  hasDetectedCargoBin,
  readInstalledRustTargets,
  rustEnv,
} from './rust-env.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const command = process.argv[2] ?? 'doctor'
const wasmTarget = 'wasm32-wasip1-threads'

const contexts = {
  doctor: {
    label: 'pnpm run check:env',
    needsRust: true,
    needsWasmTarget: true,
  },
  build: {
    label: 'pnpm build',
    needsRust: true,
    needsWasmTarget: true,
  },
  dev: {
    label: 'pnpm dev',
    needsRust: true,
    needsWasmTarget: true,
  },
  test: {
    label: 'pnpm test',
    needsRust: true,
    needsWasmTarget: false,
  },
  'test:integrations': {
    label: 'pnpm test:integrations',
    needsRust: true,
    needsWasmTarget: true,
    needsBuildArtifacts: true,
  },
  'test:ui': {
    label: 'pnpm test:ui',
    needsRust: true,
    needsWasmTarget: true,
    needsBuildArtifacts: true,
  },
  vite: {
    label: 'pnpm vite',
    needsRust: true,
    needsWasmTarget: true,
    needsBuildArtifacts: true,
    needsBun: true,
  },
  nextjs: {
    label: 'pnpm nextjs',
    needsRust: true,
    needsWasmTarget: true,
    needsBuildArtifacts: true,
  },
}

const context = contexts[command] ?? contexts.doctor

const requiredArtifacts = [
  'crates/node/index.js',
  'packages/tailwindcss/dist/lib.js',
]

function run(command, args) {
  return spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: rustEnv,
  })
}

function formatList(items) {
  return items.map((item) => `- ${item}`).join('\n')
}

function relativeArtifact(artifact) {
  return artifact.replace(/\\/g, '/')
}

let errors = []
let warnings = []

if (context.needsRust) {
  let missingRustTools = ['cargo', 'rustc'].filter((tool) => !commandExists(tool))

  if (missingRustTools.length > 0) {
    errors.push({
      title: 'Missing required Rust tools',
      body: [
        formatList(missingRustTools),
        'How to fix:',
        '1. Install Rustup from https://rustup.rs/',
        hasDetectedCargoBin()
          ? `2. Rust appears to be installed in the detected Cargo bin directory (${cargoBin}), so rerun the command through the repo scripts such as \`pnpm build\` or \`pnpm run check:env\`.`
          : '2. If you installed Rustup to a custom location, make sure `CARGO_HOME`, `RUSTUP_HOME`, or your PATH points at the installation.',
        '3. Run `rustup default stable`.',
        `4. Run \`rustup target add ${wasmTarget}\`.`,
      ].join('\n'),
    })
  }

  if (!commandExists('rustup')) {
    warnings.push(
      'rustup was not found, so the script could not verify the installed WASM targets.',
    )
  } else if (context.needsWasmTarget) {
    let installedTargets = readInstalledRustTargets()

    if (installedTargets === null) {
      warnings.push('Could not read the installed Rust targets from rustup.')
    } else if (!installedTargets.has(wasmTarget)) {
      errors.push({
        title: 'Missing required Rust target',
        body: [`- ${wasmTarget}`, `Run \`rustup target add ${wasmTarget}\`.`].join('\n'),
      })
    }
  }
}

if (context.needsBun && !commandExists('bun')) {
  errors.push({
    title: 'Missing required tool for the Vite playground',
    body: [
      '- bun',
      'The Vite playground uses `bun --bun vite`.',
      'Install Bun, or validate Vite changes with `pnpm build && pnpm test:integrations -- --run integrations/vite`.',
    ].join('\n'),
  })
}

if (context.needsBuildArtifacts) {
  let missingArtifacts = requiredArtifacts.filter((artifact) => {
    return !fs.existsSync(path.join(root, artifact))
  })

  if (missingArtifacts.length > 0) {
    errors.push({
      title: 'Missing build artifacts required by this command',
      body: [
        formatList(missingArtifacts.map(relativeArtifact)),
        'Run `pnpm build` first, then retry this command.',
      ].join('\n'),
    })
  }
}

if (errors.length > 0) {
  console.error(`Environment preflight failed for ${context.label}.`)
  console.error('')

  for (let error of errors) {
    console.error(`${error.title}:`)
    console.error(error.body)
    console.error('')
  }

  if (warnings.length > 0) {
    console.error('Warnings:')
    console.error(formatList(warnings))
    console.error('')
  }

  process.exit(1)
}

if (command === 'doctor') {
  console.log(`Environment preflight passed for ${context.label}.`)

  if (warnings.length > 0) {
    console.log('')
    console.log('Warnings:')
    console.log(formatList(warnings))
  }
}