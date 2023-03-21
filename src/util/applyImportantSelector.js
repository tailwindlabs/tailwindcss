import { splitAtTopLevelOnly } from './splitAtTopLevelOnly'

export function applyImportantSelector(selector, important) {
  let matches = /^(.*?)(:before|:after|::[\w-]+)(\)*)$/g.exec(selector)
  if (!matches) return `${important} ${wrapWithIs(selector)}`

  let [, before, pseudo, brackets] = matches
  return `${important} ${wrapWithIs(before + brackets)}${pseudo}`
}

function wrapWithIs(selector) {
  let parts = splitAtTopLevelOnly(selector, ' ')

  if (parts.length === 1 && parts[0].startsWith(':is(') && parts[0].endsWith(')')) {
    return selector
  }

  return `:is(${selector})`
}
