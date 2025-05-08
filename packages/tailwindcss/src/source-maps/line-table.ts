/**
 * Line offset tables are the key to generating our source maps. They allow us
 * to store indexes with our AST nodes and later convert them into positions as
 * when given the source that the indexes refer to.
 */

const LINE_BREAK = 0x0a

/**
 * A position in source code
 *
 * https://tc39.es/ecma426/#sec-position-record-type
 */
export interface Position {
  /** The line number, one-based */
  line: number

  /** The column/character number, one-based */
  column: number
}

/**
 * A table that lets you turn an offset into a line number and column
 */
export interface LineTable {
  /**
   * Find the line/column position in the source code for a given offset
   *
   * Searching for a given offset takes O(log N) time where N is the number of
   * lines of code.
   *
   * @param offset The index for which to find the position
   */
  find(offset: number): Position

  /**
   * Find the most likely byte offset for given a position
   *
   * @param offset The position for which to find the byte offset
   */
  findOffset(pos: Position): number
}

/**
 * Compute a lookup table to allow for efficient line/column lookups based on
 * offsets in the source code.
 *
 * Creating this table is an O(N) operation where N is the length of the source
 */
export function createLineTable(source: string): LineTable {
  let table: number[] = [0]

  // Compute the offsets for the start of each line
  for (let i = 0; i < source.length; i++) {
    if (source.charCodeAt(i) === LINE_BREAK) {
      table.push(i + 1)
    }
  }

  function find(offset: number) {
    // Based on esbuild's binary search for line numbers
    let line = 0
    let count = table.length
    while (count > 0) {
      // `| 0` improves performance (in V8 at least)
      let mid = (count | 0) >> 1
      let i = line + mid
      if (table[i] <= offset) {
        line = i + 1
        count = count - mid - 1
      } else {
        count = mid
      }
    }

    line -= 1

    let column = offset - table[line]

    return {
      line: line + 1,
      column: column,
    }
  }

  function findOffset({ line, column }: Position) {
    line -= 1
    line = Math.min(Math.max(line, 0), table.length - 1)

    let offsetA = table[line]
    let offsetB = table[line + 1] ?? offsetA

    return Math.min(Math.max(offsetA + column, 0), offsetB)
  }

  return {
    find,
    findOffset,
  }
}
