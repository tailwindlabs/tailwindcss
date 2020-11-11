import Link from 'next/link'
import { usePrevNext } from '@/hooks/usePrevNext'
import { PageHeader } from '@/components/PageHeader'

export function VideoLayout({ children, meta }) {
  let { next } = usePrevNext()

  return (
    <div className="pt-24 pb-16 lg:pt-28 w-full">
      <PageHeader title={meta.title} description={meta.description} />
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
          <Link href={next && next.published !== false ? next.href : '/course/coming-soon'}>
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
      </div>
    </div>
  )
}
