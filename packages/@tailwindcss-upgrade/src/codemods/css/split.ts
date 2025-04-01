import postcss from 'postcss'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { Stylesheet, type StylesheetId } from '../../stylesheet'
import { walk, WalkAction } from '../../utils/walk'

export async function split(stylesheets: Stylesheet[]) {
  let stylesheetsById = new Map<StylesheetId, Stylesheet>()
  let stylesheetsByFile = new Map<string, Stylesheet>()

  for (let sheet of stylesheets) {
    stylesheetsById.set(sheet.id, sheet)

    if (sheet.file) {
      stylesheetsByFile.set(sheet.file, sheet)
    }
  }

  // Keep track of sheets that contain `@utility` rules
  let requiresSplit = new Set<Stylesheet>()

  for (let sheet of stylesheets) {
    // Root files don't need to be split
    if (sheet.isTailwindRoot) continue

    let containsUtility = false
    let containsUnsafe = sheet.layers().size > 0

    walk(sheet.root, (node) => {
      if (node.type === 'atrule' && node.name === 'utility') {
        containsUtility = true
      }

      // Safe to keep without splitting
      else if (
        // An `@import "…" layer(…)` is safe
        (node.type === 'atrule' && node.name === 'import' && node.params.includes('layer(')) ||
        // @layer blocks are safe
        (node.type === 'atrule' && node.name === 'layer') ||
        // Comments are safe
        node.type === 'comment'
      ) {
        return WalkAction.Skip
      }

      // Everything else is not safe, and requires a split
      else {
        containsUnsafe = true
      }

      // We already know we need to split this sheet
      if (containsUtility && containsUnsafe) {
        return WalkAction.Stop
      }

      return WalkAction.Skip
    })

    if (containsUtility && containsUnsafe) {
      requiresSplit.add(sheet)
    }
  }

  // Split every imported stylesheet into two parts
  let utilitySheets = new Map<Stylesheet, Stylesheet>()

  for (let sheet of stylesheets) {
    // Ignore stylesheets that were not imported
    if (!sheet.file) continue
    if (sheet.parents.size === 0) continue

    // Skip stylesheets that don't have utilities
    // and don't have any children that have utilities
    if (!requiresSplit.has(sheet)) {
      if (!Array.from(sheet.descendants()).some((child) => requiresSplit.has(child))) {
        continue
      }
    }

    let utilities = postcss.root()

    walk(sheet.root, (node) => {
      if (node.type !== 'atrule') return
      if (node.name !== 'utility') return

      // `append` will move this node from the original sheet
      // to the new utilities sheet
      utilities.append(node)

      return WalkAction.Skip
    })

    let newFileName = sheet.file.replace(/\.css$/, '.utilities.css')

    let counter = 0

    // If we already have a utility sheet with this name, we need to rename it
    while (stylesheetsByFile.has(newFileName)) {
      counter += 1
      newFileName = sheet.file.replace(/\.css$/, `.utilities.${counter}.css`)
    }

    let utilitySheet = await Stylesheet.fromRoot(utilities, newFileName)

    utilitySheet.extension = counter > 0 ? `.utilities.${counter}.css` : `.utilities.css`

    utilitySheets.set(sheet, utilitySheet)
    stylesheetsById.set(utilitySheet.id, utilitySheet)
  }

  // Make sure the utility sheets are linked to one another
  for (let [normalSheet, utilitySheet] of utilitySheets) {
    for (let parent of normalSheet.parents) {
      let utilityParent = utilitySheets.get(parent.item)
      if (!utilityParent) continue
      utilitySheet.parents.add({
        item: utilityParent,
        meta: parent.meta,
      })
    }

    for (let child of normalSheet.children) {
      let utilityChild = utilitySheets.get(child.item)
      if (!utilityChild) continue
      utilitySheet.children.add({
        item: utilityChild,
        meta: child.meta,
      })
    }
  }

  for (let sheet of stylesheets) {
    let utilitySheet = utilitySheets.get(sheet)
    let utilityImports: Set<postcss.AtRule> = new Set()

    for (let node of sheet.importRules) {
      let sheetId = node.raws.tailwind_destination_sheet_id as StylesheetId | undefined

      // This import rule does not point to a stylesheet
      // which likely means it points to `node_modules`
      if (!sheetId) continue

      let originalDestination = stylesheetsById.get(sheetId)

      // This import points to a stylesheet that no longer exists which likely
      // means it was removed by the optimizer this will be cleaned up later
      if (!originalDestination) continue

      let utilityDestination = utilitySheets.get(originalDestination)

      // A utility sheet doesn't exist for this import so it doesn't need
      // to be processed
      if (!utilityDestination) continue

      let match = node.params.match(/(['"])(.*)\1/)
      if (!match) return

      let quote = match[1]
      let id = match[2]

      let newFile = id.replace(/\.css$/, utilityDestination.extension!)

      // The import will just point to the new file without any media queries,
      // layers, or other conditions because `@utility` MUST be top-level.
      let newImport = node.clone({
        params: `${quote}${newFile}${quote}`,
        raws: {
          tailwind_injected_layer: node.raws.tailwind_injected_layer,
          tailwind_original_params: `${quote}${id}${quote}`,
          tailwind_destination_sheet_id: utilityDestination.id,
        },
      })

      if (utilitySheet) {
        // If this import is intended to go into the utility sheet
        // we'll collect it into a list to add later. If we don't'
        // we'll end up adding them in reverse order.
        utilityImports.add(newImport)
      } else {
        // This import will go immediately after the original import
        node.after(newImport)
      }
    }

    // Add imports to the top of the utility sheet if necessary
    if (utilitySheet && utilityImports.size > 0) {
      utilitySheet.root.prepend(Array.from(utilityImports))
    }
  }

  // Tracks the at rules that import a given stylesheet
  let importNodes = new DefaultMap<Stylesheet, Set<postcss.AtRule>>(() => new Set())

  for (let sheet of stylesheetsById.values()) {
    for (let node of sheet.importRules) {
      let sheetId = node.raws.tailwind_destination_sheet_id as StylesheetId | undefined

      // This import rule does not point to a stylesheet
      if (!sheetId) continue

      let destination = stylesheetsById.get(sheetId)

      // This import rule does not point to a stylesheet that exists
      // We'll remove it later
      if (!destination) continue

      importNodes.get(destination).add(node)
    }
  }

  // At this point we've created many `{name}.utilities.css` files.
  // If the original file _becomes_ empty after splitting that means that
  // dedicated utility file is not required and we can move the utilities
  // back to the original file.
  //
  // This could be done in one step but separating them makes it easier to
  // reason about since the stylesheets are in a consistent state before we
  // perform any cleanup tasks.
  let list: Stylesheet[] = []

  for (let sheet of stylesheets.slice()) {
    for (let child of sheet.descendants()) {
      list.push(child)
    }

    list.push(sheet)
  }

  for (let sheet of list) {
    let utilitySheet = utilitySheets.get(sheet)

    // This sheet was not split so there's nothing to do
    if (!utilitySheet) continue

    // This sheet did not become empty
    if (!sheet.isEmpty) continue

    // We have a sheet that became empty after splitting
    // 1. Replace the sheet with it's utility sheet content
    sheet.root = utilitySheet.root

    // 2. Rewrite imports in parent sheets to point to the original sheet
    // Ideally this wouldn't need to be _undone_ but instead only done once at the end
    for (let node of importNodes.get(utilitySheet)) {
      node.params = node.raws.tailwind_original_params as any
    }

    // 3. Remove the original import from the non-utility sheet
    for (let node of importNodes.get(sheet)) {
      node.remove()
    }

    // 3. Mark the utility sheet for removal
    utilitySheets.delete(sheet)
  }

  stylesheets.push(...utilitySheets.values())
}
