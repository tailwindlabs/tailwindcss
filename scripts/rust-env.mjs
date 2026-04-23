import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'

export const isWindows = process.platform === 'win32'

const home = process.env.USERPROFILE ?? process.env.HOME ?? process.env.HOMEPATH ?? ''

export const cargoHome = process.env.CARGO_HOME ?? (home ? path.join(home, '.cargo') : '')
export const rustupHome = process.env.RUSTUP_HOME ?? (home ? path.join(home, '.rustup') : '')
export const cargoBin = cargoHome ? path.join(cargoHome, 'bin') : ''

export const mergedPath = cargoBin
  ? [cargoBin, process.env.PATH ?? ''].filter(Boolean).join(path.delimiter)
  : process.env.PATH ?? ''

export const rustEnv = {
  ...process.env,
  ...(cargoHome ? { CARGO_HOME: cargoHome } : {}),
  ...(rustupHome ? { RUSTUP_HOME: rustupHome } : {}),
  PATH: mergedPath,
  ...(isWindows
    ? {
        RUSTUP_TOOLCHAIN:
          process.env.RUSTUP_TOOLCHAIN ?? 'stable-x86_64-pc-windows-msvc',
      }
    : {}),
}

export function commandExists(command, { cwd = process.cwd() } = {}) {
  let result = spawnSync(command, ['--version'], {
    cwd,
    env: rustEnv,
    stdio: 'ignore',
    shell: isWindows,
  })

  return !result.error && result.status === 0
}

export function readInstalledRustTargets({ cwd = process.cwd() } = {}) {
  let result = spawnSync('rustup', ['target', 'list', '--installed'], {
    cwd,
    env: rustEnv,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: isWindows,
  })

  if (result.error || result.status !== 0) {
    return null
  }

  return new Set(result.stdout.split(/\r?\n/).filter(Boolean))
}

export function hasDefaultCargoBin() {
  return Boolean(cargoBin) && fs.existsSync(cargoBin)
}