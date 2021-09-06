export default function prefixNegativeModifiers(base, modifier) {
  if (modifier === '-') {
    return `-${base}`
  } else if (modifier.startsWith('-')) {
    return `-${base}-${modifier.slice(1)}`
  } else {
    return `${base}-${modifier}`
  }
}
