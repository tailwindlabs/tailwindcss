import {
  useState,
  useEffect,
  createContext,
  Fragment,
  useCallback,
  isValidElement,
  useContext,
} from 'react'
import { ClassTable } from '@/components/ClassTable'
import { useIsHome } from '@/hooks/useIsHome'
import { usePrevNext } from '@/hooks/usePrevNext'
import Link from 'next/link'
import { SidebarLayout, SidebarContext } from '@/layouts/SidebarLayout'
import { Ad } from '@/components/Ad'
import { PageHeader } from '@/components/PageHeader'
import clsx from 'clsx'

export const ContentsContext = createContext()

function TableOfContents({ tableOfContents, currentSection }) {
  let sidebarContext = useContext(SidebarContext)
  let isMainNav = Boolean(sidebarContext)

  function closeNav() {
    if (isMainNav) {
      sidebarContext.setNavIsOpen(false)
    }
  }

  return (
    <>
      <h5 className="text-gray-500 uppercase tracking-wide font-bold text-sm lg:text-xs">
        On this page
      </h5>
      <ul className="mt-4 overflow-x-hidden">
        {tableOfContents.map((section) => {
          let sectionIsActive =
            currentSection === section.slug ||
            section.children.findIndex(({ slug }) => slug === currentSection) > -1

          return (
            <Fragment key={section.slug}>
              <li className={clsx({ 'mb-4 lg:mb-2': isMainNav, 'mb-2': !isMainNav })}>
                <a
                  href={`#${section.slug}`}
                  onClick={closeNav}
                  className={clsx(
                    'block transition-fast hover:translate-r-2px hover:text-gray-900 font-medium',
                    {
                      'translate-r-2px text-gray-900': sectionIsActive,
                      'text-gray-600': !sectionIsActive,
                    }
                  )}
                >
                  {section.title}
                </a>
              </li>
              {section.children.map((subsection) => {
                let subsectionIsActive = currentSection === subsection.slug

                return (
                  <li
                    className={clsx({
                      'mb-4 ml-4 lg:mb-2 lg:ml-2': isMainNav,
                      'mb-2 ml-2': !isMainNav,
                    })}
                    key={subsection.slug}
                  >
                    <a
                      href={`#${subsection.slug}`}
                      onClick={closeNav}
                      className={clsx(
                        'block transition-fast hover:translate-r-2px hover:text-gray-900 font-medium',
                        {
                          'translate-r-2px text-gray-900': subsectionIsActive,
                          'text-gray-600': !subsectionIsActive,
                        }
                      )}
                    >
                      {subsection.title}
                    </a>
                  </li>
                )
              })}
            </Fragment>
          )
        })}
      </ul>
    </>
  )
}

function useTableOfContents(tableOfContents) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.slug)
  let [headings, setHeadings] = useState([])

  const registerHeading = useCallback((id, top) => {
    setHeadings((headings) => [...headings.filter((h) => id !== h.id), { id, top }])
  }, [])

  const unregisterHeading = useCallback((id) => {
    setHeadings((headings) => headings.filter((h) => id !== h.id))
  }, [])

  useEffect(() => {
    if (tableOfContents.length === 0 || headings.length === 0) return
    function onScroll() {
      let y = window.pageYOffset
      let windowHeight = window.innerHeight
      let sortedHeadings = headings.concat([]).sort((a, b) => a.top - b.top)
      if (y <= 0) {
        setCurrentSection(sortedHeadings[0].id)
        return
      }
      if (y + windowHeight >= document.body.scrollHeight) {
        setCurrentSection(sortedHeadings[sortedHeadings.length - 1].id)
        return
      }
      const middle = y + windowHeight / 2
      let current = sortedHeadings[0].id
      for (let i = 0; i < sortedHeadings.length; i++) {
        if (middle >= sortedHeadings[i].top) {
          current = sortedHeadings[i].id
        }
      }
      setCurrentSection(current)
    }
    window.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true,
    })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [headings, tableOfContents])

  return { currentSection, registerHeading, unregisterHeading }
}

export function ContentsLayoutOuter({ children, layoutProps, ...props }) {
  const { currentSection, registerHeading, unregisterHeading } = useTableOfContents(
    layoutProps.tableOfContents
  )

  return (
    <SidebarLayout
      sidebar={
        <div className="mb-8">
          <TableOfContents
            tableOfContents={layoutProps.tableOfContents}
            currentSection={currentSection}
          />
        </div>
      }
      {...props}
    >
      <ContentsContext.Provider value={{ registerHeading, unregisterHeading }}>
        {children}
      </ContentsContext.Provider>
    </SidebarLayout>
  )
}

export function ContentsLayout({ children, meta, classes, tableOfContents }) {
  const toc = [
    ...(classes ? [{ title: 'Class reference', slug: 'class-reference', children: [] }] : []),
    ...tableOfContents,
  ]

  const { currentSection, registerHeading, unregisterHeading } = useTableOfContents(toc)
  let isHome = useIsHome()
  let { prev, next } = usePrevNext()

  return (
    <div
      id={meta.containerId}
      className={clsx('pb-16 w-full', {
        'pt-12': isHome,
        'pt-24 lg:pt-28': !isHome,
      })}
    >
      <PageHeader
        title={meta.title}
        description={meta.description}
        badge={{ key: 'Tailwind CSS version', value: meta.featureVersion }}
        border={!classes && meta.headerSeparator !== false}
      />
      <div className="flex">
        <div className="markdown px-6 xl:px-12 w-full max-w-3xl mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
          <ContentsContext.Provider value={{ registerHeading, unregisterHeading }}>
            {classes && (
              <ClassTable {...(isValidElement(classes) ? { custom: classes } : classes)} />
            )}
            {children}
          </ContentsContext.Provider>
          {(prev || next) && (
            <>
              <hr />
              <div className="-mt-6 flex justify-between">
                {prev && (
                  <Link href={prev.href}>
                    <a className="font-medium text-blue-500 underline hover:text-blue-700">
                      ← {prev.shortTitle || prev.title}
                    </a>
                  </Link>
                )}
                {next && (
                  <Link href={next.href}>
                    <a className="font-medium text-blue-500 underline hover:text-blue-700">
                      {next.shortTitle || next.title} →
                    </a>
                  </Link>
                )}
              </div>
            </>
          )}
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
            {toc.length > 0 && (
              <div className="mb-8">
                <TableOfContents tableOfContents={toc} currentSection={currentSection} />
              </div>
            )}
            <Ad />
          </div>
        </div>
      </div>
    </div>
  )
}
