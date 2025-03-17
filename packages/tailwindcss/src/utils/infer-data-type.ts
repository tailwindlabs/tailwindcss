import { isColor } from './is-color'
import { hasMathFn } from './math-operators'
import { segment } from './segment'

type DataType =
  | 'color'
  | 'length'
  | 'percentage'
  | 'ratio'
  | 'number'
  | 'integer'
  | 'url'
  | 'position'
  | 'bg-size'
  | 'line-width'
  | 'image'
  | 'family-name'
  | 'generic-name'
  | 'absolute-size'
  | 'relative-size'
  | 'angle'
  | 'vector'

const checks: Record<DataType, (value: string) => boolean> = {
  color: isColor,
  length: isLength,
  percentage: isPercentage,
  ratio: isFraction,
  number: isNumber,
  integer: isPositiveInteger,
  url: isUrl,
  position: isBackgroundPosition,
  'bg-size': isBackgroundSize,
  'line-width': isLineWidth,
  image: isImage,
  'family-name': isFamilyName,
  'generic-name': isGenericName,
  'absolute-size': isAbsoluteSize,
  'relative-size': isRelativeSize,
  angle: isAngle,
  vector: isVector,
}

/**
 * Determine the type of `value` using syntax rules from CSS specs.
 */
export function inferDataType(value: string, types: DataType[]): DataType | null {
  if (value.startsWith('var(')) return null

  for (let type of types) {
    if (checks[type]?.(value)) {
      return type
    }
  }

  return null
}

/* -------------------------------------------------------------------------- */

const IS_URL = /^url\(.*\)$/

function isUrl(value: string): boolean {
  return IS_URL.test(value)
}

/* -------------------------------------------------------------------------- */

function isLineWidth(value: string): boolean {
  return segment(value, ' ').every(
    (value) =>
      isLength(value) ||
      isNumber(value) ||
      value === 'thin' ||
      value === 'medium' ||
      value === 'thick',
  )
}

/* -------------------------------------------------------------------------- */

const IS_IMAGE_FN = /^(?:element|image|cross-fade|image-set)\(/
const IS_GRADIENT_FN = /^(repeating-)?(conic|linear|radial)-gradient\(/

function isImage(value: string) {
  let count = 0

  for (let part of segment(value, ',')) {
    if (part.startsWith('var(')) continue

    if (isUrl(part)) {
      count += 1
      continue
    }

    if (IS_GRADIENT_FN.test(part)) {
      count += 1
      continue
    }

    if (IS_IMAGE_FN.test(part)) {
      count += 1
      continue
    }

    return false
  }

  return count > 0
}

/* -------------------------------------------------------------------------- */

function isGenericName(value: string): boolean {
  return (
    value === 'serif' ||
    value === 'sans-serif' ||
    value === 'monospace' ||
    value === 'cursive' ||
    value === 'fantasy' ||
    value === 'system-ui' ||
    value === 'ui-serif' ||
    value === 'ui-sans-serif' ||
    value === 'ui-monospace' ||
    value === 'ui-rounded' ||
    value === 'math' ||
    value === 'emoji' ||
    value === 'fangsong'
  )
}

function isFamilyName(value: string): boolean {
  let count = 0

  for (let part of segment(value, ',')) {
    // If it starts with a digit, then it's not a family name
    let char = part.charCodeAt(0)
    if (char >= 48 && char <= 57) return false

    if (part.startsWith('var(')) continue

    count += 1
  }

  return count > 0
}

function isAbsoluteSize(value: string): boolean {
  return (
    value === 'xx-small' ||
    value === 'x-small' ||
    value === 'small' ||
    value === 'medium' ||
    value === 'large' ||
    value === 'x-large' ||
    value === 'xx-large' ||
    value === 'xxx-large'
  )
}

function isRelativeSize(value: string): boolean {
  return value === 'larger' || value === 'smaller'
}

/* -------------------------------------------------------------------------- */

const HAS_NUMBER = /[+-]?\d*\.?\d+(?:[eE][+-]?\d+)?/

/* -------------------------------------------------------------------------- */

const IS_NUMBER = new RegExp(`^${HAS_NUMBER.source}$`)

function isNumber(value: string): boolean {
  return IS_NUMBER.test(value) || hasMathFn(value)
}

/* -------------------------------------------------------------------------- */

const IS_PERCENTAGE = new RegExp(`^${HAS_NUMBER.source}%$`)

function isPercentage(value: string): boolean {
  return IS_PERCENTAGE.test(value) || hasMathFn(value)
}

/* -------------------------------------------------------------------------- */

const IS_FRACTION = new RegExp(`^${HAS_NUMBER.source}\s*/\s*${HAS_NUMBER.source}$`)

function isFraction(value: string): boolean {
  return IS_FRACTION.test(value) || hasMathFn(value)
}

/* -------------------------------------------------------------------------- */

/**
 * Please refer to MDN when updating this list:
 * @see https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries#container_query_length_units
 */
const LENGTH_UNITS = [
  'cm',
  'mm',
  'Q',
  'in',
  'pc',
  'pt',
  'px',
  'em',
  'ex',
  'ch',
  'rem',
  'lh',
  'rlh',
  'vw',
  'vh',
  'vmin',
  'vmax',
  'vb',
  'vi',
  'svw',
  'svh',
  'lvw',
  'lvh',
  'dvw',
  'dvh',
  'cqw',
  'cqh',
  'cqi',
  'cqb',
  'cqmin',
  'cqmax',
]

const IS_LENGTH = new RegExp(`^${HAS_NUMBER.source}(${LENGTH_UNITS.join('|')})$`)

function isLength(value: string): boolean {
  return IS_LENGTH.test(value) || hasMathFn(value)
}

/* -------------------------------------------------------------------------- */

function isBackgroundPosition(value: string): boolean {
  let count = 0

  for (let part of segment(value, ' ')) {
    if (
      part === 'center' ||
      part === 'top' ||
      part === 'right' ||
      part === 'bottom' ||
      part === 'left'
    ) {
      count += 1
      continue
    }

    if (part.startsWith('var(')) continue

    if (isLength(part) || isPercentage(part)) {
      count += 1
      continue
    }

    return false
  }

  return count > 0
}

/* -------------------------------------------------------------------------- */

/**
 * Determine if `value` is valid for `background-size`
 *
 * background-size =
 *  <bg-size>#
 *
 * <bg-size> =
 *   [ <length-percentage [0,∞]> | auto ]{1,2}  |
 *   cover                                       |
 *   contain
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/background-size#formal_syntax
 */
function isBackgroundSize(value: string) {
  let count = 0

  for (let size of segment(value, ',')) {
    if (size === 'cover' || size === 'contain') {
      count += 1
      continue
    }

    let values = segment(size, ' ')

    // Sizes must have exactly one or two values
    if (values.length !== 1 && values.length !== 2) {
      return false
    }

    if (values.every((value) => value === 'auto' || isLength(value) || isPercentage(value))) {
      count += 1
      continue
    }
  }

  return count > 0
}

/* -------------------------------------------------------------------------- */

const ANGLE_UNITS = ['deg', 'rad', 'grad', 'turn']

const IS_ANGLE = new RegExp(`^${HAS_NUMBER.source}(${ANGLE_UNITS.join('|')})$`)

/**
 * Determine if `value` is valid angle
 *
 * <angle> = <number><units>
 * <units> = deg | rad | grad | turn
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/angle
 */
function isAngle(value: string) {
  return IS_ANGLE.test(value)
}

/* -------------------------------------------------------------------------- */

const IS_VECTOR = new RegExp(`^${HAS_NUMBER.source} +${HAS_NUMBER.source} +${HAS_NUMBER.source}$`)

/**
 * Determine if `value` is valid for the vector component of `rotate`
 *
 * <vector> = <number> <number> <number>
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/rotate#vector_plus_angle_value
 */
function isVector(value: string) {
  return IS_VECTOR.test(value)
}

/**
 * Returns true if the value can be parsed as a positive whole number.
 */
export function isPositiveInteger(value: any) {
  let num = Number(value)
  return Number.isInteger(num) && num >= 0 && String(num) === String(value)
}

export function isStrictPositiveInteger(value: any) {
  let num = Number(value)
  return Number.isInteger(num) && num > 0 && String(num) === String(value)
}

export function isValidSpacingMultiplier(value: any) {
  return isMultipleOf(value, 0.25)
}

export function isValidOpacityValue(value: any) {
  return isMultipleOf(value, 0.25)
}

/**
 * Ensures a number (or numeric string) is a multiple of another number, and
 * that it has no unnecessary leading or trailing zeros.
 */
function isMultipleOf(value: string | number, divisor: number) {
  let num = Number(value)
  return num >= 0 && num % divisor === 0 && String(num) === String(value)
}
