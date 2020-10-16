import { useEffect } from 'react'
import { motion, useTransform, animate, useMotionValue } from 'framer-motion'
import { gradients } from '@/utils/gradients'

const colors = {
  teal: [gradients.teal, 'text-teal-100', 'text-green-200'],
  pink: [gradients.pink, 'text-rose-100', 'text-rose-200'],
  violet: [gradients.violet, 'text-purple-100', 'text-purple-200'],
  amber: [gradients.amber, 'text-orange-100', 'text-orange-100'],
}

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

function Testimonial({ testimonial, color, base, index, total }) {
  const x = useTransform(
    base,
    [0, (100 / total) * (index + 1), (100 / total) * (index + 1), 100],
    ['0%', `${(index + 1) * -100}%`, `${total * 100 - (index + 1) * 100}%`, '0%']
  )

  return (
    <motion.li className="px-4 flex-none" style={{ x }}>
      <blockquote className="shadow-lg rounded-xl flex-none" style={{ width: '36rem' }}>
        <div className="rounded-t-xl bg-white p-10 text-xl leading-8 font-semibold text-black">
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
          className={`flex items-center space-x-4 px-10 py-6 bg-gradient-to-br rounded-b-xl leading-6 font-semibold text-white ${
            colors[testimonial.color][0]
          }`}
        >
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
            <img src={testimonial.author.avatar} alt="" className="w-12 h-12 rounded-full" />
          </div>
          <cite className="not-italic">
            {testimonial.author.name}
            <br />
            <span className={colors[testimonial.color][2]}>{testimonial.author.role}</span>
          </cite>
        </footer>
      </blockquote>
    </motion.li>
  )
}

export function Testimonials() {
  const x = useMotionValue(0)

  useEffect(() => {
    const controls = animate(x, 100, {
      type: 'tween',
      duration: 40,
      ease: 'linear',
      loop: Infinity,
    })

    return controls.stop
  })

  return (
    <div className="relative">
      <div
        className="absolute right-0 bottom-1/2 left-0 bg-gradient-to-t from-gray-100"
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
