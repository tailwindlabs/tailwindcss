import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { segment } from '../../../../tailwindcss/src/utils/segment'

// Classes that used to exist in Tailwind CSS v3, but do not exist in Tailwind
// CSS v4 anymore.
const LEGACY_CLASS_MAP = {
  'overflow-clip': 'text-clip',
  'overflow-ellipsis': 'text-ellipsis',
  'flex-grow-0': 'grow-0',
  'flex-shrink-0': 'shrink-0',
  'decoration-clone': 'box-decoration-clone',
  'decoration-slice': 'box-decoration-slice',
}

export function simpleLegacyClasses(
  _designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  let variants = segment(rawCandidate, ':')
  let utility = variants.pop()!

  let important = false
  if (utility[0] === '!') {
    important = true
    utility = utility.slice(1)
  } else if (utility[utility?.length - 1] === '!') {
    important = true
    utility = utility.slice(0, -1)
  }

  if (Object.hasOwn(LEGACY_CLASS_MAP, utility)) {
    let replacement = LEGACY_CLASS_MAP[utility as keyof typeof LEGACY_CLASS_MAP]
    return `${variants.concat(replacement).join(':')}${important ? '!' : ''}`
  }

  return rawCandidate
}
