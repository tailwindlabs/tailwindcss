import { highlightedCode } from './snippet.html?highlight'

export function HoverFocusAndOtherStates({
  property,
  utility,
  variant = 'hover',
  defaultClass,
  featuredClass,
  element = 'div',
  children,
}) {
  return (
    <>
      <p>
        Tailwind lets you conditionally apply utility classes in different states using variant
        modifiers. For example, use{' '}
        <code>
          {variant}:{featuredClass}
        </code>{' '}
        to only apply the <code>{featuredClass}</code> utility on {variant}.
      </p>
      {children || (
        <pre className="language-html">
          <code
            className="language-html"
            dangerouslySetInnerHTML={{
              __html: highlightedCode
                .replace(/{element}/g, element)
                .replace('{defaultClass} ', defaultClass ? `${defaultClass} ` : '')
                .replace('{variant}', variant)
                .replace('{featuredClass}', featuredClass),
            }}
          />
        </pre>
      )}
      <p>
        For a complete list of all available state modifiers, check out the{' '}
        <a href="/docs/hover-focus-and-other-states">Hover, Focus, & Other States</a> documentation.
      </p>
    </>
  )
}
