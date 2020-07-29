import { useEffect, useContext, useRef } from 'react'
import { DocumentContext } from '@/layouts/ContentsLayout'

export function Heading({ level, id, children, number, badge }) {
  let Component = `h${level}`
  const { updateHeading } = useContext(DocumentContext)

  let ref = useRef()

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateHeading(id, ref.current.getBoundingClientRect().top + window.pageYOffset)
    })
    resizeObserver.observe(ref.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [id, updateHeading])

  return (
    <Component className="group flex" id={id} ref={ref}>
      {/* eslint-disable-next-line */}
      <a
        href={`#${id}`}
        className="absolute text-gray-500 no-underline after:hash opacity-0 group-hover:opacity-100"
        style={{ marginLeft: '-1em', paddingRight: '0.5em' }}
        aria-label="Anchor"
      />
      {number && (
        <span className="bg-gray-200 h-6 inline-flex items-center justify-center rounded-full text-gray-700 text-lg w-6 mr-3 flex-none">
          {number}
        </span>
      )}
      {children}
      {badge && (
        <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
          {badge}
        </span>
      )}
    </Component>
  )
}
