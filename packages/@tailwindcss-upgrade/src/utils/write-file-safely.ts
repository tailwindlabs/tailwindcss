import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function writeFileSafely(file: string, contents: string) {
  // Start by creating a new file in the current directory that is guaranteed to
  // be unique (via `uuid`). We can embed the `process.id` in case we need to
  // debug things later.
  //
  // While we can write this to a more global `/tmp` folder, I want to be 100%
  // sure that we are on the same file system (same drive) so the rename
  // operation is atomic. Once the file is written, we will rename the file. If
  // this fails, the old file is still intact, if it works we have an updated
  // file.
  //
  // If this still causes problems (but it will slow things down):
  // 1. We could make sure that we inherit the file permissions
  // 2. Use an explicit fsync to force a flush to disk
  let temporaryFile = path.join(
    path.dirname(file),
    `.${path.basename(file)}.tailwind-upgrade.${process.pid}.${randomUUID()}.tmp`,
  )

  // Write file uses the `w` flag by default, which is defined as:
  // > Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
  // > https://nodejs.org/api/fs.html#file-system-flags
  //
  // Which means that if this function is actively running, and you cancel the
  // process at the wrong time, then the truncated files are present. Since all
  // these migrations happen in parallel, multiple files are open and available
  // to be written to, it could mean in multiple truncated files.
  //
  // Writing to a temp file first means that if the process is cancelled at this
  // point, that the old original file is still correct.
  //
  // The rename part should be atomic (especially because we guarantee it to be
  // on the same file system) so this either succeeds or doesn't happen.
  try {
    await fs.writeFile(temporaryFile, contents, 'utf8')
    await fs.rename(temporaryFile, file)
  } catch (error) {
    await fs.unlink(temporaryFile).catch(() => {})
    throw error
  }
}
