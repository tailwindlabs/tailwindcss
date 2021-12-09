import { highlightedCode } from './snippet.html?highlight'

export function BreakpointsAndMediaQueries({
  defaultClass,
  featuredClass,
  element = 'div',
  children,
}) {
  return (
    <>
      <p>
        You can also use variant modifiers to target media queries like responsive breakpoints, dark
        mode, prefers-reduced-motion, and more. For example, use <code>md:{featuredClass}</code> to
        apply the <code>{featuredClass}</code> utility at only medium screen sizes and above.
      </p>
      {children || (
        <pre className="language-html">
          <code
            className="language-html"
            dangerouslySetInnerHTML={{
              __html: highlightedCode
                .replace(/{element}/g, element)
                .replace('{defaultClass} ', defaultClass ? `${defaultClass} ` : '')
                .replace('{featuredClass}', featuredClass),
            }}
          />
        </pre>
      )}
      <p>
        To learn more, check out the documentation on{' '}
        <a href="/docs/responsive-design">Responsive Design</a>,{' '}
        <a href="/docs/dark-mode">Dark Mode</a> and{' '}
        <a href="/docs/hover-focus-and-other-states#media-queries">other media query modifiers</a>.
      </p>
    </>
  )
}
