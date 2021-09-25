export function TipGood({ children }) {
  return (
    <p className="flex items-start mt-8 mb-4 space-x-2">
      <svg className="w-6 h-6 flex-none mt-0.5" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#A7F3D0" />
        <path d="M18 8l-8 8-4-4" stroke="#047857" strokeWidth="2" />
      </svg>
      <strong className="flex-1 text-base leading-7 font-semibold text-gray-900">{children}</strong>
    </p>
  )
}

export function TipBad({ children }) {
  return (
    <p className="flex items-start mt-8 mb-4 space-x-2">
      <svg className="w-6 h-6 flex-none mt-0.5" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#FECDD3" />
        <path d="M8 8l8 8M16 8l-8 8" stroke="#B91C1C" strokeWidth="2" />
      </svg>
      <strong className="flex-1 text-base leading-7 font-semibold text-gray-900">{children}</strong>
    </p>
  )
}

export function TipCompat({ children }) {
  return (
    <div className="text-sm bg-light-blue-100 text-light-blue-800 font-medium px-4 py-3 mb-4 rounded-xl">
      <div className="flex items-start space-x-3">
        <svg width="20" height="20" className="text-light-blue-500" fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.998 2a1 1 0 00-.707 1.707l.707.707v3.758a1 1 0 01-.293.707l-4 4C.815 14.769 2.154 18 4.826 18H15.17c2.672 0 4.01-3.231 2.12-5.121l-4-4a1 1 0 01-.292-.707V4.414l.707-.707A1 1 0 0012.998 2h-6zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.992 1.992 0 00-.114-.035l1.063-1.063a3 3 0 00.879-2.121z"
          />
        </svg>
        <p className="flex-1">{children}</p>
      </div>
    </div>
  )
}

export function TipInfo({ children }) {
  return (
    <div className="text-sm leading-6 bg-blue-50 text-blue-800 px-6 py-4 mb-8 rounded-lg">
      <div className="flex items-start space-x-3">
        <svg className="mt-1" height="40" width="40" fill="none" viewBox="0 0 40 40">
          <path
            fill="#93C5FD"
            d="M5 5a3 3 0 013-3h13.757a3 3 0 012.122.879L30.12 9.12a3 3 0 01.88 2.123V31a3 3 0 01-3 3H8a3 3 0 01-3-3V5z"
          />
          <path
            fill="#DBEAFE"
            d="M7 5a1 1 0 011-1h13a1 1 0 011 1v5a1 1 0 001 1h5a1 1 0 011 1v19a1 1 0 01-1 1H8a1 1 0 01-1-1V5z"
          />
          <path
            stroke="#93C5FD"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 18h7m-9 3h10m-8 3h7"
          />
          <path
            fill="#60A5FA"
            fillRule="evenodd"
            d="M24.634 26.22a8.001 8.001 0 00-11.977-10.562A8 8 0 0023.22 27.635l2.872 2.872a1 1 0 000 1.414l5.657 5.657a1 1 0 001.414 0l1.414-1.414a1 1 0 000-1.415l-5.657-5.656a1 1 0 00-1.414 0l-2.872-2.873zm-2.078-.663a6 6 0 10-8.485-8.485 6 6 0 008.485 8.485z"
            clipRule="evenodd"
          />
        </svg>
        <p className="flex-1 min-w-0">{children}</p>
      </div>
    </div>
  )
}
