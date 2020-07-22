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
    <Component id={id} ref={ref}>
      {children}
    </Component>
  )
}
