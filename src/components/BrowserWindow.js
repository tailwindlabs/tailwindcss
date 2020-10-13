import { motion, useTransform, useMotionValue } from 'framer-motion'
import { useRef } from 'react'

export function BrowserWindow({ height = 385 }) {
  const x = useMotionValue(0)
  const constraintsRef = useRef()

  return (
    <div className="relative">
      <motion.div
        className="shadow-lg rounded-t-xl border border-black border-opacity-5"
        style={{ marginRight: useTransform(x, (x) => -x) }}
      >
        <div
          className="py-2 grid items-center px-4 rounded-t-xl bg-gradient-to-b from-gray-50 to-gray-100"
          style={{ gridTemplateColumns: '1fr minmax(min-content, 640px) 1fr' }}
        >
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
          </div>
          <div className="border border-black border-opacity-5 rounded-md overflow-hidden shadow-sm">
            <div className="bg-gradient-to-b from-white to-gray-50 text-sm leading-5 py-1.5 text-center">
              workcation.com
            </div>
          </div>
        </div>
        <div className="relative bg-white border-t border-gray-200">
          <div className="overflow-auto" style={{ height }} />
        </div>
      </motion.div>
      <div
        ref={constraintsRef}
        className="absolute bottom-0 left-1/2"
        style={{ top: `${50 / 16}rem`, right: '-2.125rem' }}
      >
        <motion.div
          drag="x"
          _dragX={x}
          dragMomentum={false}
          dragElastic={0.08}
          dragConstraints={constraintsRef}
          className="absolute top-1/2 right-0 bg-indigo-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
          style={{ x, width: '4.25rem', height: '4.25rem', marginTop: '-2.125rem' }}
        >
          <svg width="40" height="40" fill="none">
            <path
              d="M26.665 13.333L33.332 20l-6.667 6.667m-13.333 0L6.665 20l6.667-6.667"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
