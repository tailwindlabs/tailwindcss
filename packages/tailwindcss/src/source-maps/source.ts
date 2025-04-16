/**
 * The source code for one or more nodes in the AST
 *
 * This generally corresponds to a stylesheet
 */
export interface Source {
  /**
   * The path to the file that contains the referenced source code
   *
   * If this references the *output* source code, this is `null`.
   */
  file: string | null

  /**
   * The referenced source code
   */
  code: string
}

/**
 * The file and offsets within it that this node covers
 *
 * This can represent either:
 * - A location in the original CSS which caused this node to be created
 * - A location in the output CSS where this node resides
 */
export type SourceLocation = [source: Source, start: number, end: number]
