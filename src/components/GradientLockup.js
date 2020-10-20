import { gradients } from '@/utils/gradients'

const rotation = {
  '-1': '-rotate-1',
  '-2': '-rotate-2',
  1: 'rotate-1',
  2: 'rotate-2',
}

export function GradientLockup({ header, left, right, color, rotate }) {
  return (
    <div className="grid gradient-lockup">
      <div
        className={`col-start-2 col-end-3 lg:col-start-1 lg:col-end-5 ${
          left && right ? 'row-start-2 row-end-4' : 'row-start-2 row-end-5'
        } lg:row-end-5 lg:py-10 xl:py-16 flex`}
      >
        <div className="bg-gray-100 w-full flex-none rounded-2xl" />
        <div
          className={`w-full flex-none -ml-full rounded-2xl transform shadow-lg bg-gradient-to-br ${gradients[color]} ${rotation[rotate]}`}
        />
      </div>
      {header && (
        <div className="relative col-start-1 col-end-4 px-8 lg:px-0 lg:col-start-2 lg:col-end-4 xl:col-end-3 row-start-1 row-end-2 xl:row-end-3 pb-10 xl:pb-0">
          {header}
        </div>
      )}
      {left && right ? (
        <>
          <div className="relative col-start-2 col-end-3 lg:col-end-3 row-start-2 row-end-3 lg:row-start-3 lg:row-end-4 self-center px-8 pt-8 lg:px-0 lg:pt-0">
            {left}
          </div>
          <div className="relative col-start-1 col-end-4 md:px-8 lg:px-0 lg:col-start-3 lg:col-end-4 row-start-3 row-end-4 lg:row-start-2 lg:row-end-5 self-center pb-8 lg:pb-0">
            {right}
          </div>
        </>
      ) : (
        <div className="relative col-start-1 lg:col-start-2 col-end-4 row-start-2 row-end-5 py-8 md:px-8 lg:p-0">
          {left || right}
        </div>
      )}
    </div>
  )
}
