//exact decimal arithmetic for css
// js numbers are binary floats, so most decimals cant be represented
// exactly and every operation can add rounding errors, like 0.1 + 0.2 is
// 0.30000000000000004, instead, numbers are parsed from the string as written
// into an integer and a scale, like 4.35 → { int: 435, scale: 2 }, and all
// arithmetic happens on the integers, which is exact
// all public functions take and return strings, when a value cant be handled
// exactly they return null, which means that the
// caller should not fold the expression
type Decimal = {
  int: number
  scale: number
}

const DECIMAL_REGEX = /^[-+]?(?:\d*\.)?\d+$/

//conversions that can't be exact, like 1cm = 37.795275590551181…px, are
// rounded to 12 significant digits, so that equivalent values 1cm, 10mm, 40q
// end up identical. significant digits (not decimal places) keep the relative
// error the same at any magnitude, so a tiny value multiplied later in a
// calc() stays correct, like calc(0.00000000001pt * 1000000000000)
const CONVERSION_PRECISION = 12

function parse(input: string): Decimal | null {
  if (!DECIMAL_REGEX.test(input)) return null

  let negative = input[0] === '-'
  let unsigned = input[0] === '-' || input[0] === '+' ? input.slice(1) : input

  let dot = unsigned.indexOf('.')
  let digits = dot === -1 ? unsigned : unsigned.slice(0, dot) + unsigned.slice(dot + 1)
  let scale = dot === -1 ? 0 : unsigned.length - dot - 1

  let int = safe(Number(digits))
  if (int === null) return null

  return trimTrailingZeros(negative ? -int : int, scale)
}

function format(value: Decimal): string {
  let { int, scale } = trimTrailingZeros(value.int, value.scale)

  if (int === 0) return '0' // this also cover -0

  let digits = String(Math.abs(int)).padStart(scale + 1, '0')
  let result = scale === 0 ? digits : `${digits.slice(0, -scale)}.${digits.slice(-scale)}`

  return int < 0 ? `-${result}` : result
}

export function add(a: string, b: string): string | null {
  return binary(a, b, (lhs, rhs) => combine(lhs, rhs, 1))
}

export function sub(a: string, b: string): string | null {
  return binary(a, b, (lhs, rhs) => combine(lhs, rhs, -1))
}

export function mul(a: string, b: string): string | null {
  return binary(a, b, (lhs, rhs) => {
    let int = safe(lhs.int * rhs.int)
    if (int === null) return null

    return {
      int,
      scale: lhs.scale + rhs.scale,
    }
  })
}

export function div(a: string, b: string, maxDecimals: number): string | null {
  return binary(a, b, (lhs, rhs) => {
    //dont divide by zero
    if (rhs.int === 0) return null

    // (lhs.int / 10^lhs.scale) / (rhs.int / 10^rhs.scale) = (lhs.int · 10^rhs.scale) / (rhs.int · 10^lhs.scale)
    let numerator = scaleBy(lhs.int, rhs.scale)
    let denominator = scaleBy(rhs.int, lhs.scale)

    if (numerator === null || denominator === null) return null

    //find the smallest amount of decimals where the division is exact
    for (let i = 0; i <= maxDecimals; i++) {
      // i is the decimals
      let scaled = scaleBy(numerator, i)

      if (scaled === null) return null

      if (scaled % denominator === 0) {
        return {
          int: scaled / denominator,
          scale: i,
        }
      }
    }

    // deosnt terminat whitin maxDecimals
    return null
  })
}

//round a float number to 12 significant digits, only for unit conversion
//that can't be exact, like 1cm -> 37.7952755906px. values that cant be
//written that way without exponent notation, too small or too large, return null
export function round(value: number): string | null {
  if (!Number.isFinite(value)) return null

  return normalize(value.toPrecision(CONVERSION_PRECISION))
}

//normalize a number as written, like
// -0 -> 0, 1.50 -> 1.5, +.5 -> 0.5
export function normalize(value: string): string | null {
  let decimal = parse(value)
  return decimal === null ? null : format(decimal)
}

//value * numerator / denominator, rounded to 12 significant digits
//the multiplication is exact and the division is a single (correctly rounded)
//float operation, like 1cm -> 1 * 4800 / 127 -> 37.7952755906px
export function mulDiv(value: string, numerator: string, denominator: number): string | null {
  let product = mul(value, numerator)
  if (product === null) return null

  return round(Number(product) / denominator)
}

//parse both operands, run the operation on the decimals and format the result
//any step that can't be done exactly returns null
function binary(
  a: string,
  b: string,
  operation: (lhs: Decimal, rhs: Decimal) => Decimal | null,
): string | null {
  let lhs = parse(a)
  let rhs = parse(b)

  if (lhs === null || rhs === null) return null

  let result = operation(lhs, rhs)
  return result === null ? null : format(result)
}

function combine(lhs: Decimal, rhs: Decimal, sign: 1 | -1): Decimal | null {
  //align both values to same scale, like
  // 0.1 + 0.25 -> 10 + 25 at scale 2
  let scale = Math.max(lhs.scale, rhs.scale)
  let x = scaleBy(lhs.int, scale - lhs.scale)
  let y = scaleBy(rhs.int, scale - rhs.scale)

  if (x === null || y === null) return null

  let int = safe(x + sign * y)
  if (int === null) return null

  return { int, scale }
}

function scaleBy(int: number, decimals: number): number | null {
  return safe(int * 10 ** decimals)
}

//the integer when it is exact, null otherwise
function safe(int: number): number | null {
  return Number.isSafeInteger(int) ? int : null
}

//remove trailing zeros
// {int: 1500, scale: 3} -> {int: 15, scale: 1}
function trimTrailingZeros(int: number, scale: number): Decimal {
  while (scale > 0 && int % 10 === 0) {
    int /= 10
    scale--
  }

  return { int, scale }
}
