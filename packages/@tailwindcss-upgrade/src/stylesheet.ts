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

  static async load(filepath: string) {
    filepath = path.resolve(process.cwd(), filepath)

    let css = await fs.readFile(filepath, 'utf-8')
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
