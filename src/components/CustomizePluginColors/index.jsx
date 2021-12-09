import { Editor } from '@/components/Editor'
import { highlightedCode } from './snippet.js?highlight=diff-js'

export function CustomizePluginColors({ name, configKey, children }) {
  return (
    <>
      <p>
        By default, Tailwind makes the entire{' '}
        <a href="/docs/customizing-colors#default-color-palette">default color palette</a> available
        as {name} colors. You can{' '}
        <a href="/docs/colors#customizing">customize your color palette</a> by editing{' '}
        <code>theme.colors</code> or <code>theme.extend.colors</code> in your{' '}
        <code>tailwind.config.js</code> file.
      </p>
      {children || (
        <Editor filename="tailwind.config.js">
          <pre className="language-diff-js">
            <code
              className="language-diff-js"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </Editor>
      )}
      <p>
        Alternatively, you can customize just your {name} colors by editing{' '}
        <code>theme.{configKey}</code> or <code>theme.extend.{configKey}</code> in your{' '}
        <code>tailwind.config.js</code> file.
      </p>
      <p>
        Learn more about customizing the default theme in the{' '}
        <a href="/docs/theme#customizing-the-default-theme">theme customization</a> documentation.
      </p>
    </>
  )
}
