import Link from 'next/link'
import clsx from 'clsx'

export function Footer({ children, previous, next }) {
  return (
    <footer className={clsx('text-sm leading-6', previous || next ? 'mt-12' : 'mt-16')}>
      {(previous || next) && (
        <div className="mb-10 text-gray-700 font-semibold flex items-center">
          {previous && (
            <Link href={previous.href}>
              <a className="group flex items-center hover:text-gray-900">
                <svg
                  viewBox="0 0 3 6"
                  className="mr-3 w-auto h-1.5 text-gray-400 overflow-visible group-hover:text-gray-600"
                >
                  <path
                    d="M3 0L0 3L3 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {previous.shortTitle || previous.title}
              </a>
            </Link>
          )}
          {next && (
            <Link href={next.href}>
              <a className="group ml-auto flex items-center hover:text-gray-900">
                {next.shortTitle || next.title}
                <svg
                  viewBox="0 0 3 6"
                  className="ml-3 w-auto h-1.5 text-gray-400 overflow-visible group-hover:text-gray-600"
                >
                  <path
                    d="M0 0L3 3L0 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Link>
          )}
        </div>
      )}
      <div className="pt-10 pb-28 border-t border-gray-200 sm:flex justify-between text-gray-500">
        <div className="mb-6 sm:mb-0 sm:flex">
          <p>Copyright &copy; 2021 Tailwind Labs Inc.</p>
          <p className="sm:ml-4 sm:pl-4 sm:border-l sm:border-gray-200">
            <Link href="/brand">
              <a className="hover:text-gray-900">Trademark Policy</a>
            </Link>
          </p>
        </div>
        {children ? (
          children
        ) : (
          <div className="flex space-x-10 text-gray-400">
            <a href="https://github.com/tailwindlabs/tailwindcss" className="hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg width="25" height="24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.846 0c-6.63 0-12 5.506-12 12.303 0 5.445 3.435 10.043 8.205 11.674.6.107.825-.262.825-.585 0-.292-.015-1.261-.015-2.291-3.015.569-3.795-.754-4.035-1.446-.135-.354-.72-1.446-1.23-1.738-.42-.23-1.02-.8-.015-.815.945-.015 1.62.892 1.845 1.261 1.08 1.86 2.805 1.338 3.495 1.015.105-.8.42-1.338.765-1.645-2.67-.308-5.46-1.37-5.46-6.075 0-1.338.465-2.446 1.23-3.307-.12-.308-.54-1.569.12-3.26 0 0 1.005-.323 3.3 1.26.96-.276 1.98-.415 3-.415s2.04.139 3 .416c2.295-1.6 3.3-1.261 3.3-1.261.66 1.691.24 2.952.12 3.26.765.861 1.23 1.953 1.23 3.307 0 4.721-2.805 5.767-5.475 6.075.435.384.81 1.122.81 2.276 0 1.645-.015 2.968-.015 3.383 0 .323.225.707.825.585a12.047 12.047 0 0 0 5.919-4.489 12.537 12.537 0 0 0 2.256-7.184c0-6.798-5.37-12.304-12-12.304Z"
                />
              </svg>
            </a>
            <a href="/discord" className="hover:text-gray-500">
              <span className="sr-only">Discord</span>
              <svg width="23" height="24" fill="currentColor">
                <path d="M9.555 9.23c-.74 0-1.324.624-1.324 1.385S8.827 12 9.555 12c.739 0 1.323-.624 1.323-1.385.013-.761-.584-1.385-1.323-1.385Zm4.737 0c-.74 0-1.324.624-1.324 1.385S13.564 12 14.292 12c.74 0 1.324-.624 1.324-1.385s-.584-1.385-1.324-1.385Z" />
                <path d="M20.404 0H3.442c-.342 0-.68.065-.995.19a2.614 2.614 0 0 0-.843.536 2.46 2.46 0 0 0-.562.801c-.13.3-.197.62-.196.944v16.225c0 .324.066.645.196.944.13.3.321.572.562.801.241.23.527.412.843.537.315.124.653.189.995.19h14.354l-.67-2.22 1.62 1.428 1.532 1.344L23 24V2.472c0-.324-.066-.644-.196-.944a2.46 2.46 0 0 0-.562-.8A2.614 2.614 0 0 0 21.4.19a2.726 2.726 0 0 0-.995-.19V0Zm-4.886 15.672s-.456-.516-.836-.972c1.659-.444 2.292-1.428 2.292-1.428a7.38 7.38 0 0 1-1.456.707 8.67 8.67 0 0 1-1.836.517 9.347 9.347 0 0 1-3.279-.012 11.074 11.074 0 0 1-1.86-.516 7.621 7.621 0 0 1-.924-.409c-.039-.023-.076-.035-.113-.06-.027-.011-.04-.023-.052-.035-.228-.12-.354-.204-.354-.204s.608.96 2.215 1.416c-.38.456-.848.996-.848.996-2.797-.084-3.86-1.824-3.86-1.824 0-3.864 1.822-6.996 1.822-6.996 1.823-1.296 3.557-1.26 3.557-1.26l.127.145c-2.278.623-3.33 1.57-3.33 1.57s.279-.143.747-.347c1.355-.564 2.43-.72 2.873-.756.077-.012.14-.024.216-.024a10.804 10.804 0 0 1 6.368 1.129s-1.001-.9-3.153-1.526l.178-.19s1.735-.037 3.557 1.259c0 0 1.823 3.133 1.823 6.996 0 0-1.076 1.74-3.874 1.824Z" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </footer>
  )
}
