import defaultConfig from 'defaultConfig'

const scale = Object.keys(defaultConfig.theme.spacing)
  .map((name) => ({
    name,
    size: defaultConfig.theme.spacing[name],
    pixels:
      parseFloat(defaultConfig.theme.spacing[name]) *
      (String(defaultConfig.theme.spacing[name]).endsWith('rem') ? 16 : 1),
  }))
  .sort((a, b) => a.pixels - b.pixels)

export function SpacingScale() {
  return (
    <div className="prose prose-slate dark:prose-dark">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Pixels</th>
            <th className="hidden sm:table-cell">
              <span className="sr-only">Preview</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {scale.map(({ name, size, pixels }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{size}</td>
              <td>{pixels}px</td>
              <td className="hidden sm:table-cell">
                <div className="h-4 bg-cyan-400" style={{ width: size }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
