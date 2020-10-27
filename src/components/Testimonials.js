import { useEffect, useState } from 'react'
import { motion, useTransform, animate, useMotionValue } from 'framer-motion'
import { gradients } from '@/utils/gradients'
import { useInView } from 'react-intersection-observer'

const colors = {
  teal: [gradients.teal[0], 'text-teal-100', 'text-green-200'],
  pink: [gradients.pink[0], 'text-rose-100', 'text-rose-200'],
  violet: [gradients.violet[0], 'text-purple-100', 'text-purple-200'],
  amber: [gradients.amber[0], 'text-orange-100', 'text-orange-100'],
}

const rotation = [
  'transform -rotate-2',
  'transform rotate-1',
  '',
  'transform rotate-2',
  'transform -rotate-1',
  'transform rotate-1',
]

const testimonials = [
  {
    content: 'Tailwind is decent.',
    color: 'teal',
    author: {
      name: 'Brad Cornes',
      role: 'Webmaster',
      avatar: 'https://unsplash.it/96/96?random&amp;i=1',
    },
  },
  {
    content: 'Tailwind is decent.',
    color: 'pink',
    author: {
      name: 'Brad Cornes',
      role: 'Webmaster',
      avatar: 'https://unsplash.it/96/96?random&amp;i=2',
    },
  },
  {
    content: 'Tailwind is decent.',
    color: 'violet',
    author: {
      name: 'Brad Cornes',
      role: 'Webmaster',
      avatar: 'https://unsplash.it/96/96?random&amp;i=3',
    },
  },
  {
    content: 'Tailwind is decent.',
    color: 'amber',
    author: {
      name: 'Brad Cornes',
      role: 'Webmaster',
      avatar: 'https://unsplash.it/96/96?random&amp;i=4',
    },
  },
  {
    content: 'Tailwind is decent.',
    color: 'teal',
    author: {
      name: 'Brad Cornes',
      role: 'Webmaster',
      avatar: 'https://unsplash.it/96/96?random&amp;i=5',
    },
  },
  {
    content: 'Tailwind is decent.',
    color: 'teal',
    author: {
      name: 'Brad Cornes',
      role: 'Webmaster',
      avatar: 'https://unsplash.it/96/96?random&amp;i=6',
    },
  },
]

function Testimonial({ testimonial, base, index, total }) {
  const x = useTransform(
    base,
    [0, (100 / total) * (index + 1), (100 / total) * (index + 1), 100],
    ['0%', `${(index + 1) * -100}%`, `${total * 100 - (index + 1) * 100}%`, '0%']
  )

  return (
    <motion.li className="px-3 md:px-4 flex-none" style={{ x }}>
      <blockquote
        className={`shadow-lg rounded-xl flex-none w-80 md:w-xl ${
          rotation[index % rotation.length]
        }`}
      >
        <div className="rounded-t-xl bg-white px-6 py-8 md:p-10 text-lg md:text-xl leading-8 font-semibold text-black">
          <svg
            width="45"
            height="36"
            className={`mb-5 fill-current ${colors[testimonial.color][1]}`}
          >
            <path d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.536L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.536L38.183.001z" />
          </svg>
          {typeof testimonial.content === 'string' ? (
            <p>{testimonial.content}</p>
          ) : (
            testimonial.content
          )}
        </div>
        <footer
          className={`flex items-center space-x-4 p-6 md:px-10 md:py-6 bg-gradient-to-br rounded-b-xl leading-6 font-semibold text-white ${
            colors[testimonial.color][0]
          }`}
        >
          <div className="flex-none w-14 h-14 bg-white rounded-full flex items-center justify-center">
            <img src={testimonial.author.avatar} alt="" className="w-12 h-12 rounded-full" />
          </div>
          <cite className="not-italic flex-auto flex items-center justify-between">
            <span>
              {testimonial.author.name}
              <br />
              <span className={colors[testimonial.color][2]}>{testimonial.author.role}</span>
            </span>
            {testimonial.tweetUrl && (
              <a href={testimonial.tweetUrl}>
                <span className="sr-only">View tweet by {testimonial.author.name}</span>
                <svg width="33" height="32" fill="currentColor">
                  <path
                    d="M32.411 6.584c-1.113.493-2.309.826-3.566.977a6.228 6.228 0 002.73-3.437 12.4 12.4 0 01-3.944 1.506 6.212 6.212 0 00-10.744 4.253c0 .486.056.958.16 1.414a17.638 17.638 0 01-12.802-6.49 6.208 6.208 0 00-.84 3.122 6.212 6.212 0 002.762 5.17 6.197 6.197 0 01-2.813-.777v.08c0 3.01 2.14 5.52 4.983 6.091a6.258 6.258 0 01-2.806.107 6.215 6.215 0 005.803 4.312 12.464 12.464 0 01-7.715 2.66c-.501 0-.996-.03-1.482-.087a17.566 17.566 0 009.52 2.79c11.426 0 17.673-9.463 17.673-17.671 0-.267-.007-.536-.019-.803a12.627 12.627 0 003.098-3.213l.002-.004z"
                    fillOpacity="0.5"
                  />
                </svg>
              </a>
            )}
          </cite>
        </footer>
      </blockquote>
    </motion.li>
  )
}

export function Testimonials() {
  const x = useMotionValue(0)
  const { inView, ref: inViewRef } = useInView({ threshold: 0, rootMargin: '100px' })
  const [duration, setDuration] = useState(40)

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
      onMouseEnter={() => setDuration(100)}
      onMouseLeave={() => setDuration(40)}
    >
      <div
        className="absolute right-0 bottom-1/2 left-0 bg-gradient-to-t from-gray-100 pointer-events-none"
        style={{ height: 607, maxHeight: '50vh' }}
      />
      <div className="flex overflow-hidden -my-8">
        <ul className="flex w-full py-8">
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
