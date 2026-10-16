// rounds to 15 significant digits to drop floating-point noise, e.g.:
// 0.1 + 0.2 is 0.30000000000000004 in JS, but should be 0.3
// significant digits (not decimal places) are used so tiny values such as
// 1e-12 are preserved instead of collapsing to 0
export function roundFloatNoise(value: number) {
  if (Number.isInteger(value)) return value
  return Number(value.toPrecision(15))
}
