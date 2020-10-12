import { gradients } from '@/utils/gradients'

const rotation = {
  '-1': '-rotate-1',
  '-2': '-rotate-2',
  1: 'rotate-1',
  2: 'rotate-2',
}

export function GradientLockup({ header, left, right, color, rotate, fullWidth }) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `${fullWidth ? '0' : '2rem'} 1fr 52.5% ${fullWidth ? '0' : '2rem'}`,
        gridTemplateRows: 'auto 2.25rem auto 2.25rem',
      }}
    >
      <div className="col-start-1 col-end-5 row-start-2 row-end-5 py-16 flex">
        <div className="bg-gray-100 w-full flex-none rounded-2xl" />
        <div
          className={`w-full flex-none -ml-full rounded-2xl transform shadow-lg bg-gradient-to-br ${gradients[color]} ${rotation[rotate]}`}
        />
      </div>
      {header && (
        <div className="relative col-start-2 col-end-3 row-start-1 row-end-3">{header}</div>
      )}
      {left && right ? (
        <>
          <div className="relative col-start-2 col-end-3 row-start-3 row-end-4 self-center">
            {left}
          </div>
          <div className="relative col-start-3 col-end-4 row-start-2 row-end-5 self-center">
            {right}
          </div>
        </>
      ) : (
        <div className="relative col-start-2 col-end-4 row-start-2 row-end-5">{left || right}</div>
      )}
    </div>
  )
}
