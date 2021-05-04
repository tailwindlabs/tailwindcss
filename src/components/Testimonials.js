import { useEffect, useState } from 'react'
import { motion, useTransform, animate, useMotionValue } from 'framer-motion'
import { gradients } from '@/utils/gradients'
import { useInView } from 'react-intersection-observer'

const colors = {
  lightblue: [gradients.lightblue[0], 'text-cyan-100', 'bg-cyan-100'],
  purple: [gradients.purple[0], 'text-fuchsia-100', 'bg-fuchsia-100'],
  orange: [gradients.orange[0], 'text-orange-100', 'bg-orange-100'],
  teal: [gradients.teal[0], 'text-green-100', 'bg-green-100'],
  violet: [gradients.violet[0], 'text-purple-100', 'bg-purple-100'],
  amber: [gradients.amber[0], 'text-orange-100', 'bg-orange-100'],
  pink: [gradients.pink[0], 'text-rose-100', 'bg-rose-100'],
  blue: [gradients.blue[0], 'text-light-blue-100', 'bg-light-blue-100'],
}

const rotation = [-2, 1, -1, 2, -1, 1]

const testimonials = [
  {
    content: 'I feel like an idiot for not using Tailwind CSS until now.',
    tweetUrl: 'https://twitter.com/ryanflorence/status/1187951799442886656',
    author: {
      name: 'Ryan Florence',
      role: 'Remix & React Training',
      avatar: require('@/img/avatars/ryan-florence.jpg').default,
    },
  },
  {
    content:
      'If I had to recommend a way of getting into programming today, it would be HTML + CSS with Tailwind CSS.',
    tweetUrl: 'https://twitter.com/rauchg/status/1225611926320738304',
    author: {
      name: 'Guillermo Rauch',
      role: 'Vercel',
      avatar: require('@/img/avatars/guillermo-rauch.jpg').default,
    },
  },
  {
    content: `I have no design skills and with Tailwind I can actually make good looking websites with ease and it's everything I ever wanted in a CSS framework.`,
    author: {
      name: 'Sara Vieira',
      role: 'CodeSandbox',
      avatar: require('@/img/avatars/sara-vieira.jpg').default,
    },
  },
  {
    content: `I started using @tailwindcss. I instantly fell in love with their responsive modifiers, thorough documentation, and how easy it was customizing color palettes.`,
    tweetUrl: 'https://twitter.com/dacey_nolan/status/1303744545587441666',
    author: {
      name: 'Dacey Nolan',
      role: 'Software Engineer',
      avatar: require('@/img/avatars/dacey-nolan.jpg').default,
    },
  },

  {
    content: 'Loved it the very moment I used it.',
    tweetUrl: 'Gilbert Rabut Tsurwa',
    author: {
      name: 'Gilbert Rabut Tsurwa',
      role: 'Web Developer',
      avatar: require('@/img/avatars/gilbert-rabut-tsurwa.jpg').default,
    },
  },

  {
    content:
      'I came into my job wondering why the last dev would ever implement Tailwind into our projects, within days I was a Tailwind convert and use it for all of my personal projects.',
    tweetUrl: 'https://twitter.com/maddiexcampbell/status/1303752658029740032',
    author: {
      name: 'Madeline Campbell',
      role: 'Full-Stack Developer',
      avatar: require('@/img/avatars/madeline-campbell.jpg').default,
    },
  },

  {
    content:
      'There’s one thing that sucks about @tailwindcss - once you’ve used it on a handful of projects it is a real pain in the ass to write normal CSS again.',
    tweetUrl: 'https://twitter.com/iamgraem_e/status/1322861404781748228?s=21',
    author: {
      name: 'Graeme Houston',
      role: 'JavaScript Developer',
      avatar: require('@/img/avatars/graeme-houston.jpg').default,
    },
  },

  {
    content: `Okay, I’m officially *all* in on the @tailwindcss hype train. Never thought building websites could be so ridiculously fast and flexible.`,
    tweetUrl: 'https://twitter.com/lukeredpath/status/1316543571684663298?s=21',
    author: {
      name: 'Aaron Bushnell',
      role: 'Programmer @ TrendyMinds',
      avatar: require('@/img/avatars/aaron-bushnell.jpg').default,
    },
  },
  {
    content:
      'Have been working with CSS for over ten years and Tailwind just makes my life easier. It is still CSS and you use flex, grid, etc. but just quicker to write and maintain.',
    tweetUrl: 'https://twitter.com/debs_obrien/status/1243255468241420288',
    author: {
      name: `Debbie O'Brien`,
      role: 'Head of Learning @ Nuxt.js',
      avatar: require('@/img/avatars/debbie-obrien.jpg').default,
    },
  },
  {
    content: 'Okay, @tailwindcss just clicked for me and now I feel like a #!@%&$% idiot.',
    tweetUrl: 'https://twitter.com/ken_wheeler/status/1225373231139475458',
    author: {
      name: 'Ken Wheeler',
      role: `React Engineer`,
      avatar: require('@/img/avatars/ken-wheeler.jpg').default,
    },
  },
  {
    content: `I've been using @tailwindcss the past few months and it's amazing. I already used some utility classes before, but going utility-first... this is the way.`,
    tweetUrl: 'https://twitter.com/JadLimcaco/status/1327417021915561984',
    author: {
      name: 'Jad Limcaco',
      role: 'Designer',
      avatar: require('@/img/avatars/jad-limcaco.jpg').default,
    },
  },
  {
    content: `After finally getting to use @tailwindcss on a real client project in the last two weeks I never want to write CSS by hand again. I was a skeptic, but the hype is real.`,
    tweetUrl: 'https://twitter.com/lukeredpath/status/1316543571684663298?s=21',
    author: {
      name: 'Luke Redpath',
      role: 'Ruby & iOS Developer',
      avatar: require('@/img/avatars/luke-redpath.jpg').default,
    },
  },
  {
    content:
      "I didn't think I was going to like @tailwindcss... spent a day using it for a POC, love it! I wish this had been around when we started our company design system, seriously considering a complete rebuild",
    tweetUrl: 'https://twitter.com/JonBloomer/status/1300923818622377984',
    author: {
      name: 'Jon Bloomer',
      role: 'Front-End Developer',
      avatar: require('@/img/avatars/jon-bloomer.jpg').default,
    },
  },
  {
    content: '@tailwindcss looked unpleasant at first, but now I’m hooked on it.',
    tweetUrl: 'https://twitter.com/droidgilliland/status/1222733372855848961',
    author: {
      name: 'Andrew Gilliland',
      role: 'Front-End Developer',
      avatar: require('@/img/avatars/andrew-gilliland.jpg').default,
    },
  },
]

function Testimonial({ testimonial, base, index, total }) {
  const x = useTransform(
    base,
    [0, (100 / total) * (index + 1), (100 / total) * (index + 1), 100],
    ['0%', `${(index + 1) * -100}%`, `${total * 100 - (index + 1) * 100}%`, '0%']
  )
  const [straight, setStraight] = useState(false)

  const color = colors[Object.keys(colors)[index % Object.keys(colors).length]]

  return (
    <motion.li
      className="px-3 md:px-4 flex-none"
      onMouseEnter={() => setStraight(true)}
      onMouseLeave={() => setStraight(false)}
      style={{ x }}
    >
      <motion.figure
        className="shadow-lg rounded-xl flex-none w-80 md:w-xl"
        initial={false}
        animate={straight ? { rotate: 0 } : { rotate: rotation[index % rotation.length] }}
      >
        <blockquote className="rounded-t-xl bg-white px-6 py-8 md:p-10 text-lg md:text-xl leading-8 md:leading-8 font-semibold text-gray-900">
          <svg width="45" height="36" className={`mb-5 fill-current ${color[1]}`}>
            <path d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.536L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.536L38.183.001z" />
          </svg>
          {typeof testimonial.content === 'string' ? (
            <p>{testimonial.content}</p>
          ) : (
            testimonial.content
          )}
        </blockquote>
        <figcaption
          className={`flex items-center space-x-4 p-6 md:px-10 md:py-6 bg-gradient-to-br rounded-b-xl leading-6 font-semibold text-white ${color[0]}`}
        >
          <div className="flex-none w-14 h-14 bg-white rounded-full flex items-center justify-center">
            <img
              src={testimonial.author.avatar}
              alt=""
              className={`w-12 h-12 rounded-full ${color[2]}`}
              loading="lazy"
            />
          </div>
          <div className="flex-auto">
            {testimonial.author.name}
            {testimonial.author.role && (
              <>
                <br />
                <span className={color[1]}>{testimonial.author.role}</span>
              </>
            )}
          </div>
          {testimonial.tweetUrl && (
            <cite className="flex">
              <a
                href={testimonial.tweetUrl}
                className="opacity-50 hover:opacity-75 transition-opacity duration-200"
              >
                <span className="sr-only">Original tweet by {testimonial.author.name}</span>
                <svg width="33" height="32" fill="currentColor">
                  <path d="M32.411 6.584c-1.113.493-2.309.826-3.566.977a6.228 6.228 0 002.73-3.437 12.4 12.4 0 01-3.944 1.506 6.212 6.212 0 00-10.744 4.253c0 .486.056.958.16 1.414a17.638 17.638 0 01-12.802-6.49 6.208 6.208 0 00-.84 3.122 6.212 6.212 0 002.762 5.17 6.197 6.197 0 01-2.813-.777v.08c0 3.01 2.14 5.52 4.983 6.091a6.258 6.258 0 01-2.806.107 6.215 6.215 0 005.803 4.312 12.464 12.464 0 01-7.715 2.66c-.501 0-.996-.03-1.482-.087a17.566 17.566 0 009.52 2.79c11.426 0 17.673-9.463 17.673-17.671 0-.267-.007-.536-.019-.803a12.627 12.627 0 003.098-3.213l.002-.004z" />
                </svg>
              </a>
            </cite>
          )}
        </figcaption>
      </motion.figure>
    </motion.li>
  )
}

export function Testimonials() {
  const x = useMotionValue(0)
  const { inView, ref: inViewRef } = useInView({ threshold: 0, rootMargin: '100px' })
  const [duration, setDuration] = useState(150)

  useEffect(() => {
    if (!inView) return

    const controls = animate(x, 100, {
      type: 'tween',
      duration,
      ease: 'linear',
      loop: Infinity,
    })

    return controls.stop
  }, [inView, x, duration])

  return (
    <div
      ref={inViewRef}
      className="relative"
      onMouseEnter={() => setDuration(250)}
      onMouseLeave={() => setDuration(150)}
    >
      <div
        className="absolute right-0 bottom-1/2 left-0 bg-gradient-to-t from-gray-100 pointer-events-none"
        style={{ height: 607, maxHeight: '50vh' }}
      />
      <div className="flex overflow-hidden -my-8">
        <ul className="flex items-center w-full py-8">
          {testimonials.map((testimonial, i) => (
            <Testimonial
              key={i}
              testimonial={testimonial}
              base={x}
              index={i}
              total={testimonials.length}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
