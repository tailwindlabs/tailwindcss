export function Widont({ children }) {
  return children.replace(/ ([^ ]+)$/, '\u00A0$1')
}
