import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { gradients } from '@/utils/gradients'
import { ReactComponent as ScreencastsImage } from '@/img/screencasts.svg'

export default function DocsLandingPage() {
  return (
    <div className="px-4 sm:px-6 md:px-8 pt-10">
      <h1 className="text-5xl leading-none font-extrabold text-gray-900 mb-4">
        Getting started with Tailwind CSS
      </h1>
      <p className="text-2xl">Learn Tailwind the way that best matches your learning style.</p>
      <div className="flex space-x-8">
        <div className={`flex-none w-1/3`}>
          <div className="relative" style={{ paddingTop: `${(238 / 341) * 100}%` }}>
            <ScreencastsImage className="absolute inset-0 w-full h-full" />
          </div>
        </div>
        <div
          className={`flex-none w-1/3 text-white overflow-hidden rounded-3xl bg-gradient-to-br ${gradients.violet[0]}`}
        >
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-2 text-shadow">Read the guides</h2>
            <p className="font-medium text-violet-100 text-shadow">
              Learn how to get Tailwind set up with your favorite tools.
            </p>
          </div>
          <div className="pl-8">
            <div className="relative" style={{ paddingTop: `${(180 / 309) * 100}%` }}>
              <svg
                width="309"
                height="180"
                viewBox="0 0 309 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full overflow-visible"
              >
                <g opacity="0.8">
                  <g filter="url(#filter0_dd)">
                    <rect width="352" height="232" rx="12" fill="white" />
                  </g>
                  <rect x="107" y="27" width="208" height="1" fill="#DDD6FE" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M46 8C43.6 8 42.1 9.21224 41.5 11.6367C42.4 10.4245 43.45 9.9699 44.65 10.273C45.3347 10.4459 45.824 10.9476 46.3657 11.5031C47.2481 12.4079 48.2694 13.4551 50.5 13.4551C52.9 13.4551 54.4 12.2429 55 9.81837C54.1 11.0306 53.05 11.4852 51.85 11.1821C51.1653 11.0092 50.676 10.5075 50.1343 9.95202C49.2519 9.04721 48.2306 8 46 8ZM41.5 13.4557C39.1 13.4557 37.6 14.6679 37 17.0924C37.9 15.8802 38.95 15.4256 40.15 15.7287C40.8347 15.9016 41.324 16.4033 41.8657 16.9588C42.7481 17.8636 43.7694 18.9108 46 18.9108C48.4 18.9108 49.9 17.6986 50.5 15.2741C49.6 16.4863 48.55 16.9409 47.35 16.6378C46.6653 16.4649 46.176 15.9632 45.6343 15.4077C44.7519 14.5029 43.7306 13.4557 41.5 13.4557Z"
                    fill="#A78BFA"
                  />
                  <rect x="48" y="43" width="25" height="4" rx="2" fill="#C4B5FD" />
                  <rect x="255" y="43" width="25" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="255" y="51" width="32" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="255" y="59" width="24" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="255" y="67" width="35" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="255" y="75" width="22" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="107" y="42" width="57" height="8" rx="4" fill="#A78BFA" />
                  <rect x="107" y="54" width="121" height="4" rx="2" fill="#C4B5FD" />
                  <rect x="121" y="11" width="49" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="292" y="11" width="11" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="107" y="70" width="129" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="107" y="177" width="129" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="107" y="129" width="137" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="107" y="137" width="137" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="107" y="78" width="129" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="107" y="86" width="121" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="107" y="94" width="121" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="107" y="102" width="129" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="107" y="118" width="57" height="6" rx="3" fill="#A78BFA" />
                  <rect x="48" y="53" width="21" height="4" rx="2" fill="#C4B5FD" />
                  <rect x="48" y="63" width="18" height="4" rx="2" fill="#C4B5FD" />
                  <rect x="48" y="73" width="13" height="4" rx="2" fill="#C4B5FD" />
                  <rect x="48" y="83" width="19" height="4" rx="2" fill="#C4B5FD" />
                  <rect x="48" y="93" width="23" height="4" rx="2" fill="#C4B5FD" />
                  <rect x="37" y="112" width="23" height="3" rx="1.5" fill="#A78BFA" />
                  <rect x="37" y="120" width="18" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="37" y="128" width="18" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="37" y="136" width="21" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="37" y="144" width="21" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="37" y="152" width="30" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="37" y="160" width="30" height="4" rx="2" fill="#DDD6FE" />
                  <rect x="37" y="168" width="24" height="4" rx="2" fill="#DDD6FE" />
                  <circle cx="40" cy="45" r="3" fill="#A78BFA" />
                  <circle cx="40" cy="55" r="3" fill="#A78BFA" />
                  <circle cx="40" cy="65" r="3" fill="#A78BFA" />
                  <circle cx="40" cy="75" r="3" fill="#A78BFA" />
                  <circle cx="40" cy="85" r="3" fill="#A78BFA" />
                  <circle cx="40" cy="95" r="3" fill="#A78BFA" />
                  <path
                    d="M115 17.5L112.621 15.1213M112.621 15.1213C113.164 14.5784 113.5 13.8284 113.5 13C113.5 11.3431 112.157 10 110.5 10C108.843 10 107.5 11.3431 107.5 13C107.5 14.6569 108.843 16 110.5 16C111.328 16 112.078 15.6642 112.621 15.1213Z"
                    stroke="#C4B5FD"
                  />
                  <rect x="107" y="147" width="132" height="23" rx="4" fill="#A78BFA" />
                </g>
                <defs>
                  <filter
                    id="filter0_dd"
                    x="-15"
                    y="-7"
                    width="382"
                    height="262"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    />
                    <feOffset dy="3" />
                    <feGaussianBlur stdDeviation="3" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                    />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    />
                    <feOffset dy="8" />
                    <feGaussianBlur stdDeviation="7.5" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                    />
                    <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect2_dropShadow"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        <div className={`flex-none w-1/3 text-white p-8 bg-gradient-to-br ${gradients.violet[0]}`}>
          <h2 className="text-xl font-semibold">Read the guides</h2>
          <p></p>
        </div>
        <div className={`flex-none w-1/3 text-white p-8 bg-gradient-to-br ${gradients.violet[0]}`}>
          <h2 className="text-xl font-semibold">Read the guides</h2>
          <p></p>
        </div>
      </div>
    </div>
  )
}

DocsLandingPage.layoutProps = {
  meta: {},
  Layout: DocumentationLayout,
}
