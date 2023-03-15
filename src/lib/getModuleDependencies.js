import fs from 'fs'
import path from 'path'
import resolve from 'resolve'
import detective from 'detective-typescript'

function createModule(file) {
  let source = fs.readFileSync(file, 'utf-8')
  return { file, requires: detective(source, { mixedImports: true }) }
}

function* _getModuleDependencies(entryFile) {
  yield entryFile

  let mod = createModule(entryFile)

  let ext = path.extname(entryFile)
  let isTypeScript = ext === '.ts' || ext === '.cts' || ext === '.mts'
  let extensions = [...(isTypeScript ? ['.ts', '.cts', '.mts'] : []), '.js', '.cjs', '.mjs']

  // Iterate over the modules, even when new
  // ones are being added
  for (let dep of mod.requires) {
    // Only track local modules, not node_modules
    if (!dep.startsWith('./') && !dep.startsWith('../')) {
      continue
    }

    try {
      let basedir = path.dirname(mod.file)
      let depPath = resolve.sync(dep, { basedir, extensions })
      yield* _getModuleDependencies(depPath)
    } catch (_err) {
      // eslint-disable-next-line no-empty
    }
  }
}

export default function getModuleDependencies(entryFile) {
  return new Set(_getModuleDependencies(entryFile))
}
