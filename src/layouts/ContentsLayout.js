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
import { usePrevNext } from '@/hooks/usePrevNext'
import Link from 'next/link'
import { SidebarLayout, SidebarContext } from '@/layouts/SidebarLayout'
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
      <h5 className="text-gray-900 uppercase tracking-wide font-semibold mb-3 text-sm lg:text-xs">
        On this page
      </h5>
      <ul className="overflow-x-hidden text-gray-500 font-medium">
        {tableOfContents.map((section) => {
          let sectionIsActive =
            currentSection === section.slug ||
            section.children.findIndex(({ slug }) => slug === currentSection) > -1

          return (
            <Fragment key={section.slug}>
              <li>
                <a
                  href={`#${section.slug}`}
                  onClick={closeNav}
                  className={clsx(
                    'block transform transition-colors duration-200 py-2 hover:text-gray-900',
                    {
                      'text-gray-900': sectionIsActive,
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
                      'ml-4': isMainNav,
                      'ml-2': !isMainNav,
                    })}
                    key={subsection.slug}
                  >
                    <a
                      href={`#${subsection.slug}`}
                      onClick={closeNav}
                      className={clsx(
                        'block py-2 transition-colors duration-200 hover:text-gray-900 font-medium',
                        {
                          'text-gray-900': subsectionIsActive,
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
    ...(classes
      ? [{ title: 'Default class reference', slug: 'class-reference', children: [] }]
      : []),
    ...tableOfContents,
  ]

  const { currentSection, registerHeading, unregisterHeading } = useTableOfContents(toc)
  let { prev, next } = usePrevNext()

  return (
    <div id={meta.containerId} className="w-full flex">
      <div className="min-w-0 flex-auto px-4 sm:px-6 xl:px-8 pt-10 pb-24 lg:pb-16">
        <PageHeader
          title={meta.title}
          description={meta.description}
          badge={{ key: 'Tailwind CSS version', value: meta.featureVersion }}
          border={!classes && meta.headerSeparator !== false}
        />
        <ContentsContext.Provider value={{ registerHeading, unregisterHeading }}>
          <div>
            {classes && (
              <ClassTable {...(isValidElement(classes) ? { custom: classes } : classes)} />
            )}
            {children}
          </div>
        </ContentsContext.Provider>
        {(prev || next) && (
          <>
            <hr className="border-gray-200 mt-10 mb-4" />
            <div className="flex leading-6 font-medium">
              {prev && (
                <Link href={prev.href}>
                  <a className="flex mr-8 transition-colors duration-200 hover:text-gray-900">
                    <span aria-hidden="true" className="mr-2">
                      ←
                    </span>
                    {prev.shortTitle || prev.title}
                  </a>
                </Link>
              )}
              {next && (
                <Link href={next.href}>
                  <a className="flex text-right ml-auto transition-colors duration-200 hover:text-gray-900">
                    {next.shortTitle || next.title}
                    <span aria-hidden="true" className="ml-2">
                      →
                    </span>
                  </a>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
      <div className="hidden xl:text-sm xl:block flex-none w-64 pl-8 mr-8">
        <div className="flex flex-col justify-between overflow-y-auto sticky max-h-(screen-18) pt-10 pb-6 top-18">
          {toc.length > 0 && (
            <div className="mb-8">
              <TableOfContents tableOfContents={toc} currentSection={currentSection} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
