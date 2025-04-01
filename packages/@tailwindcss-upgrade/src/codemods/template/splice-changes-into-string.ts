export interface StringChange {
  start: number
  end: number
  replacement: string
}

/**
 * Apply the changes to the string such that a change in the length
 * of the string does not break the indexes of the subsequent changes.
 */
export function spliceChangesIntoString(str: string, changes: StringChange[]) {
  // If there are no changes, return the original string
  if (!changes[0]) return str

  // Sort all changes in order to make it easier to apply them
  changes.sort((a, b) => {
    return a.end - b.end || a.start - b.start
  })

  // Append original string between each chunk, and then the chunk itself
  // This is sort of a String Builder pattern, thus creating less memory pressure
  let result = ''

  let previous = changes[0]

  result += str.slice(0, previous.start)
  result += previous.replacement

  for (let i = 1; i < changes.length; ++i) {
    let change = changes[i]

    result += str.slice(previous.end, change.start)
    result += change.replacement

    previous = change
  }

  // Add leftover string from last chunk to end
  result += str.slice(previous.end)

  return result
}
