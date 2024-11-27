import type { SnapshotSerializer } from 'vitest'

const HIGH_PRECISION_OKLAB = /oklab\(\d{1,2}\.\d{1,4}% (-?\.\d{6,7}) (-?\.\d{6,7}) \/ \.\d{1,2}\)/g

export default {
  test(val) {
    return typeof val === 'string' && val.match(HIGH_PRECISION_OKLAB) !== null
  },
  serialize(val, config, indentation, depth, refs, printer) {
    if (typeof val !== 'string') {
      throw new Error('This was already tested in the test() callback')
    }

    let replaced = val.replaceAll(HIGH_PRECISION_OKLAB, (match, first, second) => {
      return match.replaceAll(first, first.slice(0, -1)).replaceAll(second, second.slice(0, -1))
    })
    return printer(replaced, config, indentation, depth, refs)
  },
} satisfies SnapshotSerializer
