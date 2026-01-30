import { normalizeEscapedKey } from './escape'

let normalizedKey = normalizeEscapedKey(key)
return theme[normalizedKey] ?? theme[key]
