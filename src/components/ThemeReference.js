import defaultConfig from 'defaultConfig'

const descriptions = {
  screens: "Your project's responsive breakpoints",
  colors: "Your project's color palette",
  spacing: "Your project's spacing scale",
  container: 'Configuration for the `container` plugin',
  inset: 'Values for the `top`, `right`, `bottom`, and `left` properties',
  keyframes: 'Keyframe values used in the `animation` plugin',
  ...Object.fromEntries(
    [
      'placeholderColor',
      'placeholderOpacity',
      'rotate',
      'scale',
      'space',
      'textOpacity',
      'translate',
      'backdropBlur',
      'backdropBrightness',
      'backdropContrast',
      'backdropGrayscale',
      'backdropHueRotate',
      'backdropInvert',
      'backdropOpacity',
      'backdropSaturate',
      'backdropSepia',
      'blur',
      'brightness',
      'borderOpacity',
      'borderWidth',
      'boxShadowColor',
      'contrast',
      'divideColor',
      'divideOpacity',
      'divideWidth',
      'dropShadow',
      'fill',
      'grayscale',
      'hueRotate',
      'invert',
      'gradientColorStops',
      'ringColor',
      'ringOffsetColor',
      'ringOffsetWidth',
      'ringOpacity',
      'ringWidth',
      'rotate',
      'saturate',
      'scale',
      'sepia',
      'skew',
    ].map((pluginName) => [pluginName, `Values for the \`${pluginName}\` plugin`])
  ),
}

export function ThemeReference() {
  return (
    <div className="prose prose-slate dark:prose-dark">
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(defaultConfig.theme).map((key) => (
            <tr key={key}>
              <td>
                <code>{key}</code>
              </td>
              <td>
                {descriptions[key]
                  ?.split(/`([^`]+)`/)
                  .map((segment, i) =>
                    i % 2 === 0 ? segment : <code key={i}>{segment}</code>
                  ) || (
                  <>
                    Values for the{' '}
                    <code>
                      {key.replace(/([a-z])([A-Z])/g, (_m, p1, p2) => `${p1}-${p2.toLowerCase()}`)}
                    </code>{' '}
                    property
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
