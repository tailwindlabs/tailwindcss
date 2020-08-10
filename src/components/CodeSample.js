import clsx from 'clsx'

export function CodeSample({ preview, snippet, previewClassName }) {
  return (
    <div className="relative overflow-hidden mb-8">
      <div
        className={clsx(
          'rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400',
          previewClassName,
          {
            'p-4': !previewClassName,
          }
        )}
        dangerouslySetInnerHTML={{ __html: preview }}
      />
      <div className="rounded-b-lg bg-gray-800">
        <pre className="scrollbar-none m-0 p-0 language-html">
          <code
            className="inline-block p-4 scrolling-touch language-html"
            dangerouslySetInnerHTML={{ __html: snippet }}
          />
        </pre>
      </div>
    </div>
  )
}
