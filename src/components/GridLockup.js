import clsx from 'clsx'

let beamsImages = [
  [require('@/img/beams/0.jpg').default, 'w-[122.375rem] ml-[-61.1875rem]'],
  [require('@/img/beams/1.jpg').default, 'w-[138.125rem] ml-[-69.0625rem]'],
  [require('@/img/beams/2.jpg').default, 'w-[165rem] ml-[-82.5rem]'],
  [require('@/img/beams/3.jpg').default, 'w-[124.125rem] ml-[-62.0625rem]'],
  [require('@/img/beams/4.jpg').default, 'w-[123.25rem] ml-[-61.625rem]'],
  [require('@/img/beams/5.jpg').default, 'w-[123.25rem] ml-[-61.625rem]'],
  [require('@/img/beams/6.jpg').default, 'w-[118.5rem] ml-[-59.25rem]'],
  [require('@/img/beams/7.jpg').default, 'w-[141.25rem] ml-[-70.625rem]'],
  [require('@/img/beams/8.jpg').default, 'w-[150rem] ml-[-75rem]'],
]

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
      {beams !== -1 && (
        <img
          src={beamsImages[beams][0]}
          alt=""
          className={clsx(
            'absolute left-1/2 max-w-none',
            beamsImages[beams][1],
            overhangs[overhang]
          )}
        />
      )}
      <div
        className={clsx('absolute inset-0 bg-grid-gray-900/[0.04] bg-top', overhangs[overhang])}
        style={{
          maskImage: 'linear-gradient(to top, transparent, black)',
          WebkitMaskImage: 'linear-gradient(to top, transparent, black)',
        }}
      />
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
