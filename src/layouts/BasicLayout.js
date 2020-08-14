import { useIsHome } from '@/hooks/useIsHome'
import { Ad } from '@/components/Ad'
import { PageHeader } from '@/components/PageHeader'
import clsx from 'clsx'

export function BasicLayout({ children, meta, classes, tableOfContents }) {
  let isHome = useIsHome()

  return (
    <div
      id={meta.containerId}
      className={clsx('pb-16 w-full', { 'pt-12': isHome, 'pt-24 lg:pt-28': !isHome })}
    >
      <PageHeader
        title={meta.title}
        description={meta.description}
        badge={{ key: 'Tailwind CSS version', value: meta.featureVersion }}
        border={meta.headerSeparator !== false}
      />
      <div className="flex">
        <div className="markdown px-6 xl:px-12 w-full max-w-3xl mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
          {children}
        </div>
        <div className="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
          <div
            className={clsx(
              'flex flex-col justify-between overflow-y-auto sticky max-h-(screen-16) pt-12 pb-4 -mt-12',
              {
                'top-0': isHome,
                'top-16': !isHome,
              }
            )}
          >
            <Ad />
          </div>
        </div>
      </div>
    </div>
  )
}
