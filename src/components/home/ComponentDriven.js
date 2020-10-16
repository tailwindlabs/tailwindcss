import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'

const recipes = [
  {
    title: 'Hank’s Juciest Beef Burger',
    rating: 4.94,
    time: 20,
    difficulty: 'Easy',
    servings: 4,
    author: 'Hank Douglas',
  },
  {
    title: 'Southern Fried Chicken Sandwich',
    rating: 4.94,
    time: 30,
    difficulty: 'Intermediate',
    servings: 4,
    author: 'Nicholas Denver',
  },
  {
    title: 'Lily’s Healthy Beef Burger',
    rating: 4.94,
    time: 20,
    difficulty: 'Easy',
    servings: 6,
    author: 'Lily Ford',
  },
]

export function ComponentDriven() {
  return (
    <section>
      <div className="px-8 mb-20">
        <IconContainer className={`${gradients.amber} mb-8`} />
        <Caption as="h2" className="text-amber-500 mb-3">
          Component-driven
        </Caption>
        <BigText className="mb-8">Worried about duplication? Don’t be.</BigText>
        <Paragraph className="mb-6">
          If you're repeating the same utilities over and over and over again, all you have to do is
          extract them into a component or template partial and boom — you've got a single source of
          truth so you can make changes in one place.
        </Paragraph>
        <Link href="#" className="text-amber-500">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="amber"
        rotate={-2}
        left={
          <div className="relative z-10 bg-white rounded-xl shadow-lg -mr-8 divide-y divide-gray-100">
            <nav className="p-4 text-sm leading-5 font-medium">
              <ul className="flex space-x-2">
                <li>
                  <a href="#" className="block px-4 py-2 rounded-md bg-amber-100 text-amber-700">
                    Featured
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2">
                    Popular
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2">
                    Recent
                  </a>
                </li>
              </ul>
            </nav>
            {recipes.map(({ title, rating, time, difficulty, servings, author }, i) => (
              <article key={i} className="flex p-4 space-x-4">
                <img
                  src={`https://unsplash.it/144/144?random&amp;i=${i}`}
                  alt=""
                  width="144"
                  height="144"
                  className="flex-none w-18 h-18 rounded-lg"
                />
                <div className="relative flex-auto pr-20">
                  <h2 className="text-lg leading-7 font-semibold text-black mb-0.5">{title}</h2>
                  <dl className="flex flex-wrap text-sm leading-5 font-medium whitespace-pre">
                    <div className="absolute top-0 right-0 rounded-full bg-amber-50 text-amber-900 px-2 py-0.5 flex items-center space-x-1">
                      <dt className="text-amber-500">
                        <span className="sr-only">Rating</span>
                        <svg width="16" height="20" fill="currentColor">
                          <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                        </svg>
                      </dt>
                      <dd>{rating}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">Time</dt>
                      <dd>
                        <abbr title={`${time} minutes`}>{time}m</abbr>
                      </dd>
                    </div>
                    <div>
                      <dt className="sr-only">Difficulty</dt>
                      <dd> · {difficulty}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">Servings</dt>
                      <dd> · {servings} servings</dd>
                    </div>
                    <div className="flex-none w-full mt-0.5 font-normal">
                      <dt className="inline">By</dt> <dd className="inline text-black">{author}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        }
        right={<CodeWindow className="bg-orange-500" />}
      />
      <div className="px-8 mt-32 mb-8">
        <Paragraph className="mb-6">
          Not into component frameworks and like to keep it old school? Use Tailwind's @apply
          directive to extract repeated utility patterns into custom CSS classes just by copying and
          pasting the list of class names.
        </Paragraph>
        <Link href="#" className="text-orange-500">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="orange"
        rotate={1}
        left={
          <div className="relative z-10 bg-white rounded-xl shadow-lg mr-4">
            <article className="text-gray-600 leading-6">
              <h2 className="opacity-25 text-2xl leading-8 font-semibold text-black p-6 pb-1">
                Weekly one-on-one
              </h2>
              <dl className="opacity-25 flex flex-wrap divide-y divide-gray-200 border-b border-gray-200">
                <div className="px-6 pb-6">
                  <dt className="sr-only">Date and time</dt>
                  <dd>
                    <time dateTime="2020-11-15T10:00:00-05:00">Thu Nov 15, 2020 10:00am</time> -{' '}
                    <time dateTime="2020-11-15T11:00:00-05:00">11:00am EST</time>
                  </dd>
                </div>
                <div className="w-full flex-none flex items-center px-6 py-4">
                  <dt className="w-1/3 flex-none uppercase text-sm leading-5 font-semibold">
                    Location
                  </dt>
                  <dd className="text-black">
                    Kitchener, <abbr title="Ontario">ON</abbr>
                  </dd>
                </div>
                <div className="w-full flex-none flex items-center px-6 py-4">
                  <dt className="w-1/3 flex-none uppercase text-sm leading-5 font-semibold">
                    Description
                  </dt>
                  <dd className="italic">No meeting description</dd>
                </div>
                <div className="w-full flex-none flex items-center px-6 py-4">
                  <dt className="w-1/3 flex-none uppercase text-sm leading-5 font-semibold">
                    Attendees
                  </dt>
                  <dd className="font-medium text-gray-700 bg-gray-100 rounded-full py-1 pl-2 pr-4 flex items-center">
                    <svg width="20" height="20" fill="currentColor" className="text-gray-500 mr-2">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      />
                    </svg>
                    Andrew Parsons
                  </dd>
                </div>
              </dl>
              <div className="grid grid-cols-2 gap-x-6 px-6 py-4">
                <button
                  type="button"
                  className="text-base leading-6 font-medium rounded-lg bg-gray-100 text-black py-3"
                >
                  Decline
                </button>
                <button
                  type="button"
                  className="text-base leading-6 font-medium rounded-lg bg-rose-500 text-white py-3"
                >
                  Accept
                </button>
              </div>
            </article>
          </div>
        }
        right={<CodeWindow className="bg-pink-600" />}
      />
    </section>
  )
}
