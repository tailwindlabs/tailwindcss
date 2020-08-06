import { useEffect, useContext, useRef } from 'react'
import { DocumentContext } from '@/layouts/ContentsLayout'
import { useTop } from '@/hooks/useTop'

export function Heading({
  level,
  id,
  children,
  number,
  badge,
  className = '',
  hidden = false,
  toc = false,
  ...props
}) {
  let Component = `h${level}`
  const { updateHeading } = useContext(DocumentContext)

  let ref = useRef()
  let top = useTop(ref)

  useEffect(() => {
    if (toc && typeof top !== 'undefined') {
      updateHeading(id, top)
    }
  }, [toc, top, id, updateHeading])

  return (
    <Component
      className={`group flex whitespace-pre-wrap ${hidden ? '-mb-6' : ''} ${className}`}
      id={id}
      ref={ref}
      {...props}
    >
      {!hidden && (
        // eslint-disable-next-line
        <a
          href={`#${id}`}
          className="absolute text-gray-500 no-underline after:hash opacity-0 group-hover:opacity-100"
          style={{ marginLeft: '-1em', paddingRight: '0.5em' }}
          aria-label="Anchor"
        />
      )}
      {number && (
        <span className="bg-gray-200 h-6 inline-flex items-center justify-center rounded-full text-gray-700 text-lg w-6 mr-3 flex-none">
          {number}
        </span>
      )}
      <span className={hidden ? 'sr-only' : undefined}>{children}</span>
      {badge && (
        <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
          {badge}
        </span>
      )}
    </Component>
  )
}
