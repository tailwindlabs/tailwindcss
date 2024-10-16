import { and, none, not, or, visit, type Expr } from './expr'

export function toDNF(e: Expr): Expr {
  // Convert the expression to Negation Normal Form (NNF)
  e = visit(e, {
    Enter(e) {
      if (e.kind === 'not') {
        let child = e.nodes[0]
        if (child.kind === 'or') {
          return and(child.nodes.map(not))
        } else if (child.kind === 'and') {
          return or(child.nodes.map(not))
        }
      }

      return e
    },

    Exit(e) {
      if (e.kind === 'not') {
        let child = e.nodes[0]
        if (child.kind === 'not') return child.nodes[0]
      } else if (e.kind === 'and' || e.kind === 'or') {
        e.nodes = e.nodes.flatMap((child) => (child.kind === e.kind ? child.nodes : child))
        if (e.nodes.length === 1) return e.nodes[0]
      }

      return e
    },
  })

  // Convert the eession to Disjunctive Normal Form (DNF)
  e = visit(e, { Exit: dnf })
  e = visit(e, { Exit: flatten })
  e = visit(e, { Exit: dedupe })
  e = normalizeDNF(e)
  e = visit(e, { Exit: eliminateSupersets })

  return e
}

/**
 * Flatten the expression tree by removing redundant NOT and AND/OR nodes
 */
export function flatten(e: Expr) {
  if (e.kind === 'not') {
    let child = e.nodes[0]

    if (child.kind === 'not') {
      return child.nodes[0]
    }
  } else if (e.kind === 'and' || e.kind === 'or') {
    e.nodes = e.nodes.flatMap((child) => {
      if (child.kind === e.kind) {
        return child.nodes
      }

      return child
    })

    if (e.nodes.length === 1) {
      return e.nodes[0]
    }
  }

  return e
}

function normalizeDNF(e: Expr): Expr {
  if (e.kind === 'lit' || e.kind === 'not') {
    return or([and([e])])
  } else if (e.kind === 'and') {
    return or([e])
  } else if (e.kind === 'or') {
    for (let i = 0; i < e.nodes.length; i++) {
      let child = e.nodes[i]

      if (child.kind === 'lit' || child.kind === 'not') {
        e.nodes[i] = and([child])
      }
    }
  }

  return e
}

// DNF Convert an expression to disjunctive normal form
function dnf(e: Expr): Expr {
  // Since we always first convert to NNF
  // These forms are trivial terms
  if (e.kind === 'lit' || e.kind === 'not') return e

  // By this point children have already been converted to DNF
  if (e.kind === 'or') return e

  // Create a matrix of clauses
  // We have to take the following:
  // (A₀ || A₁ || … || Aₙ) && (B₀ || B₁ || … || Bₙ) && … && (N₀ || N₁ || … || Nₙ)

  // And convert it to a 3D matrix
  // (A₀ && B₀ && … && Nₙ) || (A₁ && B₀ && … && Nₙ) || … || (Aₙ && B₀ && … && Nₙ) ||
  // (A₀ && B₁ && … && Nₙ) || (A₁ && B₁ && … && Nₙ) || … || (Aₙ && B₁ && … && Nₙ) ||
  // …
  // (A₀ && Bₙ && … && Nₙ) || (A₁ && Bₙ && … && Nₙ) || … || (Aₙ && Bₙ && … && Nₙ)

  // a: Generate a 2D list of clauses
  let lists = clausesIn(e)

  // b: Generate a 2D list of combinations
  let combos = combinations(lists)

  // c: Re-construct the matrix into expression nodes
  let clauses: Expr[] = []

  for (let i = 0; i < combos.length; i++) {
    clauses[i] = and(combos[i])
  }

  // d: Switch this node to OR with the appropriate clauses
  // Node switching is appropriate because this is logically-equivalent for the whole AST
  e.kind = 'or'
  e.nodes = clauses

  return e
}

/**
 * Generate a 2D list of clauses considering only AND and ORs
 */
function clausesIn(e: Expr): Expr[][] {
  return e.nodes.map((child) => {
    if (child.kind === 'lit' || child.kind === 'not') {
      return [child]
    } else if (child.kind === 'and' || child.kind === 'or') {
      return child.nodes
    } else if (child.kind === 'none') {
      return []
    }

    return []
  })
}

function combinations(lists: Expr[][]): Expr[][] {
  if (lists.length == 0) return []

  let pos: number[] = []
  let indexes: number[] = []
  let iters = 1n

  for (let idx = 0; idx < lists.length; idx++) {
    let len = lists[idx].length
    pos[idx] = 0
    indexes[idx] = len - 1

    iters *= BigInt(len)
  }

  // Check if the number of combinations can be represented as a 64-bit int
  let u64Max = 2n ** 64n - 1n

  if (iters > u64Max) {
    let diff = iters - u64Max

    throw new Error(
      `Number of combinations cannot be represented as a 64-bit int. Overflowed by ${diff} (total: ${iters})`,
    )
  }

  let iterations = Number(iters)

  // One of the lists is empty…
  if (iterations == 0) {
    return []
  }

  let lastListIndex = lists.length - 1
  let lastListLastIndex = indexes[lastListIndex]

  let blocks: Expr[][] = []

  for (let i = 0; i < iterations; ++i) {
    let block: Expr[] = []

    // Get the cusrrent combination
    for (let j = 0; j < lists.length; j++) {
      block.push(lists[j][pos[j]])
    }

    blocks.push(block)

    // Move to the next combination
    // when no wrapping is needed
    if (pos[lastListIndex] != lastListLastIndex) {
      pos[lastListIndex]++
      continue
    }

    // Move to the next combination by
    // wrapping around from len() to 0
    for (let j = lastListIndex; j >= 0; j--) {
      // 1. Increment the position of the furthest list that has not hit the end
      if (pos[j] != indexes[j]) {
        pos[j]++
        break
      }

      // 2. Reset positions for lists that have hit the end
      pos[j] = 0
    }
  }

  return blocks
}

function dedupe(e: Expr): Expr {
  for (let i = 0; i < e.nodes.length; i++) {
    for (let j = i + 1; j < e.nodes.length; j++) {
      if (areNodesEqual(e.nodes[i], e.nodes[j])) {
        e.nodes[j] = none()
      }
    }
  }

  return clean(e)
}

function countIntersections(a: Expr, z: Expr): number {
  let n = 0

  for (let i = 0; i < a.nodes.length; i++) {
    for (let j = 0; j < z.nodes.length; j++) {
      if (areNodesEqual(a.nodes[i], z.nodes[j])) {
        n++
      }
    }
  }

  return n
}

// Determine if two nodes are semantically- and structurally-equivalent even if they don't share pointers
function areNodesEqual(a: Expr, z: Expr): boolean {
  if (a === z) {
    return true
  }

  if (a.kind !== z.kind) {
    return false
  }

  if (a.nodes.length !== z.nodes.length) {
    return false
  }

  if (a.value !== z.value) {
    return false
  }

  for (let index = 0; index < a.nodes.length; index++) {
    if (!areNodesEqual(a.nodes[index], z.nodes[index])) {
      return false
    }
  }

  return true
}

/**
 * Cleanup an expression to ensure that:
 * - All `none` placeholder nodes are removed
 * - All empty ANDs, ORs, and NOTs are removed
 */
function clean(e: Expr): Expr {
  if (e.kind === 'not') {
    // The node that is negated has disappeared this is no longer valid
    if (e.nodes.length === 0) return none()
    if (e.nodes[0].kind === 'none') return e.nodes[0]
  } else if (e.kind === 'and' || e.kind === 'or') {
    e.nodes = e.nodes.flatMap((node) => (node.kind === 'none' ? [] : node))

    // If therea re no nodes left the AND / OR goes away too
    if (e.nodes.length == 0) return none()
  }

  return e
}

/**
 * Eliminates supersets from the expression tree
 *
 * Given the expressions:
 * - `(A || B) && (A || B || C) && (A || C)`
 * - `(A && B) || (A && B && C) || (A && C)`
 *
 * We want to produce:
 * - `(A || B) && (A || C)`
 * - `(A && B) || (A && C)`
 *
 * The reason for this is that AND short-circuits logic on false values, and
 * OR short-circuits logic on true values.
 *
 * In the first case, if `A || B` is true then `A || B || C` MUST be true.
 * Likewise, if `A || B` is false then `A || B || C` won't be checked.
 *
 * In the second case, if `A && B` is false then `A && B && C` MUST be false.
 * Likewise, if `A && B` is true then `A && B && C` won't be checked.
 *
 * More specifically: the simplified expressions have identical truth tables.
 *
 * The algorithm works by walking the list of ANDs/ORs and removing any that are
 * supersets of the examined expression.
 *
 * We walk two pointers along the set of expressions and compare them. The
 * algorithmic complexity of this technically `O(n^2)` but the actual search
 * space is a bit smaller: O((n^2 - n)/2) because the search space contracts as
 * the list of expressions is walked.
 *
 * So for 8 disjunctions the search space is 28 checks versus 64
 * So for 80 disjunctions the search space is 3160 checks versus 6400
 *
 * Example 1:
 * Step 1:
 *        ↓1          ↓2
 * Check: (A || B) && (A || B || C) && (A || C)
 * Result: ↓2 is a superset of ↓1. So remove ↓2.
 *
 *        ↓1          ↓2
 * Check: (A || B) && (A || C)
 * Result: ↓2 is not superset of ↓1. So do nothing
 *
 *        ↓1                   ↓2
 * Check: (A || B) && (A || C)
 * Result: ↓2 is at the end. Advance ↓1 and reset ↓2 to one past ↓1.
 *
 *                    ↓1       ↓2
 * Check: (A || B) && (A || C)
 * Result: ↓2 is at the end. Advance ↓1 and reset ↓2 to one past ↓1.
 *
 *                             ↓1↓2
 * Check: (A || B) && (A || C)
 * Result: ↓1 is at the end. We're done.
 *
 * Example 2:
 * Step 1:
 *        ↓1               ↓2
 * Check: (A || B || C) && (A || B) && (A || C)
 * Result: ↓1 is a superset of ↓2. So remove ↓1.
 *
 *        ↓1          ↓2
 * Check: (A || B) && (A || C)
 * Result: ↓2 is not superset of ↓1. So do nothing
 *
 *        ↓1                   ↓2
 * Check: (A || B) && (A || C)
 * Result: ↓2 is at the end. Advance ↓1 and reset ↓2 to one past ↓1.
 *
 *                    ↓1       ↓2
 * Check: (A || B) && (A || C)
 * Result: ↓2 is at the end. Advance ↓1 and reset ↓2 to one past ↓1.
 *
 *                             ↓1↓2
 * Check: (A || B) && (A || C)
 * Result: ↓1 is at the end. We're done.
 */
function eliminateSupersets(e: Expr): Expr {
  if (e.kind === 'and') {
    return eliminateSupersetsImpl(e, 'and', 'or')
  } else if (e.kind === 'or') {
    return eliminateSupersetsImpl(e, 'or', 'and')
  }

  return e
}

function eliminateSupersetsImpl(e: Expr, outerType: Expr['kind'], innerType: Expr['kind']): Expr {
  let endIndex = e.nodes.length - 1

  for (let i = 0; i < endIndex; i++) {
    let one = e.nodes[i]

    if (!one) continue

    // Skip if we're not looking at the right type of expression
    if (one.kind != innerType) continue

    let oneSize = one.nodes.length

    // The second pointer is reset and traverses a shrinking subset of the
    // elements from the next position `i+1` to `endIndex`
    for (let j = i + 1; j <= endIndex; j++) {
      let two = e.nodes[j]

      if (!two) continue

      // Skip if we're not looking at the right type of expression
      if (two.kind != innerType) continue

      let twoSize = two.nodes.length

      // Count the intersections between $one and $two
      let intersections = countIntersections(one, two)

      if (intersections == oneSize) {
        // two is superset of one, so remove two
        e.nodes[j] = none()
      } else if (intersections == twoSize) {
        // one is superset of two, so remove one
        e.nodes[i] = none()

        // go to the next `one` group since we removed the current one group
        break
      }
    }
  }

  return clean(e)
}
