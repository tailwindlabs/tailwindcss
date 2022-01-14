export default function ReponsiveDesignDemo() {
  return (
    <div className="flex items-center justify-center p-8 w-screen h-screen">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden sm:max-w-2xl ring-1 ring-slate-900/5">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:shrink-0">
            <img
              className="w-full sm:w-[193px] h-[200px] object-cover object-bottom sm:object-center"
              src="https://images.unsplash.com/photo-1637734433731-621aca1c8cb6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=404&q=80"
              width="202"
              height="192"
              alt="Beautiful abstract building in the sun"
            />
          </div>
          <div className="p-6 2xl:p-8 space-y-2">
            <div className="font-medium text-sm leading-6 text-indigo-600">Company retreats</div>
            <a
              href="#"
              className="block font-semibold text-base text-slate-900 leading-6 hover:underline"
            >
              Incredible accomodation for your team
            </a>
            <p className="text-sm text-slate-600 leading-6">
              Looking to take your team away on a retreat to enjoy awesome food and take in some
              sunshine? We have a list of places to do just that.{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
