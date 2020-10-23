import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { gradients } from '@/utils/gradients'
import { CodeWindow } from '@/components/CodeWindow'
import { motion, useTransform, useMotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ReactComponent as Icon } from '@/img/icons/home/mobile-first.svg'
import styles from './MobileFirst.module.css'

const MIN_WIDTH = 400

const classNames = {
  sm: {
    container: 'grid grid-cols-1',
    header: 'relative z-10 col-start-1 row-start-1 px-4 pt-40 pb-2 bg-gradient-to-t from-black',
    preheading: 'text-sm leading-5 font-medium text-white',
    heading: 'text-xl leading-9 font-semibold text-white',
    metaContainer: 'col-start-1 row-start-2 px-4',
    meta: 'flex items-center text-sm leading-5 font-medium my-5',
    hr: 'w-16 border-gray-300 hidden',
    footerContainer: 'col-start-1 row-start-3 space-y-3 px-4',
    imgContainer: 'col-start-1 row-start-1 flex',
    imgLgContainer: 'relative col-span-3 row-span-2',
    imgLg: 'absolute inset-0 w-full h-full object-cover',
    imgSmContainer: 'relative hidden',
  },
  md: {
    container: 'grid grid-cols-2 px-8 py-16 gap-x-8',
    header: 'relative z-10 col-start-1 row-start-1',
    preheading: 'text-sm leading-5 font-medium mb-1 text-gray-500',
    heading: 'text-2xl leading-9 font-semibold text-black',
    metaContainer: 'col-start-1 row-start-2 pb-16',
    meta: 'flex items-center text-sm leading-5 font-medium mt-2 mb-4',
    hr: 'w-16 border-gray-300 block',
    footerContainer: 'col-start-1 row-start-3 space-y-3',
    imgContainer: 'col-start-2 row-start-1 row-span-3 flex',
    imgLgContainer: 'relative col-span-3 row-span-2',
    imgLg: 'absolute inset-0 w-full h-full object-cover rounded-lg',
    imgSmContainer: 'relative hidden',
  },
  lg: {
    container: 'grid grid-cols-2 px-8 py-16 gap-x-8',
    header: 'relative z-10 col-start-1 row-start-1',
    preheading: 'text-sm leading-5 font-medium mb-1 text-gray-500',
    heading: 'text-3xl leading-9 font-semibold text-black',
    metaContainer: 'col-start-1 row-start-2 pb-16',
    meta: 'flex items-center text-sm leading-5 font-medium mt-2 mb-4',
    hr: 'w-16 border-gray-300 block',
    footerContainer: 'col-start-1 row-start-3 space-y-3',
    imgContainer: 'col-start-2 row-start-1 row-span-3 flex',
    imgLgContainer: 'relative col-span-2 row-span-2',
    imgLg: 'absolute inset-0 w-full h-full object-cover rounded-lg',
    imgSmContainer: 'relative block',
  },
}

const images = {
  '/kevin-francis.jpg': require('@/img/kevin-francis.jpg').default,
  '/beach-house.jpg': require('@/img/beach-house.jpg').default,
  '/beach-house-view.jpg': require('@/img/beach-house-view.jpg').default,
  '/beach-house-interior.jpg': require('@/img/beach-house-interior.jpg').default,
}

const html = `
<div class="{container}">
  <div class="{header}">
    <p class="{preheading}">Entire house</p>
    <h2 class="{heading}">Beach House in Collingwood</h2>
  </div>
  <div class="{metaContainer}">
    <div class="{meta}">
      <svg width="20" height="20" fill="currentColor" class="text-violet-600">
        <path d="M9.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.784-.57-.381-1.81.587-1.81H7.03a1 1 0 00.95-.69L9.05 3.69z" />
      </svg>
      <div class="ml-1">
        <span class="text-black">4.94</span> (128)
      </div>
      <div class="text-base leading-6 font-normal mx-2">·</div>
      <div>Collingwood, Ontario, Canada</div>
    </div>
    <hr class="{hr}">
  </div>
  <div class="{footerContainer}">
    <p class="flex items-center text-black text-sm leading-5 font-medium">
      <img src="/kevin-francis.jpg" alt="" class="w-6 h-6 rounded-full mr-2">
      Hosted by Kevin Francis
    </p>
    <button type="button" class="bg-violet-100 text-violet-700 text-base leading-6 font-semibold px-6 py-2 rounded-lg">Check availability</button>
  </div>
  <div class="{imgContainer}">
    <div class="w-full grid grid-cols-3 grid-rows-2 gap-2">
      <div class="{imgLgContainer}">
        <img src="/beach-house.jpg" alt="" class="{imgLg}" />
      </div>
      <div class="{imgSmContainer}">
        <img src="/beach-house-interior.jpg" alt="" class="absolute inset-0 w-full h-full object-cover rounded-lg" />
      </div>
      <div class="{imgSmContainer}">
        <img src="/beach-house-view.jpg" alt="" class="absolute inset-0 w-full h-full object-cover rounded-lg" />
      </div>
    </div>
  </div>
</div>
`

function BrowserWindow({ height = 385 }) {
  const x = useMotionValue(0)
  const constraintsRef = useRef()
  const [size, setSize] = useState('lg')
  const [constraintsWidth, setConstraintsWidth] = useState()

  useEffect(() => {
    if (!constraintsWidth) return

    function updateSize(x) {
      if (constraintsWidth >= 500) {
        if (x < -((constraintsWidth / 3) * 2)) {
          size !== 'sm' && setSize('sm')
        } else if (x < -(constraintsWidth / 3)) {
          size !== 'md' && setSize('md')
        } else if (x >= -(constraintsWidth / 3)) {
          size !== 'lg' && setSize('lg')
        }
      } else {
        if (x < -(constraintsWidth / 2)) {
          size !== 'sm' && setSize('sm')
        } else {
          size !== 'md' && setSize('md')
        }
      }
    }

    updateSize(x.get())

    return x.onChange(updateSize)
  }, [x, size, constraintsWidth])

  return (
    <div className="relative">
      <motion.div
        className="shadow-lg rounded-t-xl border border-black border-opacity-5"
        style={{ marginRight: useTransform(x, (x) => -x) }}
      >
        <div
          className="py-2 grid items-center gap-6 px-4 rounded-t-xl bg-gradient-to-b from-gray-50 to-gray-100"
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
          <div
            className="overflow-auto"
            style={{ height }}
            dangerouslySetInnerHTML={{
              __html: html
                .replace(/\{([^}]+)\}/g, (_, name) => classNames[size][name])
                .replace(/src="([^"]+)"/g, (_, src) => `src="${images[src]}" loading="lazy"`),
            }}
          ></div>
        </div>
      </motion.div>
      <div
        ref={constraintsRef}
        className="absolute bottom-0 pointer-events-none"
        style={{
          top: `${50 / 16}rem`,
          right: '-2.125rem',
          width: `calc(100% - ${MIN_WIDTH}px + 2.125rem + 2.125rem - 2px)`,
        }}
      >
        <motion.div
          drag="x"
          _dragX={x}
          dragMomentum={false}
          dragElastic={0.08}
          dragConstraints={constraintsRef}
          className="absolute z-10 top-1/2 right-0 bg-indigo-900 rounded-full border-4 border-white shadow-lg flex items-center justify-center pointer-events-auto"
          style={{ x, width: '4.25rem', height: '4.25rem', marginTop: '-2.125rem' }}
          onMeasureDragConstraints={({ left, right }) => {
            setConstraintsWidth(right - left)
          }}
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

export function MobileFirst() {
  return (
    <section id="mobile-first">
      <div className="px-4 sm:px-6 md:px-8 mb-20">
        <IconContainer className={`${gradients.violet[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-violet-600 mb-3">
          Mobile-first
        </Caption>
        <BigText className="mb-8">Responsive everything.</BigText>
        <Paragraph as="div" className="mb-6">
          <p>
            Wrestling with a bunch of complex media queries in your CSS sucks, so Tailwind lets you
            build responsive designs right in your HTML instead.
          </p>
          <p>
            Throw a screen size in front of literally any utility class and watch it magically apply
            at a specific breakpoint.
          </p>
        </Paragraph>
        <Link href="#" className="text-violet-600">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="violet"
        rotate={2}
        left={
          <>
            <div className="px-2 lg:px-0 lg:max-w-3xl xl:max-w-5xl mx-auto">
              <BrowserWindow />
            </div>
            <CodeWindow className={`bg-indigo-500 ${styles.code}`}>
              <CodeWindow.Code />
            </CodeWindow>
          </>
        }
      />
    </section>
  )
}
