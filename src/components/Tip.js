export function TipGood({ children }) {
  return (
    <p className="flex items-start mt-8 mb-4 space-x-2">
      <svg className="w-6 h-6 flex-none mt-0.5" fill="none">
        <circle cx="12" cy="12" r="12" fill="#A7F3D0" />
        <path d="M18 8l-8 8-4-4" stroke="#047857" strokeWidth="2" />
      </svg>
      <strong className="text-base leading-7 font-semibold text-gray-900">{children}</strong>
    </p>
  )
}

export function TipBad({ children }) {
  return (
    <p className="flex items-start mt-8 mb-4 space-x-2">
      <svg className="w-6 h-6 flex-none mt-0.5" fill="none">
        <circle cx="12" cy="12" r="12" fill="#FECDD3" />
        <path d="M8 8l8 8M16 8l-8 8" stroke="#B91C1C" strokeWidth="2" />
      </svg>
      <strong className="text-base leading-7 font-semibold text-gray-900">{children}</strong>
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
