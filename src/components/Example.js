export function Example({ preview, snippet, previewClassName }) {
  return (
    <div className="relative overflow-hidden mt-6 mb-8">
      <div
        className={`rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400 ${
          previewClassName || 'p-4'
        }`}
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
