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
