import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { motion, useTransform, useMotionValue } from 'framer-motion'

const codeBackground = {
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  fuchsia: 'bg-fuchsia-400',
  indigo: 'bg-indigo-400',
  lightBlue: 'bg-light-blue-500',
  purple: 'bg-purple-400',
  rose: 'bg-rose-400',
}

const previewBackground = {
  amber: 'bg-gradient-to-r from-amber-50 to-amber-100',
  emerald: 'bg-gradient-to-r from-emerald-50 to-teal-100',
  fuchsia: 'bg-gradient-to-r from-fuchsia-50 to-fuchsia-100',
  gray: 'bg-gradient-to-r from-gray-50 to-gray-100',
  indigo: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
  lightBlue: 'bg-gradient-to-r from-light-blue-50 to-light-blue-100',
  purple: 'bg-gradient-to-r from-purple-50 to-purple-100',
  rose: 'bg-gradient-to-r from-rose-50 to-rose-100',
}

const containerBackground = {
  amber: 'bg-stripes bg-stripes-amber-500 bg-amber-100',
  emerald: 'bg-stripes bg-stripes-emerald-500 bg-emerald-100',
  fuchsia: 'bg-stripes bg-stripes-fuchsia-500 bg-fuchsia-100',
  indigo: 'bg-stripes bg-stripes-indigo-500 bg-indigo-100',
  lightBlue: 'bg-stripes bg-stripes-light-blue-500 bg-light-blue-100',
  purple: 'bg-stripes bg-stripes-purple-500 bg-purple-100',
  rose: 'bg-stripes bg-stripes-rose-500 bg-rose-100',
}

const handle = {
  amber: 'text-amber-700',
  emerald: 'text-emerald-700',
  fuchsia: 'text-fuchsia-700',
  indigo: 'text-indigo-700',
  lightBlue: 'text-light-blue-700',
  purple: 'text-purple-700',
  rose: 'text-rose-700',
}

function Frame(props) {
  const ref = useRef()
  const [frameLoaded, setFrameLoaded] = useState(false)
  const [style, setStyle] = useState({})

  useEffect(() => {
    if (!frameLoaded) return
    function updateStyle() {
      setStyle({ height: ref.current.contentDocument.body.scrollHeight })
    }
    const observer = new window.ResizeObserver(updateStyle)
    updateStyle()
    observer.observe(ref.current.contentDocument.body)
    return () => {
      observer.disconnect()
    }
  }, [frameLoaded])

  return <iframe {...props} ref={ref} onLoad={() => setFrameLoaded(true)} style={style} />
}

function Snippet({ color, snippet }) {
  return (
    <div
      className={clsx('overflow-hidden rounded-b-xl', codeBackground[color], {
        'bg-gray-800': !codeBackground[color],
      })}
    >
      <pre
        className={clsx(
          'scrollbar-none overflow-x-auto p-6 text-sm leading-snug language-html text-white',
          {
            'bg-black bg-opacity-75': codeBackground[color],
          }
        )}
      >
        <code className="language-html" dangerouslySetInnerHTML={{ __html: snippet }} />
      </pre>
    </div>
  )
}

export function CodeSample({ preview, src, snippet, previewClassName, color = 'gray' }) {
  return (
    <div className="relative overflow-hidden mb-8">
      {preview ? (
        <div
          className={clsx(
            'rounded-t-xl overflow-hidden',
            previewBackground[color],
            previewClassName,
            {
              'p-10': !previewClassName,
            }
          )}
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      ) : (
        <Frame src={src} className={clsx('w-full rounded-t-xl', previewBackground[color])} />
      )}
      <Snippet color={color} snippet={snippet} />
    </div>
  )
}

export function ResizableCodeSample({
  preview,
  src,
  previewClassName,
  snippet,
  color = 'gray',
  min = false,
}) {
  const previewContainerRef = useRef()
  const x = useMotionValue(0)
  const constraintsRef = useRef()
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const observer = new window.ResizeObserver(() => {
      x.set(0)
    })
    observer.observe(previewContainerRef.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="relative mb-8">
      <div
        ref={previewContainerRef}
        className={`relative rounded-t-xl ${containerBackground[color]}`}
      >
        <div className={min ? 'md:w-88' : undefined}>
          <motion.div className="relative" style={{ marginRight: useTransform(x, (x) => -x) }}>
            {preview ? (
              <div
                className={clsx('rounded-t-xl', previewClassName, previewBackground[color], {
                  'p-10': !previewClassName,
                })}
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            ) : (
              <Frame
                src={src}
                className={clsx('w-full rounded-t-xl', previewBackground[color], {
                  'pointer-events-none': dragging,
                })}
              />
            )}
          </motion.div>
        </div>
        <div
          ref={constraintsRef}
          className="absolute inset-y-0 -right-4 left-80 ml-4 pointer-events-none"
        >
          <motion.div
            drag="x"
            _dragX={x}
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={constraintsRef}
            className={`pointer-events-auto absolute top-1/2 -mt-4 w-8 hidden md:flex items-center justify-center cursor-grab active:cursor-grabbing ${
              min ? 'right-0 md:left-0 md:right-auto' : 'right-0'
            }`}
            style={{ x }}
            onDragStart={() => {
              document.body.classList.add('cursor-grabbing')
              setDragging(true)
            }}
            onDragEnd={() => {
              document.body.classList.remove('cursor-grabbing')
              setDragging(false)
            }}
          >
            <div
              className="flex-none rounded bg-white shadow flex items-center justify-center h-8"
              style={{ width: '0.9375rem' }}
            >
              <svg
                viewBox="0 0 14 24"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                className={`h-3 flex-none ${handle[color]}`}
                style={{ width: '0.4375rem' }}
              >
                <path d="M 1 0 V 24 M 7 0 V 24 M 13 0 V 24" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
      <Snippet color={color} snippet={snippet} />
    </div>
  )
}
