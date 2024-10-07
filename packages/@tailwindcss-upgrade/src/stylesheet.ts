import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as util from 'node:util'
import * as postcss from 'postcss'

export type StylesheetId = string

export class Stylesheet {
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
    this.root = root
    this.file = file ?? null
  }

  [util.inspect.custom]() {
    return {
      ...this,
      root: this.root.toString(),
    }
  }
}
