import corePluginsWithExamples from 'utilities?examples'

const descriptions = {
  preflight: "Tailwind's base/reset styles",
  container: 'The `container` component',
  accessibility: 'The `sr-only` and `not-sr-only` utilities',
  backgroundOpacity: 'The `background-color` opacity utilities like `bg-opacity-25`',
  borderOpacity: 'The `border-color` opacity utilities like `border-opacity-25`',
  divideColor: 'The between elements `border-color` utilities like `divide-slate-500`',
  divideWidth: 'The between elements `border-width` utilities like `divide-x-2`',
  placeholderColor: 'The placeholder `color` utilities like `placeholder-red-600`',
  placeholderOpacity: 'The placeholder `color` opacity utilities like `placeholder-opacity-25`',
  space: 'The "space-between" utilities like `space-x-4`',
  transform: 'The `transform` utility (for enabling transform features)',
}

export function CorePluginReference() {
  return (
    <div className="prose prose-slate dark:prose-dark">
      <table>
        <thead>
          <tr>
            <th>Core Plugin</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {corePluginsWithExamples
            .sort(({ plugin: a }, { plugin: b }) => {
              return a < b ? -1 : 1
            })
            .map(({ plugin, example }) => (
              <tr key={plugin}>
                <td>
                  <code>{plugin}</code>
                </td>
                <td>
                  {descriptions[plugin]
                    ?.split(/`([^`]+)`/)
                    .map((segment, i) =>
                      i % 2 === 0 ? segment : <code key={i}>{segment}</code>
                    ) || (
                    <>
                      The{' '}
                      <code>
                        {plugin.replace(
                          /([a-z])([A-Z])/g,
                          (_m, p1, p2) => `${p1}-${p2.toLowerCase()}`
                        )}
                      </code>{' '}
                      utilities like <code>{example}</code>
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
