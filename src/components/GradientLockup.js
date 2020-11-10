import { gradients } from '@/utils/gradients'
import { motion } from 'framer-motion'
import styles from './GradientLockup.module.css'

const rotation = {
  '-1': '-rotate-1',
  '-2': '-rotate-1 sm:-rotate-2',
  1: 'rotate-1',
  2: 'rotate-1 sm:rotate-2',
}

export function GradientLockup({
  header,
  left,
  right,
  color,
  rotate,
  pin = 'left',
  gradientProps = {},
}) {
  return (
    <div className={`grid ${styles.root}`}>
      <div
        className={`col-start-2 col-end-3 lg:col-start-1 lg:col-end-5 ${
          left && right ? 'row-start-2 row-end-4' : 'row-start-2 row-end-5'
        } lg:row-end-5 lg:py-10 xl:py-16 flex ${
          pin === 'left' ? '-ml-8 pr-4 sm:ml-0 sm:pr-0' : '-mr-8 pl-4 sm:mr-0 sm:pl-0'
        }`}
      >
        <div className="bg-gray-100 w-full flex-none rounded-3xl" />
        <motion.div
          className={`w-full flex-none -ml-full rounded-3xl transform shadow-lg bg-gradient-to-br ${gradients[color][0]} ${rotation[rotate]}`}
          {...gradientProps}
        />
      </div>
      {header && (
        <div className="relative col-start-1 col-end-4 px-4 sm:px-6 md:px-8 lg:px-0 lg:col-start-2 lg:col-end-4 xl:col-end-3 row-start-1 row-end-2 xl:row-end-3 pb-8 lg:pb-11 xl:pb-0">
          {header}
        </div>
      )}
      {left && right ? (
        <>
          <div
            className={`relative col-start-2 col-end-3 lg:col-end-3 row-start-2 row-end-3 lg:row-start-3 lg:row-end-4 self-center ${
              pin === 'left' ? 'pr-8' : 'pl-8'
            } sm:px-6 md:px-8 pt-6 md:pt-8 lg:px-0 lg:pt-0`}
          >
            {left}
          </div>
          <div className="relative w-full lg:w-auto col-start-1 col-end-4 md:px-8 lg:px-0 lg:col-start-3 lg:col-end-4 row-start-3 row-end-4 lg:row-start-2 lg:row-end-5 self-center pb-8 lg:pb-0">
            {right}
          </div>
        </>
      ) : (
        <div className="relative w-full col-start-1 lg:col-start-2 col-end-4 row-start-2 row-end-5 py-8 md:px-8 lg:p-0">
          {left || right}
        </div>
      )}
    </div>
  )
}
