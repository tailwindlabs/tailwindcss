import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'

export function migrateMaxWidthScreen(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): string {
  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    if (
      candidate.kind === 'functional' &&
      candidate.root === 'max-w' &&
      candidate.value?.value.startsWith('screen-')
    ) {
      return designSystem.printCandidate({
        ...candidate,
        value: {
          ...candidate.value,
          value: `[theme(screens.${candidate.value.value.slice(7)})]`,
        },
      })
    }
  }
  return rawCandidate
}
