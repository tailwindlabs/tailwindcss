import { highlightedCode } from './snippet.html?highlight'

export function HardwareAcceleration({ defaultClass, element = 'div', children }) {
  return (
    <>
      <p>
        If your transition performs better when rendered by the GPU instead of the CPU, you can
        force hardware acceleration by adding the <code>transform-gpu</code> utility:
      </p>
      {children || (
        <pre className="language-html">
          <code
            className="language-html"
            dangerouslySetInnerHTML={{
              __html: highlightedCode
                .replace(/{element}/g, element)
                .replace('{defaultClass} ', defaultClass ? `${defaultClass} ` : ''),
            }}
          />
        </pre>
      )}
      <p>
        Use <code>transform-cpu</code> to force things back to the CPU if you need to undo this
        conditionally.
      </p>
    </>
  )
}
