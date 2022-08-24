import { useState, useEffect, createContext, Fragment, useCallback, useContext } from 'react'
import { ClassTable } from '@/components/ClassTable'
import { useRouter } from 'next/router'
import { usePrevNext } from '@/hooks/usePrevNext'
import Link from 'next/link'
import { SidebarLayout, SidebarContext } from '@/layouts/SidebarLayout'
import { PageHeader } from '@/components/PageHeader'
import clsx from 'clsx'
import { Footer } from '@/components/Footer'
import { Heading } from '@/components/Heading'
import { MDXProvider } from '@mdx-js/react'

export const ContentsContext = createContext()

function TableOfContents({ tableOfContents, currentSection }) {
  let sidebarContext = useContext(SidebarContext)
  let isMainNav = Boolean(sidebarContext)

  function closeNav() {
    if (isMainNav) {
      sidebarContext.setNavIsOpen(false)
    }
  }

  function isActive(section) {
    if (section.slug === currentSection) {
      return true
    }
    if (!section.children) {
      return false
    }
    return section.children.findIndex(isActive) > -1
  }

  let pageHasSubsections = tableOfContents.some((section) => section.children.length > 0)

  return (
    <>
      <div className="px-8">
        <h5 className="text-slate-900 font-semibold mb-4 text-sm leading-6 dark:text-slate-100">
          On this page
        </h5>
        <ul className="text-slate-700 text-sm leading-6">
          {tableOfContents.map((section) => (
            <Fragment key={section.slug}>
              <li>
                <a
                  href={`#${section.slug}`}
                  onClick={closeNav}
                  className={clsx(
                    'block py-1',
                    pageHasSubsections ? 'font-medium' : '',
                    isActive(section)
                      ? 'font-medium text-sky-500 dark:text-sky-400'
                      : 'hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                  )}
                >
                  {section.title}
                </a>
              </li>
              {section.children.map((subsection) => (
                <li className="ml-4" key={subsection.slug}>
                  <a
                    href={`#${subsection.slug}`}
                    onClick={closeNav}
                    className={clsx(
                      'group flex items-start py-1',
                      isActive(subsection)
                        ? 'text-sky-500 dark:text-sky-400'
                        : 'hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                    )}
                  >
                    <svg
                      width="3"
                      height="24"
                      viewBox="0 -9 3 24"
                      className="mr-2 text-slate-400 overflow-visible group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-500"
                    >
                      <path
                        d="M0 0L3 3L0 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    {subsection.title}
                  </a>
                </li>
              ))}
            </Fragment>
          ))}
        </ul>
      </div>
      <div className="mt-8 overflow-hidden">
        <div className="p-8">
          <a
            href="https://www.refactoringui.com/?ref=sidebar"
            className="relative block pt-80 -m-6 p-6 rounded-lg focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-800/25"
          >
            <img
              className="pointer-events-none h-[673px] w-[536px] max-w-none absolute -top-[112px] -right-6"
              src="/img/refactoring-ui-sidebar.png"
              alt="Refactoring UI by Adam Wathan and Steve Schoger"
            />
            <div>
              <p className="text-[0.8125rem] font-semibold leading-5 text-sky-500 dark:text-sky-400">
                From the creators of Tailwind CSS
              </p>
              <p className="mt-1 text-base font-bold tracking-tight leading-[1.375] text-slate-900 dark:text-slate-200">
                Make your ideas look awesome, without relying on a designer.
              </p>
              <figure className="mt-6 pl-4 border-l border-slate-100 dark:border-slate-700">
                <blockquote className="text-sm leading-5 text-slate-600 dark:text-slate-400">
                  “This is the survival kit I wish I had when I started building apps.”
                </blockquote>
                <figcaption className="mt-3 text-xs leading-5 text-slate-500">
                  Derrick Reimer, <span className="">SavvyCal</span>
                </figcaption>
              </figure>
            </div>
          </a>
        </div>
      </div>
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
      let style = window.getComputedStyle(document.documentElement)
      let scrollMt = parseFloat(style.getPropertyValue('--scroll-mt').match(/[\d.]+/)?.[0] ?? 0)
      let fontSize = parseFloat(style.fontSize.match(/[\d.]+/)?.[0] ?? 16)
      scrollMt = scrollMt * fontSize

      let sortedHeadings = headings.concat([]).sort((a, b) => a.top - b.top)
      let top = window.pageYOffset + scrollMt + 1
      let current = sortedHeadings[0].id
      for (let i = 0; i < sortedHeadings.length; i++) {
        if (top >= sortedHeadings[i].top) {
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
    return () => {
      window.removeEventListener('scroll', onScroll, {
        capture: true,
        passive: true,
      })
    }
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

export function ContentsLayout({ children, meta, classes, tableOfContents, section }) {
  const router = useRouter()
  const toc = [
    ...(classes ? [{ title: 'Quick reference', slug: 'class-reference', children: [] }] : []),
    ...tableOfContents,
  ]

  const { currentSection, registerHeading, unregisterHeading } = useTableOfContents(toc)
  let { prev, next } = usePrevNext()

  return (
    <div className="max-w-3xl mx-auto pt-10 xl:max-w-none xl:ml-0 xl:mr-[15.5rem] xl:pr-16">
      <PageHeader
        title={meta.title}
        description={meta.description}
        repo={meta.repo}
        badge={{ key: 'Tailwind CSS version', value: meta.featureVersion }}
        section={section}
      />
      <ContentsContext.Provider value={{ registerHeading, unregisterHeading }}>
        {classes ? (
          <>
            <ClassTable {...classes} />
            <div
              id="content-wrapper"
              className="relative z-20 prose prose-slate mt-12 dark:prose-dark"
            >
              <MDXProvider components={{ Heading }}>{children}</MDXProvider>
            </div>
          </>
        ) : (
          <div
            id="content-wrapper"
            className="relative z-20 prose prose-slate mt-8 dark:prose-dark"
          >
            <MDXProvider components={{ Heading }}>{children}</MDXProvider>
          </div>
        )}
      </ContentsContext.Provider>

      <Footer previous={prev} next={next}>
        <Link
          href={`https://github.com/tailwindlabs/tailwindcss.com/edit/master/src/pages${router.pathname}.mdx`}
        >
          <a className="hover:text-slate-900 dark:hover:text-slate-400">Edit this page on GitHub</a>
        </Link>
      </Footer>

      <div className="fixed z-20 top-[3.8125rem] bottom-0 right-[max(0px,calc(50%-45rem))] w-[19.5rem] py-10 overflow-y-auto hidden xl:block">
        {toc.length > 0 && (
          <TableOfContents tableOfContents={toc} currentSection={currentSection} />
        )}
      </div>
    </div>
  )
}
