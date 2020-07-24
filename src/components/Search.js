import { useIsHome } from '@/hooks/useIsHome'
import { useEffect, useRef } from 'react'

export function Search() {
  const isHome = useIsHome()
  const input = useRef()

  useEffect(() => {
    function handleKeyDown(e) {
      if (
        e.key !== '/' ||
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'SELECT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return
      }
      e.preventDefault()
      input.current.focus()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="relative">
      <span
        className="algolia-autocomplete"
        style={{
          position: 'relative',
          display: 'inline-block',
          direction: 'ltr',
        }}
      >
        <input
          ref={input}
          id="docsearch"
          className={`transition-colors duration-100 ease-in-out placeholder-gray-600 py-2 pr-4 pl-10 block w-full appearance-none leading-normal ds-input border border-transparent rounded-lg focus:outline-0 ${
            isHome ? 'bg-white shadow-md' : 'focus:bg-white focus:border-gray-300 bg-gray-200'
          }`}
          type="text"
          placeholder='Search the docs (Press "/" to focus)'
          autoComplete="off"
          spellCheck="false"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="false"
          aria-label="search input"
          aria-owns="algolia-autocomplete-listbox-0"
          dir="auto"
          style={{ position: 'relative', verticalAlign: 'top' }}
        />
      </span>
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
