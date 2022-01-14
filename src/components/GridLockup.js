import clsx from 'clsx'
import styles from './GridLockup.module.css'

let overhangs = { sm: 'top-0 xl:top-8', md: 'top-0 xl:top-14', lg: 'top-0 xl:top-18' }

export function GridLockup({
  left,
  right,
  className,
  leftProps = {},
  rightProps = {},
  overhang = 'sm',
  beams = 0,
}) {
  return (
    <GridLockup.Container className={className} overhang={overhang} beams={beams}>
      <GridLockup.Grid left={left} right={right} leftProps={leftProps} rightProps={rightProps} />
    </GridLockup.Container>
  )
}

GridLockup.Container = function Grid({ beams = 0, className, overhang = 'sm', children }) {
  return (
    <div className={clsx('relative pt-10 xl:pt-0', className)}>
      <div
        className={clsx(
          'hidden dark:block absolute top-0 inset-x-0 h-[37.5rem] bg-gradient-to-b from-[#0c1120]',
          overhangs[overhang]
        )}
      />
      {beams !== -1 && (
        <div
          className={clsx(
            'absolute top-0 inset-x-0 bg-top bg-no-repeat',
            styles[`beams-${beams}`],
            overhangs[overhang]
          )}
        />
      )}
      <div
        className={clsx(
          'absolute top-0 inset-x-0 h-[37.5rem] bg-grid-slate-900/[0.04] bg-top [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-100/[0.03] dark:bg-[center_top_-1px] dark:border-t dark:border-slate-100/5',
          overhangs[overhang]
        )}
      />
      {/* <div
        className={clsx(
          'absolute top-0 inset-x-0 min-h-[37.5rem]  bg-top bg-no-repeat dark:border-t dark:border-slate-100/5',
          styles.beams,
          overhangs[overhang]
        )}
      >
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-top [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-100/[0.03] dark:bg-[center_top_-1px]" />
      </div> */}
      {children}
    </div>
  )
}

GridLockup.Grid = function Inner({ left, right, leftProps = {}, rightProps = {} }) {
  return right ? (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
      <div
        {...leftProps}
        className={clsx('lg:col-span-5 xl:col-span-6 flex flex-col', leftProps.className)}
      >
        {left}
      </div>
      <div
        {...rightProps}
        className={clsx(
          'mt-4 -mx-4 sm:mx-0 lg:mt-0 lg:col-span-7 xl:col-span-6',
          rightProps.className
        )}
      >
        {right}
      </div>
    </div>
  ) : (
    <div {...leftProps} className={clsx('max-w-7xl mx-auto sm:px-6 md:px-8', leftProps.className)}>
      {left}
    </div>
  )
}
