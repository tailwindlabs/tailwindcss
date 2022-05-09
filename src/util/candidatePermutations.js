// @ts-check

/** @typedef {import('../lib/candidate.d').Plugin} Plugin */

/**
 * Generate plugin permutations for a class candidate, like:
 *
 * ['ring-offset-blue', '100']
 * ['ring-offset', 'blue-100']
 * ['ring', 'offset-blue-100']
 * Example with dynamic classes:
 * ['grid-cols', '[[linename],1fr,auto]']
 * ['grid', 'cols-[[linename],1fr,auto]']
 *
 * @param {string} candidate
 * @param {boolean} negative
 * @return {Iterable<Plugin>}
 */
export function* candidatePermutations(candidate, negative = false) {
  let lastIndex = Infinity

  yield { plugin: candidate, value: negative ? '-DEFAULT' : 'DEFAULT', modifiers: [] }

  let SPECIALS = /[\[\]]/g
  let indexes = Array.from(candidate.matchAll(SPECIALS)).map((r) => r.index)
  let firstOpening = indexes[0] ?? -1
  let lastOpening = indexes[1] ?? -1

  while (lastIndex >= 0) {
    let dashIdx

    if (lastIndex === Infinity && candidate.endsWith(']')) {
      let bracketIdx = candidate.indexOf('[')

      // If character before `[` isn't a dash or a slash, this isn't a dynamic class
      // eg. string[]
      dashIdx = ['-', '/'].includes(candidate[bracketIdx - 1]) ? bracketIdx - 1 : -1
    } else {
      dashIdx = candidate.lastIndexOf('-', lastIndex)
    }

    if (dashIdx < 0) {
      break
    }

    if (firstOpening < dashIdx && dashIdx < lastOpening) {
      lastIndex = dashIdx - 1
      continue
    }

    let plugin = candidate.slice(0, dashIdx)
    let value = candidate.slice(dashIdx + 1)

    yield { plugin, value: negative ? `-${value}` : value, modifiers: [] }

    lastIndex = dashIdx - 1
  }
}
