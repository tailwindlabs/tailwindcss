import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/performance.svg'

export function Performance() {
  return (
    <section>
      <div className="px-8 mb-20">
        <IconContainer className={`${gradients.teal} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-teal-500 mb-3">
          Performance
        </Caption>
        <BigText className="mb-8">It’s tiny in production.</BigText>
        <Paragraph className="mb-6">
          Tailwind automatically removes all unused CSS when building for production, which means
          your final CSS bundle is the smallest it could possibly be. In fact, most Tailwind
          projects ship less than 10KB of CSS to the client.
        </Paragraph>
        <Link href="#" className="text-teal-500">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="teal"
        rotate={1}
        left={
          <div className="relative z-10 rounded-xl shadow-lg -mr-8 tabular-nums">
            <div className="bg-white rounded-t-xl">
              <div className="absolute top-6 left-6 w-15 h-15 bg-green-500 rounded-full flex items-center justify-center">
                <svg width="32" height="32" fill="none">
                  <path
                    d="M6.668 17.333l5.333 5.334L25.335 9.333"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <dl className="p-6 pb-0">
                <div className="flex-none w-full pl-15">
                  <dt className="ml-4 text-sm leading-5 font-medium">Production build</dt>
                  <dd className="ml-4 text-4xl leading-10 font-extrabold text-black">8.7KB</dd>
                </div>
                <div className="flex items-center border-t border-gray-100 -mx-6 mt-6 px-6 py-3 font-mono text-xs leading-5">
                  <dt className="whitespace-pre">Purged </dt>
                  <dd className="flex-auto">20,144 unused classes</dd>
                  <dd className="text-rose-700 flex items-center">
                    -160,215 lines
                    <svg viewBox="0 0 82 12" width="82" height="12" className="flex-none ml-2">
                      <rect width="12" height="12" fill="#f43f5e" />
                      <rect width="12" height="12" x="14" fill="#f43f5e" />
                      <rect width="12" height="12" x="28" fill="#f43f5e" />
                      <rect width="12" height="12" x="42" fill="#f43f5e" />
                      <rect width="12" height="12" x="56" fill="#e4e4e7" />
                      <rect width="12" height="12" x="70" fill="#e4e4e7" />
                    </svg>
                  </dd>
                </div>
              </dl>
            </div>
            <div
              className="relative bg-teal-700 rounded-b-xl overflow-hidden"
              style={{ height: 250 }}
            >
              <div className="bg-black bg-opacity-75 absolute inset-0" />
            </div>
          </div>
        }
        right={<CodeWindow className="bg-turquoise-500" />}
      />
    </section>
  )
}
