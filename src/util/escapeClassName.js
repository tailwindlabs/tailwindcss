export default function escapeClassName(className) {
  return className.replace(/([^A-Za-z0-9\-])/g, '\\$1')
}
