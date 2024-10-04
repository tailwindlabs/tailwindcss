import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as postcss from 'postcss'

export class Stylesheet {
  /**
   * A unique identifier for this stylesheet
   *
   * Used to track the stylesheet in PostCSS nodes.
   */
  id: string

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
  parents = new Set<Stylesheet>()

  /**
   * Stylesheets that are imported by stylesheet.
   */
  children = new Set<Stylesheet>()

  /**
   * The layers this stylesheet is in, even transitive layers from parents.
   */
  layers = new Set<string>()

  importsFromParents = new Set<postcss.AtRule>()
  importsInSelf = new Set<postcss.AtRule>()
  hasUtilities = false

  constructor(root: postcss.Root, file?: string) {
    this.id = crypto.randomUUID()
    this.root = root
    this.file = file ?? null
  }

  get ancestors() {
    return walk<Stylesheet>(this, (sheet) => sheet.parents ?? [])
  }

  get descendants() {
    return walk<Stylesheet>(this, (sheet) => sheet.children ?? [])
  }

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
}

function* walk<T>(value: T, getList: (value: T) => Iterable<T>, seen = new Set<T>()): Iterable<T> {
  for (let item of getList(value)) {
    if (seen.has(item)) continue
    seen.add(item)

    yield item
    yield* walk(item, getList, seen)
  }
}
