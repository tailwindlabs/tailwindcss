export function List({ children }) {
  return <ul className="list-none pl-0">{children}</ul>
}

export function ListItemGood({ children }) {
  return (
    <li className="flex">
      <svg viewBox="0 0 24 24" className="h-6 w-6 mr-2 flex-shrink-0">
        <circle cx="12" cy="12" r="10" className="text-green-200 fill-current" />
        <path
          d="M10 14.59l6.3-6.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l2.3 2.3z"
          className="text-green-600 fill-current"
        />
      </svg>
      <span className="-mt-px">{children}</span>
    </li>
  )
}

export function ListItemBad({ children }) {
  return (
    <li className="flex">
      <svg viewBox="0 0 24 24" className="h-6 w-6 mr-2 flex-shrink-0">
        <circle cx="12" cy="12" r="10" fill="#fed7d7" />
        <path
          fill="#f56565"
          d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"
        />
      </svg>
      <span className="-mt-px">{children}</span>
    </li>
  )
}
