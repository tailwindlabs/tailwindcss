import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as util from 'node:util'
import * as postcss from 'postcss'

export type StylesheetId = string

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
  parents = new Set<Stylesheet>()

  /**
   * Stylesheets that are imported by stylesheet.
   */
  children = new Set<Stylesheet>()

  /**
   * The layers this stylesheet is in, even transitive layers from parents.
   */
  layers = new Set<string>()

  /**
   * The list of config files that this stylesheet uses
   */
  configFiles = new Set<string>()

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

  get importRules() {
    let imports = new Set<postcss.AtRule>()

    this.root.walkAtRules('import', (rule) => {
      imports.add(rule)
    })

    return imports
  }

  get configRules() {
    let rules = new Set<postcss.AtRule>()

    this.root.walkAtRules('config', (rule) => {
      rules.add(rule)
    })

    return rules
  }

  get isEmpty() {
    return this.root.toString().trim() === ''
  }

  get ancestors() {
    return walk<Stylesheet>(this, (sheet) => sheet.parents ?? [])
  }

  get descendants() {
    return walk<Stylesheet>(this, (sheet) => sheet.children ?? [])
  }

  [util.inspect.custom]() {
    return {
      ...this,
      root: this.root.toString(),
      layers: Array.from(this.layers),
      parents: Array.from(this.parents, (s) => s.id),
      children: Array.from(this.children, (s) => s.id),
    }
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
