import { useEffect, useState } from 'react'
import { AnimateSharedLayout, motion } from 'framer-motion'

export function HtmlZenGarden() {
  const [theme, setTheme] = useState('simple')

  useEffect(() => {
    function onClick() {
      setTheme((t) => (t === 'simple' ? 'playful' : 'simple'))
    }
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <AnimateSharedLayout>
      <motion.div layout className="relative z-10 rounded-xl shadow-lg -mr-8 flex leading-none">
        <motion.div
          layout
          className={`bg-white rounded-xl overflow-hidden flex w-full ${
            theme === 'playful' ? 'flex-row-reverse p-6' : ''
          }`}
        >
          <motion.img
            layout
            src="https://unsplash.it/300/400?random"
            alt=""
            className="relative z-10 flex-none w-48 object-cover"
            initial={{ borderRadius: 0 }}
            animate={{ borderRadius: theme === 'playful' ? 8 : 0 }}
          />
          <div
            className={`self-start flex-auto flex flex-wrap items-baseline ${
              theme === 'playful' ? 'flex-auto pr-6' : 'p-6'
            }`}
          >
            <div
              className={`relative ${theme === 'simple' ? 'flex-auto' : 'w-full flex-none mb-1.5'}`}
            >
              <motion.h2
                layout
                className={`inline-flex text-black text-xl leading-7 font-semibold ${
                  theme === 'playful' ? 'absolute top-0 left-0' : ''
                }`}
                animate={{ opacity: theme === 'playful' ? 0 : 1 }}
              >
                Classic Utility Jacket
              </motion.h2>
              <motion.h2
                layout
                className={`inline-flex text-black text-base leading-6 font-semibold ${
                  theme === 'playful' ? '' : 'absolute top-0 left-0'
                }`}
                animate={{ opacity: theme === 'playful' ? 1 : 0 }}
              >
                Kids Jumper
              </motion.h2>
            </div>
            <div className={`relative`}>
              <motion.div
                className={`inline-flex text-xl leading-7 font-semibold ${
                  theme === 'playful' ? 'absolute top-0 left-0' : ''
                }`}
                layout
                animate={{ opacity: theme === 'playful' ? 0 : 1 }}
              >
                $110.00
              </motion.div>
              <motion.div
                className={`inline-flex text-4xl font-bold text-purple-600 ${
                  theme === 'playful' ? '' : 'absolute top-0 left-0'
                }`}
                layout
                animate={{ opacity: theme === 'playful' ? 1 : 0 }}
              >
                $39.00
              </motion.div>
            </div>
            <div className={`relative ${theme === 'simple' ? 'flex-none w-full mt-2' : 'ml-3'}`}>
              <motion.div
                layout
                animate={{ opacity: theme === 'simple' ? 1 : 0 }}
                className={`inline-flex text-sm leading-5 font-medium text-gray-500 ${
                  theme === 'simple' ? '' : 'absolute top-0 left-0'
                }`}
              >
                In stock
              </motion.div>
              <motion.div
                layout
                animate={{ opacity: theme === 'playful' ? 1 : 0 }}
                className={`inline-flex text-sm leading-5 font-medium text-gray-400 ${
                  theme === 'playful' ? '' : 'absolute top-0 left-0'
                }`}
              >
                In stock
              </motion.div>
            </div>
            <div
              className="flex-none w-full grid gap-3 text-center mt-10"
              style={{ gridTemplateColumns: '1fr 1fr' }}
            >
              <motion.div
                layout
                className={`text-sm leading-5 font-medium flex items-center justify-center`}
                style={{ height: 38 }}
                initial={{ borderRadius: 6 }}
                animate={{
                  backgroundColor: theme === 'simple' ? '#000' : '#7e22ce',
                  color: '#fff',
                  borderRadius: theme === 'simple' ? 6 : 19,
                }}
              >
                Buy now
              </motion.div>
              <motion.div
                layout
                className={`text-sm leading-5 font-medium flex items-center justify-center border`}
                style={{ height: 38 }}
                initial={{ borderRadius: 6 }}
                animate={{
                  borderColor:
                    theme === 'simple' ? 'rgba(212, 212, 216, 1)' : 'rgba(212,212,216,0)',
                  borderRadius: theme === 'simple' ? 6 : 19,
                  backgroundColor:
                    theme === 'simple' ? 'rgba(250, 245, 255, 0)' : 'rgba(250, 245, 255, 1)',
                  color: theme === 'simple' ? '#000000' : '#7e22ce',
                }}
              >
                Add to bag
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimateSharedLayout>
  )
}
