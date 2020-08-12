import { useIsHome } from '@/hooks/useIsHome'
import { useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DocSearchModal, useDocSearchKeyboardEvents } from '@docsearch/react'
import clsx from 'clsx'

function Hit({ hit, children }) {
  return (
    <Link href={hit.url}>
      <a>{children}</a>
    </Link>
  )
}

export function Search() {
  const isHome = useIsHome()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const searchButtonRef = useRef()
  const [initialQuery, setInitialQuery] = useState(null)

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const onInput = useCallback(
    (e) => {
      setIsOpen(true)
      setInitialQuery(e.key)
    },
    [setIsOpen, setInitialQuery]
  )

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  })

  return (
    <div className="relative">
      <Head>
        <link rel="preconnect" href="https://BH4D9OD16A-dsn.algolia.net" crossOrigin="true" />
      </Head>
      <button
        ref={searchButtonRef}
        onClick={onOpen}
        className={clsx(
          'transition-colors duration-100 ease-in-out text-gray-600 py-2 pr-4 pl-10 block w-full appearance-none leading-normal border border-transparent rounded-lg focus:outline-none text-left select-none truncate',
          {
            'bg-white shadow-md': isHome,
            'focus:bg-white focus:border-gray-300 bg-gray-200': !isHome,
          }
        )}
      >
        Search <span className="hidden sm:inline">the docs (Press "/" to focus)</span>
      </button>
      {isOpen &&
        createPortal(
          <DocSearchModal
            initialQuery={initialQuery}
            initialScrollY={window.scrollY}
            searchParameters={{
              facetFilters: 'version:v1',
              distinct: 1,
            }}
            onClose={onClose}
            indexName="tailwindcss"
            apiKey="3df93446658cd9c4e314d4c02a052188"
            appId="BH4D9OD16A"
            navigator={{
              navigate({ suggestionUrl }) {
                router.push(suggestionUrl)
              },
            }}
            hitComponent={Hit}
            transformItems={(items) => {
              return items.map((item) => {
                // We transform the absolute URL into a relative URL to
                // leverage Next's preloading.
                const a = document.createElement('a')
                a.href = item.url

                return {
                  ...item,
                  url: `${a.pathname}${a.hash}`,
                }
              })
            }}
          />,
          document.body
        )}
      <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center">
        <svg
          className="fill-current pointer-events-none text-gray-600 w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
        </svg>
      </div>
    </div>
  )
}
