import { compileCandidates } from './compile'
import type { DesignSystem } from './design-system'

export function getClassOrder(design: DesignSystem, classes: string[]): [string, bigint | null][] {
  // Generate a sorted AST
  let { astNodes, nodeSorting } = compileCandidates(Array.from(classes), design)

  // Map class names to their order in the AST
  // `null` indicates a non-Tailwind class
  let sorted = new Map<string, bigint | null>(classes.map((className) => [className, null]))

  // Assign each class a unique, sorted number
  let idx = 0n

  for (let node of astNodes) {
    let candidate = nodeSorting.get(node)?.candidate
    if (!candidate) continue

    // When multiple rules match a candidate
    // always take the position of the first one
    sorted.set(candidate, sorted.get(candidate) ?? idx++)
  }

  // Pair classes with their assigned sorting number
  return classes.map((className) => [
    //
    className,
    sorted.get(className) ?? null,
  ])
}
