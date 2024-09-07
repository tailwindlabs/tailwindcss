import type { Theme, ThemeKey } from './theme'
import { withAlpha } from './utilities'
import { toKeyPath } from './utils/to-key-path'

/**
 * Looks up a value in the CSS theme
 */
export function resolveThemeValue(theme: Theme, path: string, defaultValue?: string) {
  // Extract an eventual modifier from the path. e.g.:
  // - "colors.red.500 / 50%" -> "50%"
  // - "foo/bar/baz/50%"      -> "50%"
  let lastSlash = path.lastIndexOf('/')
  let modifier: string | null = null
  if (lastSlash !== -1) {
    modifier = path.slice(lastSlash + 1).trim()
    path = path.slice(0, lastSlash).trim()
  }

  let themeValue = lookupThemeValue(theme, path, defaultValue)

  // Apply the opacity modifier if present
  if (modifier && typeof themeValue === 'string') {
    return withAlpha(themeValue, modifier)
  }

  return themeValue
}

function toThemeKey(keypath: string[]) {
  return (
    keypath
      // [1] should move into the nested object tuple. To create the CSS variable
      // name for this, we replace it with an empty string that will result in two
      // subsequent dashes when joined.
      .map((path) => (path === '1' ? '' : path))

      // Resolve the key path to a CSS variable segment
      .map((part) =>
        part
          .replaceAll('.', '_')
          .replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}-${b.toLowerCase()}`),
      )

      // Remove the `DEFAULT` key at the end of a path
      // We're reading from CSS anyway so it'll be a string
      .filter((part, index) => part !== 'DEFAULT' || index !== keypath.length - 1)
      .join('-')
  )
}

function lookupThemeValue(theme: Theme, path: string, defaultValue?: string) {
  if (path.startsWith('--')) {
    return theme.get([path as any]) ?? defaultValue
  }

  let baseThemeKey = '--' + toThemeKey(toKeyPath(path))

  let resolvedValue = theme.get([baseThemeKey as ThemeKey])

  if (resolvedValue !== null) {
    return resolvedValue
  }

  for (let [givenKey, upgradeKey] of Object.entries(themeUpgradeKeys)) {
    if (!baseThemeKey.startsWith(givenKey)) continue

    let upgradedKey = upgradeKey + baseThemeKey.slice(givenKey.length)
    let resolvedValue = theme.get([upgradedKey as ThemeKey])

    if (resolvedValue !== null) {
      return resolvedValue
    }
  }

  return defaultValue
}

let themeUpgradeKeys = {
  '--colors': '--color',
  '--accent-color': '--color',
  '--backdrop-blur': '--blur',
  '--backdrop-brightness': '--brightness',
  '--backdrop-contrast': '--contrast',
  '--backdrop-grayscale': '--grayscale',
  '--backdrop-hue-rotate': '--hueRotate',
  '--backdrop-invert': '--invert',
  '--backdrop-opacity': '--opacity',
  '--backdrop-saturate': '--saturate',
  '--backdrop-sepia': '--sepia',
  '--background-color': '--color',
  '--background-opacity': '--opacity',
  '--border-color': '--color',
  '--border-opacity': '--opacity',
  '--border-spacing': '--spacing',
  '--box-shadow-color': '--color',
  '--caret-color': '--color',
  '--divide-color': '--borderColor',
  '--divide-opacity': '--borderOpacity',
  '--divide-width': '--borderWidth',
  '--fill': '--color',
  '--flex-basis': '--spacing',
  '--gap': '--spacing',
  '--gradient-color-stops': '--color',
  '--height': '--spacing',
  '--inset': '--spacing',
  '--margin': '--spacing',
  '--max-height': '--spacing',
  '--max-width': '--spacing',
  '--min-height': '--spacing',
  '--min-width': '--spacing',
  '--outline-color': '--color',
  '--padding': '--spacing',
  '--placeholder-color': '--color',
  '--placeholder-opacity': '--opacity',
  '--ring-color': '--color',
  '--ring-offset-color': '--color',
  '--ring-opacity': '--opacity',
  '--scroll-margin': '--spacing',
  '--scroll-padding': '--spacing',
  '--space': '--spacing',
  '--stroke': '--color',
  '--text-color': '--color',
  '--text-decoration-color': '--color',
  '--text-indent': '--spacing',
  '--text-opacity': '--opacity',
  '--translate': '--spacing',
  '--size': '--spacing',
  '--width': '--spacing',
}
