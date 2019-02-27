import cssesc from 'cssesc'

export default function escapeClassName(className) {
  return cssesc(className, { isIdentifier: true })
}
