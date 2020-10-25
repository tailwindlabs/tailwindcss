import escapeClassName from './escapeClassName'

function asClass(name) {
  return `.${escapeClassName(name)}`
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
