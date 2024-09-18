export function formatNanoseconds(input: bigint | number) {
  let ns = typeof input === 'number' ? BigInt(input) : input

  if (ns < 1_000n) return `${ns}ns`
  ns /= 1_000n

  if (ns < 1_000n) return `${ns}µs`
  ns /= 1_000n

  if (ns < 1_000n) return `${ns}ms`
  ns /= 1_000n

  if (ns < 60n) return `${ns}s`
  ns /= 60n

  if (ns < 60n) return `${ns}m`
  ns /= 60n

  if (ns < 24n) return `${ns}h`
  ns /= 24n

  return `${ns}d`
}
