const minus = '-'.charCodeAt(0)
const plus = '+'.charCodeAt(0)
const dot = '.'.charCodeAt(0)
const exp = 'e'.charCodeAt(0)
const EXP = 'E'.charCodeAt(0)

// Check if three code points would start a number
// https://www.w3.org/TR/css-syntax-3/#starts-with-a-number
function likeNumber(value) {
  const code = value.charCodeAt(0)
  let nextCode

  if (code === plus || code === minus) {
    nextCode = value.charCodeAt(1)

    if (nextCode >= 48 && nextCode <= 57) {
      return true
    }

    let nextNextCode = value.charCodeAt(2)

    if (nextCode === dot && nextNextCode >= 48 && nextNextCode <= 57) {
      return true
    }

    return false
  }

  if (code === dot) {
    nextCode = value.charCodeAt(1)

    if (nextCode >= 48 && nextCode <= 57) {
      return true
    }

    return false
  }

  if (code >= 48 && code <= 57) {
    return true
  }

  return false
}

// Consume a number
// https://www.w3.org/TR/css-syntax-3/#consume-number
module.exports = function (value) {
  const length = value.length

  let pos = 0
  let code
  let nextCode
  let nextNextCode

  if (length === 0 || !likeNumber(value)) {
    return false
  }

  code = value.charCodeAt(pos)

  if (code === plus || code === minus) {
    pos++
  }

  while (pos < length) {
    code = value.charCodeAt(pos)

    if (code < 48 || code > 57) {
      break
    }

    pos += 1
  }

  code = value.charCodeAt(pos)
  nextCode = value.charCodeAt(pos + 1)

  if (code === dot && nextCode >= 48 && nextCode <= 57) {
    pos += 2

    while (pos < length) {
      code = value.charCodeAt(pos)

      if (code < 48 || code > 57) {
        break
      }

      pos += 1
    }
  }

  code = value.charCodeAt(pos)
  nextCode = value.charCodeAt(pos + 1)
  nextNextCode = value.charCodeAt(pos + 2)

  if (
    (code === exp || code === EXP) &&
    ((nextCode >= 48 && nextCode <= 57) ||
      ((nextCode === plus || nextCode === minus) && nextNextCode >= 48 && nextNextCode <= 57))
  ) {
    pos += nextCode === plus || nextCode === minus ? 3 : 2

    while (pos < length) {
      code = value.charCodeAt(pos)

      if (code < 48 || code > 57) {
        break
      }

      pos += 1
    }
  }

  return {
    number: value.slice(0, pos),
    unit: value.slice(pos),
  }
}
