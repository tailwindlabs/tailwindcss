import Link from 'next/link'
import { usePrevNext } from '@/hooks/usePrevNext'

export function VideoLayout({ children, meta }) {
  let { next } = usePrevNext()

  return (
    <div className="pt-24 pb-16 lg:pt-28 w-full">
      <div className="markdown mb-6 px-6 max-w-3xl mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:px-12 xl:w-3/4">
        <h1>{meta.title}</h1>
        <div className="mt-0 mb-4 text-gray-600">{meta.description}</div>
        <hr className="my-8 border-b-2 border-gray-200" />
      </div>
      <div className="mb-8 px-6 xl:px-12 relative z-10">
        <div className="relative bg-gray-900" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0" data-vimeo-initialized="true">
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <iframe
                title={meta.title}
                src={`https://player.vimeo.com/video/${meta.vimeoId}?title=0&byline=0&portrait=0&speed=1&app_id=122963`}
                frameBorder={0}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <a
              href={meta.downloadHd}
              className="hidden sm:inline text-gray-600 hover:text-gray-900"
            >
              <span>Download HD</span>
            </a>{' '}
            <a href={meta.downloadSd} className="sm:ml-6 text-gray-600 hover:text-gray-900">
              <span>
                Download<span className="sm:hidden"> video</span>
                <span className="hidden sm:inline"> SD</span>
              </span>
            </a>{' '}
            <a href={meta.sourceCode} className="ml-6 text-gray-600 hover:text-gray-900">
              <span>Source code</span>
            </a>
          </div>
          <Link href={next ? next.href : '/screencasts/coming-soon'}>
            <a className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <span>
                Next<span className="hidden sm:inline"> lesson</span>
              </span>
              <svg viewBox="0 0 24 24" className="ml-2 h-4 w-4 fill-current text-gray-500">
                <path d="M18.59 13H3a1 1 0 0 1 0-2h15.59l-5.3-5.3a1 1 0 1 1 1.42-1.4l7 7a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.42-1.4l5.3-5.3z" />
              </svg>
            </a>
          </Link>
        </div>
      </div>
      <div className="flex">
        <div className="markdown px-6 xl:px-12 w-full max-w-3xl mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
          <h2>Tools used</h2>
          <ul>
            <li>
              <a href="https://code.visualstudio.com/">VS Code</a> as the editor
            </li>
            <li>
              <a href="https://adamwathan.me/sizzy">Sizzy</a> for the browser preview on the
              right-hand side
            </li>
            <li>
              <a href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss">
                Tailwind CSS Intellisense
              </a>{' '}
              for intelligent auto-completion in VS Code
            </li>
          </ul>
        </div>
        <div className="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
          <div className="flex flex-col justify-between overflow-y-auto sticky top-16 max-h-(screen-16) pt-12 pb-4">
            <div id="ad" />
            <div id="tailwind-ui-widget">
              <a
                href="https://tailwindui.com/?utm_source=tailwindcss&utm_medium=sidebar-widget"
                className="mt-3 block"
              >
                <img src="/img/tailwind-ui-sidebar.png" alt="Tailwind UI" />
              </a>
              <p className="mt-4 text-gray-700">
                <a
                  href="https://tailwindui.com/?utm_source=tailwindcss&utm_medium=sidebar-widget"
                  className="text-gray-700"
                >
                  Beautiful UI components by the creators of Tailwind CSS.
                </a>
              </p>
              <div className="mt-2">
                <a
                  href="https://tailwindui.com?utm_source=tailwindcss&utm_medium=sidebar-widget"
                  className="text-sm text-gray-800 font-medium hover:underline"
                >
                  Learn more →
                </a>
              </div>
            </div>
            <div id="refactoring-ui-widget" style={{ display: 'none' }}>
              <a
                href="https://refactoringui.com/book?utm_source=tailwindcss&utm_medium=sidebar-widget"
                className="mt-3 block"
              >
                <img src="/img/refactoring-ui-book.png" alt="" />
              </a>
              <p className="text-gray-700 text-center">
                <a
                  href="https://refactoringui.com/book?utm_source=tailwindcss&utm_medium=sidebar-widget"
                  className="text-gray-700"
                >
                  Learn UI design, from the creators of Tailwind CSS.
                </a>
              </p>
              <div className="mt-3 text-center">
                <a
                  href="https://refactoringui.com/book?utm_source=tailwindcss&utm_medium=sidebar-widget"
                  className="inline-block px-3 py-2 text-sm bg-indigo-500 text-white font-semibold rounded hover:bg-indigo-600"
                >
                  Learn more →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
