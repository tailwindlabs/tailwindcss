const UPPER_A = 65
const UPPER_Z = 90
const LOWER_A = 97
const LOWER_Z = 122

export function isAlpha(input: string): boolean {
  for (let i = 0; i < input.length; i++) {
    let code = input.charCodeAt(i)
    if (code < UPPER_A || (code > UPPER_Z && code < LOWER_A) || code > LOWER_Z) {
      return false
    }
  }
  return true
}
