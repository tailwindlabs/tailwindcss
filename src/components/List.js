export function List({ children }) {
  return <ul className="list-none pl-0 space-y-3 my-5">{children}</ul>
}

export function ListItemGood({ children }) {
  return (
    <li className="flex items-start space-x-2">
      <svg className="w-6 h-6 flex-none mt-0.5" fill="none">
        <circle cx="12" cy="12" r="12" fill="#A7F3D0" />
        <path d="M18 8l-8 8-4-4" stroke="#047857" strokeWidth="2" />
      </svg>
      <span className="prose">{children}</span>
    </li>
  )
}

export function ListItemBad({ children }) {
  return (
    <li className="flex items-start space-x-2">
      <svg className="w-6 h-6 flex-none mt-0.5" fill="none">
        <circle cx="12" cy="12" r="12" fill="#FECDD3" />
        <path d="M8 8l8 8M16 8l-8 8" stroke="#B91C1C" strokeWidth="2" />
      </svg>
      <span className="prose">{children}</span>
    </li>
  )
}
