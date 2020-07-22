import useMeasure from 'react-use-measure'
import { useEffect, useContext } from 'react'
import { DocumentContext } from '@/layouts/ContentsLayout'

export function Heading({ level, id, children }) {
  let Component = `h${level}`
  let [ref, bounds] = useMeasure()
  const { updateHeading } = useContext(DocumentContext)

  useEffect(() => {
    updateHeading(id, bounds.top + window.pageYOffset)
  }, [id, bounds.top, updateHeading])

  return (
    <Component className="group" id={id} ref={ref}>
      {/* eslint-disable-next-line */}
      <a
        href={`#${id}`}
        className="absolute text-gray-500 no-underline after:hash opacity-0 group-hover:opacity-100"
        style={{ marginLeft: '-1em', paddingRight: '0.5em' }}
        aria-label="Anchor"
      />
      {children}
    </Component>
  )
}
