export function TipGood({ children }) {
  return (
    <p className="flex items-start mt-8 mb-0">
      <svg className="h-6 w-6 mr-2 flex-shrink-0" viewBox="0 0 24 24">
        <circle className="text-green-200 fill-current" cx="12" cy="12" r="10" />
        <path
          className="text-green-600 fill-current"
          d="M10 14.59l6.3-6.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l2.3 2.3z"
        />
      </svg>
      <strong className="text-base font-semibold text-gray-800">{children}</strong>
    </p>
  )
}

export function TipBad({ children }) {
  return (
    <p className="flex items-start mt-8 mb-0">
      <svg className="h-6 w-6 mr-2 flex-shrink-0" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#fed7d7" />
        <path
          fill="#f56565"
          d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"
        />
      </svg>
      <strong className="text-base font-semibold text-gray-800">{children}</strong>
    </p>
  )
}

export function TipCompat({ children }) {
  return (
    <div className="text-sm bg-blue-100 text-blue-700 font-semi-bold px-4 py-2 mb-4 rounded">
      <div className="flex items-center">
        <div className="mr-2">
          <svg fill="currentColor" viewBox="0 0 20 20" className="block text-blue-400 h-5 w-5">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.432 15C14.387 9.893 12 8.547 12 6V3h.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H8v3c0 2.547-2.387 3.893-4.432 9-.651 1.625-2.323 4 6.432 4s7.083-2.375 6.432-4zm-1.617 1.751c-.702.21-2.099.449-4.815.449s-4.113-.239-4.815-.449c-.249-.074-.346-.363-.258-.628.22-.67.635-1.828 1.411-3.121 1.896-3.159 3.863.497 5.5.497s1.188-1.561 1.824-.497a15.353 15.353 0 0 1 1.411 3.121c.088.265-.009.553-.258.628z"
            />
          </svg>
        </div>
        <div>
          <p className="font-semibold">{children}</p>
        </div>
      </div>
    </div>
  )
}
