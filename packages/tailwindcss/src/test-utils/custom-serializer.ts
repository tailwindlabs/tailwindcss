import type { SnapshotSerializer } from 'vitest'

// We're reducing the precision of parameters to the `oklab()` function from
// our snapshots as we've observed lightningcss generating different decimal
// places in the last position when run on different operating systems.
const HIGH_PRECISION_OKLAB = /oklab\(\d{1,2}\.?\d{0,4}% -?\.(\d{6,8}) -?\.(\d{6,8}) \/ \.\d{1,2}\)/g

export default {
  test(val) {
    return typeof val === 'string' && val.match(HIGH_PRECISION_OKLAB) !== null
  },
  serialize(val, config, indentation, depth, refs, printer) {
    if (typeof val !== 'string') {
      throw new Error('This was already tested in the test() callback')
    }

    let replaced = val.replaceAll(HIGH_PRECISION_OKLAB, (match, first, second) => {
      return match.replaceAll(first, first.slice(0, 5)).replaceAll(second, second.slice(0, 5))
    })
    return printer(replaced, config, indentation, depth, refs)
  },
} satisfies SnapshotSerializer
