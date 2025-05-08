import { execSync } from 'node:child_process'

export function isRepoDirty() {
  try {
    let stdout = execSync('git status --porcelain', { encoding: 'utf-8' })
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
