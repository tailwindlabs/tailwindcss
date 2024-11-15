import * as fsSync from 'node:fs'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as util from 'node:util'
import * as postcss from 'postcss'

export type StylesheetId = string

export interface StylesheetConnection {
  item: Stylesheet
  meta: {
    layers: string[]
  }
}

export class Stylesheet {
  /**
   * A unique identifier for this stylesheet
   *
   * Used to track the stylesheet in PostCSS nodes.
   */
  id: StylesheetId

  /**
   * The PostCSS AST that represents this stylesheet.
   */
  root: postcss.Root

  /**
   * Whether or not this stylesheet is a Tailwind CSS root stylesheet.
   */
  isTailwindRoot = false

  /**
   * The Tailwind config path that is linked to this stylesheet. Essentially the
   * contents of `@config`.
   */
  linkedConfigPath: string | null = null

  /**
   * The path to the file that this stylesheet was loaded from.
   *
   * If this stylesheet was not loaded from a file this will be `null`.
   */
  file: string | null = null

  /**
   * Stylesheets that import this stylesheet.
   */
  parents = new Set<StylesheetConnection>()

  /**
   * Stylesheets that are imported by stylesheet.
   */
  children = new Set<StylesheetConnection>()

  /**
   * Whether or not this stylesheet can be migrated
   */
  canMigrate = true

  /**
   * Whether or not this stylesheet can be migrated
   */
  extension: string | null = null

  static async load(filepath: string) {
    filepath = path.resolve(process.cwd(), filepath)

    let css = await fs.readFile(filepath, 'utf-8')
    let root = postcss.parse(css, { from: filepath })

    return new Stylesheet(root, filepath)
  }

  static loadSync(filepath: string) {
    filepath = path.resolve(process.cwd(), filepath)

    let css = fsSync.readFileSync(filepath, 'utf-8')
    let root = postcss.parse(css, { from: filepath })

    return new Stylesheet(root, filepath)
  }

  static async fromString(css: string) {
    let root = postcss.parse(css)

    return new Stylesheet(root)
  }

  static async fromRoot(root: postcss.Root, file?: string) {
    return new Stylesheet(root, file)
  }

  constructor(root: postcss.Root, file?: string) {
    this.id = Math.random().toString(36).slice(2)
    this.root = root
    this.file = file ?? null

    if (file) {
      this.extension = path.extname(file)
    }
  }

  get importRules() {
    let imports = new Set<postcss.AtRule>()

    this.root.walkAtRules('import', (rule) => {
      imports.add(rule)
    })

    return imports
  }

  get isEmpty() {
    return this.root.toString().trim() === ''
  }

  *ancestors() {
    for (let { item } of walkDepth(this, (sheet) => sheet.parents)) {
      yield item
    }
  }

  *descendants() {
    for (let { item } of walkDepth(this, (sheet) => sheet.children)) {
      yield item
    }
  }

  /**
   * Return the layers the stylesheet is imported into directly or indirectly
   */
  layers() {
    let layers = new Set<string>()

    for (let { item, path } of walkDepth(this, (sheet) => sheet.parents)) {
      if (item.parents.size > 0) {
        continue
      }

      for (let { meta } of path) {
        for (let layer of meta.layers) {
          layers.add(layer)
        }
      }
    }

    return layers
  }

  /**
   * Iterate all paths from a stylesheet through its ancestors to all roots
   *
   * For example, given the following structure:
   *
   * ```
   * c.css
   *  -> a.1.css @import "…"
   *      -> a.css
   *          -> root.1.css (utility: no)
   *          -> root.2.css (utility: no)
   *      -> b.css
   *          -> root.1.css (utility: no)
   *          -> root.2.css (utility: no)
   *
   *  -> a.2.css @import "…" layer(foo)
   *      -> a.css
   *          -> root.1.css (utility: no)
   *          -> root.2.css (utility: no)
   *      -> b.css
   *          -> root.1.css (utility: no)
   *          -> root.2.css (utility: no)
   *
   *  -> b.1.css @import "…" layer(components / utilities)
   *      -> a.css
   *          -> root.1.css (utility: yes)
   *          -> root.2.css (utility: yes)
   *      -> b.css
   *          -> root.1.css (utility: yes)
   *          -> root.2.css (utility: yes)
   * ```
   *
   * We can see there are a total of 12 import paths with various layers.
   * We need to be able to iterate every one of these paths and inspect
   * the layers used in each path..
   */
  *pathsToRoot(): Iterable<StylesheetConnection[]> {
    for (let { item, path } of walkDepth(this, (sheet) => sheet.parents)) {
      // Skip over intermediate stylesheets since all paths from a leaf to a
      // root will encompass all possible intermediate stylesheet paths.
      if (item.parents.size > 0) {
        continue
      }

      yield path
    }
  }

  /**
   * Analyze a stylesheets import paths to see if some can be considered
   * for conversion to utility rules and others can't.
   *
   * If a stylesheet is imported directly or indirectly and some imports are in
   * a utility layer and some are not that means that we can't safely convert
   * the rules in the stylesheet to `@utility`. Doing so would mean that we
   * would need to replicate the stylesheet and change one to have `@utility`
   * rules and leave the other as is.
   *
   * We can see, given the same structure from the `pathsToRoot` example, that
   * `css.css` is imported into different layers:
   * - `a.1.css` has no layers and should not be converted
   * - `a.2.css` has a layer `foo` and should not be converted
   * - `b.1.css` has a layer `utilities` (or `components`) which should be
   *
   * Since this means that `c.css` must both not be converted and converted
   * we can't do this without replicating the stylesheet, any ancestors, and
   * adjusting imports which is a non-trivial task.
   */
  analyzeImportPaths() {
    let convertiblePaths: StylesheetConnection[][] = []
    let nonConvertiblePaths: StylesheetConnection[][] = []

    for (let path of this.pathsToRoot()) {
      let isConvertible = false

      for (let { meta } of path) {
        for (let layer of meta.layers) {
          isConvertible ||= layer === 'utilities' || layer === 'components'
        }
      }

      if (isConvertible) {
        convertiblePaths.push(path)
      } else {
        nonConvertiblePaths.push(path)
      }
    }

    return { convertiblePaths, nonConvertiblePaths }
  }

  containsRule(cb: (rule: postcss.AnyNode) => boolean) {
    let contains = false

    this.root.walk((rule) => {
      if (cb(rule)) {
        contains = true
        return false
      }
    })

    if (contains) {
      return true
    }

    for (let child of this.children) {
      if (child.item.containsRule(cb)) {
        return true
      }
    }

    return false
  }

  [util.inspect.custom]() {
    return {
      ...this,
      root: this.root.toString(),
      layers: Array.from(this.layers()),
      parents: Array.from(this.parents, (s) => s.item.id),
      children: Array.from(this.children, (s) => s.item.id),
      parentsMeta: Array.from(this.parents, (s) => s.meta),
      childrenMeta: Array.from(this.children, (s) => s.meta),
    }
  }
}

function* walkDepth(
  value: Stylesheet,
  connections: (value: Stylesheet) => Iterable<StylesheetConnection>,
  path: StylesheetConnection[] = [],
): Iterable<{ item: Stylesheet; path: StylesheetConnection[] }> {
  for (let connection of connections(value)) {
    let newPath = [...path, connection]

    yield* walkDepth(connection.item, connections, newPath)
    yield {
      item: connection.item,
      path: newPath,
    }
  }
}
