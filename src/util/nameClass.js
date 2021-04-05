import escapeClassName from './escapeClassName'

function escapeCommas(className) {
  return className.replace(/\\,/g, '\\2c ')
}

function asClass(name) {
  return escapeCommas(`.${escapeClassName(name)}`)
}

export default function nameClass(classPrefix, key) {
  if (key === 'DEFAULT') {
    return asClass(classPrefix)
  }

  if (key === '-') {
    return asClass(`-${classPrefix}`)
  }

  if (key.startsWith('-')) {
    return asClass(`-${classPrefix}${key}`)
  }

  return asClass(`${classPrefix}-${key}`)
}
