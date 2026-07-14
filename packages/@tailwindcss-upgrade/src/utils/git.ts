import { execSync } from 'node:child_process'

export function gitRoot(cwd?: string): string | null {
  try {
    return execSync('git rev-parse --show-toplevel', {
      encoding: 'utf-8',
      cwd,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return null
  }
}

export function isRepoDirty(cwd?: string) {
  try {
    let stdout = execSync('git status --porcelain', { encoding: 'utf-8', cwd })
    return stdout.trim() !== ''
  } catch (error) {
    // If it's not a git repository we don't know if it's dirty or not. But we
    // also don't want to block the migration. Maybe we can still fail and
    // require a `--force` flag?
    if (error?.toString?.().includes('not a git repository')) {
      return false
    }

    return true
  }
}
