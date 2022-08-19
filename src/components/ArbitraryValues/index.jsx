import { highlightedCode } from './snippet.html?highlight'

export function ArbitraryValues({
  property,
  name,
  defaultClass,
  featuredClass,
  hasTheme = true,
  element = 'div',
  children,
}) {
  const nameOrProperty = name ? (
    name
  ) : (
    <>
      <code>{property}</code> value
    </>
  )

  return (
    <>
      {hasTheme ? (
        <p>
          If you need to use a one-off {nameOrProperty} that doesn’t make sense to include in your
          theme, use square brackets to generate a property on the fly using any arbitrary value.
        </p>
      ) : (
        <p>
          If you need to use a one-off {nameOrProperty} that isn't included in Tailwind by default,
          use square brackets to generate a property on the fly using any arbitrary value.
        </p>
      )}
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
        Learn more about arbitrary value support in the{' '}
        <a href="/docs/adding-custom-styles#using-arbitrary-values">arbitrary values</a>{' '}
        documentation.
      </p>
    </>
  )
}
