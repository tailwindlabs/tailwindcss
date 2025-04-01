import { isGitIgnored } from 'globby'
import path from 'node:path'
import postcss, { type Result } from 'postcss'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { segment } from '../../../../tailwindcss/src/utils/segment'
import { Stylesheet, type StylesheetConnection } from '../../stylesheet'
import { error, highlight, relative } from '../../utils/renderer'
import { resolveCssId } from '../../utils/resolve'

export async function analyze(stylesheets: Stylesheet[]) {
  let isIgnored = await isGitIgnored()
  let processingQueue: (() => Promise<Result>)[] = []
  let stylesheetsByFile = new DefaultMap<string, Stylesheet | null>((file) => {
    // We don't want to process ignored files (like node_modules)
    if (isIgnored(file)) {
      return null
    }

    try {
      let sheet = Stylesheet.loadSync(file)

      // Mutate incoming stylesheets to include the newly discovered sheet
      stylesheets.push(sheet)

      // Queue up the processing of this stylesheet
      processingQueue.push(() => processor.process(sheet.root, { from: sheet.file! }))

      return sheet
    } catch {
      return null
    }
  })

  // Step 1: Record which `@import` rules point to which stylesheets
  // and which stylesheets are parents/children of each other
  let processor = postcss([
    {
      postcssPlugin: 'mark-import-nodes',
      AtRule: {
        import(node) {
          // Find what the import points to
          let id = node.params.match(/['"](.*)['"]/)?.[1]
          if (!id) return

          let basePath = node.source?.input.file
            ? path.dirname(node.source.input.file)
            : process.cwd()

          // Resolve the import to a file path
          let resolvedPath: string | false = false
          try {
            // We first try to resolve the file as relative to the current file
            // to mimic the behavior of `postcss-import` since that's what was
            // used to resolve imports in Tailwind CSS v3.
            if (id[0] !== '.') {
              try {
                resolvedPath = resolveCssId(`./${id}`, basePath)
              } catch {}
            }

            if (!resolvedPath) {
              resolvedPath = resolveCssId(id, basePath)
            }
          } catch (err) {
            // Import is a URL, we don't want to process these, but also don't
            // want to show an error message for them.
            if (id.startsWith('http://') || id.startsWith('https://') || id.startsWith('//')) {
              return
            }

            // Something went wrong, we can't resolve the import.
            error(
              `Failed to resolve import: ${highlight(id)} in ${highlight(relative(node.source?.input.file!, basePath))}. Skipping.`,
              { prefix: '↳ ' },
            )
            return
          }

          if (!resolvedPath) return

          // Find the stylesheet pointing to the resolved path
          let stylesheet = stylesheetsByFile.get(resolvedPath)

          // If it _does not_ exist in stylesheets we don't care and skip it
          // this is likely because its in node_modules or a workspace package
          // that we don't want to modify
          if (!stylesheet) return

          // Mark the import node with the ID of the stylesheet it points to
          // We will use these later to build lookup tables and modify the AST
          node.raws.tailwind_destination_sheet_id = stylesheet.id

          let parent = node.source?.input.file
            ? stylesheetsByFile.get(node.source.input.file)
            : undefined

          let layers: string[] = []

          for (let part of segment(node.params, ' ')) {
            if (!part.startsWith('layer(')) continue
            if (!part.endsWith(')')) continue

            layers.push(part.slice(6, -1).trim())
          }

          // Connect sheets together in a dependency graph
          if (parent) {
            let meta = { layers }
            stylesheet.parents.add({ item: parent, meta })
            parent.children.add({ item: stylesheet, meta })
          }
        },
      },
    },
  ])

  // Seed the map with all the known stylesheets, and queue up the processing of
  // each incoming stylesheet.
  for (let sheet of stylesheets) {
    if (sheet.file) {
      stylesheetsByFile.set(sheet.file, sheet)
      processingQueue.push(() => processor.process(sheet.root, { from: sheet.file ?? undefined }))
    }
  }

  // Process all the stylesheets from step 1
  while (processingQueue.length > 0) {
    let task = processingQueue.shift()!
    await task()
  }

  // ---

  let commonPath = process.cwd()

  function pathToString(path: StylesheetConnection[]) {
    let parts: string[] = []

    for (let connection of path) {
      if (!connection.item.file) continue

      let filePath = connection.item.file.replace(commonPath, '')
      let layers = connection.meta.layers.join(', ')

      if (layers.length > 0) {
        parts.push(`${filePath} (layers: ${layers})`)
      } else {
        parts.push(filePath)
      }
    }

    return parts.join(' <- ')
  }

  let lines: string[] = []

  for (let sheet of stylesheets) {
    if (!sheet.file) continue

    let { convertiblePaths, nonConvertiblePaths } = sheet.analyzeImportPaths()
    let isAmbiguous = convertiblePaths.length > 0 && nonConvertiblePaths.length > 0

    if (!isAmbiguous) continue

    sheet.canMigrate = false

    let filePath = sheet.file.replace(commonPath, '')

    for (let path of convertiblePaths) {
      lines.push(`- ${filePath} <- ${pathToString(path)}`)
    }

    for (let path of nonConvertiblePaths) {
      lines.push(`- ${filePath} <- ${pathToString(path)}`)
    }
  }

  if (lines.length === 0) {
    let tailwindRootLeafs = new Set<Stylesheet>()

    for (let sheet of stylesheets) {
      // If the current file already contains `@config`, then we can assume it's
      // a Tailwind CSS root file.
      sheet.root.walkAtRules('config', () => {
        sheet.isTailwindRoot = true
        return false
      })
      if (sheet.isTailwindRoot) continue

      // If an `@tailwind` at-rule, or `@import "tailwindcss"` is present,
      // then we can assume it's a file where Tailwind CSS might be configured.
      //
      // However, if 2 or more stylesheets exist with these rules that share a
      // common parent, then we want to mark the common parent as the root
      // stylesheet instead.
      sheet.root.walkAtRules((node) => {
        if (
          node.name === 'tailwind' ||
          (node.name === 'import' && node.params.match(/^["']tailwindcss["']/)) ||
          (node.name === 'import' && node.params.match(/^["']tailwindcss\/.*?["']$/))
        ) {
          sheet.isTailwindRoot = true
          tailwindRootLeafs.add(sheet)
        }
      })
    }

    // Only a single Tailwind CSS root file exists, no need to do anything else.
    if (tailwindRootLeafs.size <= 1) {
      return
    }

    // Mark the common parent as the root file
    {
      // Group each sheet from tailwindRootLeafs by their common parent
      let commonParents = new DefaultMap<Stylesheet, Set<Stylesheet>>(() => new Set<Stylesheet>())

      // Seed common parents with leafs
      for (let sheet of tailwindRootLeafs) {
        commonParents.get(sheet).add(sheet)
      }

      // If any 2 common parents come from the same tree, then all children of
      // parent A and parent B will be moved to the parent of parent A and
      // parent B. Parent A and parent B will be removed.
      let repeat = true
      repeat: while (repeat) {
        repeat = false

        for (let [sheetA, childrenA] of commonParents) {
          for (let [sheetB, childrenB] of commonParents) {
            if (sheetA === sheetB) continue

            // Ancestors from self to root. Reversed order so we find the
            // nearest common parent first
            //
            // Including self because if you compare a sheet with its parent,
            // then the parent is still the common sheet between the two. In
            // this case, the parent is the root file.
            let ancestorsA = [sheetA].concat(Array.from(sheetA.ancestors()).reverse())
            let ancestorsB = [sheetB].concat(Array.from(sheetB.ancestors()).reverse())

            for (let parentA of ancestorsA) {
              for (let parentB of ancestorsB) {
                if (parentA !== parentB) continue

                // Found the parent
                let parent = parentA

                commonParents.delete(sheetA)
                commonParents.delete(sheetB)

                for (let child of childrenA) {
                  commonParents.get(parent).add(child)
                }

                for (let child of childrenB) {
                  commonParents.get(parent).add(child)
                }

                // Found a common parent between sheet A and sheet B. We can
                // stop looking for more common parents between A and B, and
                // continue with the next sheet.
                repeat = true
                continue repeat
              }
            }
          }
        }
      }

      // Mark the common parent as the Tailwind CSS root file, and remove the
      // flag from each leaf.
      for (let [parent, children] of commonParents) {
        parent.isTailwindRoot = true

        for (let child of children) {
          if (parent === child) continue

          child.isTailwindRoot = false
        }
      }
      return
    }
  }

  {
    let error = `You have one or more stylesheets that are imported into a utility layer and non-utility layer.\n`
    error += `We cannot convert stylesheets under these conditions. Please look at the following stylesheets:\n`

    throw new Error(error + lines.join('\n'))
  }
}
