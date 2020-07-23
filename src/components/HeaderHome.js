import { HeaderInner } from '@/components/HeaderInner'

export function HeaderHome({ navIsOpen, onNavToggle }) {
  return (
    <div id="header">
      <div className="bg-gray-100 pt-24 lg:pt-0">
        <div className="fixed z-100 bg-gray-100 inset-x-0 top-0 border-b-2 border-gray-200 lg:border-b-0 lg:static flex items-center">
          <div className="w-full max-w-screen-xl relative mx-auto px-6">
            <div className="lg:border-b-2 lg:border-gray-200 h-24 flex flex-col justify-center">
              <HeaderInner variant="home" navIsOpen={navIsOpen} onNavToggle={onNavToggle} />
            </div>
          </div>
        </div>
        <div className="w-full max-w-screen-xl relative mx-auto px-6 pt-16 pb-40 md:pb-24">
          <div className="xl:flex -mx-6">
            <div className="px-6 text-left md:text-center xl:text-left max-w-2xl md:max-w-3xl mx-auto">
              <h1 className="text-3xl tracking-tight sm:text-4xl md:text-5xl xl:text-4xl font-medium leading-tight">
                A utility-first CSS framework for{' '}
                <span className="sm:block text-teal-500 font-medium">
                  rapidly building custom designs.
                </span>
              </h1>
              <p className="mt-6 leading-relaxed sm:text-lg md:text-xl xl:text-lg text-gray-600">
                Tailwind CSS is a highly customizable, low-level CSS framework that gives you all of
                the building blocks you need to build bespoke designs without any annoying
                opinionated styles you have to fight to override.
              </p>
              <div className="flex mt-6 justify-start md:justify-center xl:justify-start">
                <a
                  href="/docs/installation"
                  className="rounded-lg px-4 md:px-5 xl:px-4 py-3 md:py-4 xl:py-3 bg-teal-500 hover:bg-teal-600 md:text-lg xl:text-base text-white font-semibold leading-tight shadow-md"
                >
                  Get Started
                </a>
                <a
                  href="#what-is-tailwind"
                  className="ml-4 rounded-lg px-4 md:px-5 xl:px-4 py-3 md:py-4 xl:py-3 bg-white hover:bg-gray-200 md:text-lg xl:text-base text-gray-800 font-semibold leading-tight shadow-md"
                >
                  Why Tailwind?
                </a>
              </div>
            </div>
            <div className="mt-12 xl:mt-0 px-6 flex-shrink-0 hidden md:block">
              <div className="flex flex-col p-2" style={{ width: '40rem' }}>
                <div
                  className="shadow-lg code-white text-sm font-mono subpixel-antialiased bg-gray-800 px-5 pb-6 pt-4 rounded-lg leading-normal overflow-hidden whitespace-pre"
                  style={{ lineHeight: 1.675 }}
                >
                  <div className="flex mb-4">
                    <span className="h-3 w-3 bg-red-500 rounded-full" />
                    <span className="ml-2 h-3 w-3 bg-orange-300 rounded-full" />
                    <span className="ml-2 h-3 w-3 bg-green-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-wave bg-center bg-repeat-x -mb-8 md:hidden"
        style={{
          height: `${190 * 0.75}px`,
          marginTop: `-${190 * 0.75}px`,
          backgroundSize: `${1440 * 0.75}px ${190 * 0.75}px`,
        }}
      />
      <div
        className="bg-wave bg-center bg-repeat-x -mb-8 hidden md:block"
        style={{
          height: '190px',
          marginTop: '-190px',
          backgroundSize: '1440px 190px',
        }}
      />
    </div>
  )
}
