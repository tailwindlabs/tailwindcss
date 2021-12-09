import { highlightedCode } from './snippet.html?highlight'

export function RemovingTransforms({ defaultClass, element = 'div', children }) {
  return (
    <>
      <p>
        To remove all of the transforms on an element at once, use the <code>transform-none</code>{' '}
        utility:
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
        This can be useful when you want to remove transforms conditionally, such as on hover or at
        a particular breakpoint.
      </p>
    </>
  )
}
