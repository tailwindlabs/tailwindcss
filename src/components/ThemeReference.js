import { defaultConfig } from '@/utils/defaultConfig'

const descriptions = {
  screens: "Your project's responsive breakpoints",
  colors: "Your project's color palette",
  spacing: "Your project's spacing scale",
  container: 'Configuration for the `container` plugin',
  inset: 'Values for the `top`, `right`, `bottom`, and `left` properties',
  placeholderColor: 'Values for the `placeholderColor` plugin',
  placeholderOpacity: 'Values for the `placeholderOpacity` plugin',
  rotate: 'Values for the `rotate` plugin',
  scale: 'Values for the `scale` plugin',
  skew: 'Values for the `skew` plugin',
  space: 'Values for the `space` plugin',
  textOpacity: 'Values for the `textOpacity` plugin',
  translate: 'Values for the `translate` plugin',
}

export function ThemeReference() {
  return (
    <div className="prose">
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
