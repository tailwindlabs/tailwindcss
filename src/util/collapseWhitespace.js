export default function collapseWhitespace(str) {
  return str.replace(/(\n|\r|\r\n)/g, ' ').replace(/\s+/g, ' ')
}
