import { CodeWindow } from '@/components/CodeWindow'
import { GradientLockup } from '@/components/GradientLockup'
import tokenize from '../../macros/tokenize.macro'
import { Token } from '@/components/Code'
import { AnimateSharedLayout, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const CHAR_DELAY = 50
const GROUP_DELAY = 1000

const { tokens } = tokenize.html(`<div class="md:flex bg-white rounded-lg p-6">
  <img class="h-16 w-16 md:h-24 md:w-24 rounded-full mx-auto md:mx-0 md:mr-6" src="avatar.jpg">
  <div class="text-center md:text-left">
    <h2 class="text-lg">Erin Lindford</h2>
    <div class="text-purple-500">Product Engineer</div>
    <div class="text-gray-600">erinlindford@example.com</div>
    <div class="text-gray-600">(555) 765-4321</div>
  </div>
</div>`)

const ranges = [
  { start: 39, end: 43 },
  { start: 85, end: 98 },
  { start: 98, end: 106 },
  { start: 190, end: 206 },
  { start: 234, end: 258 },
  [
    { start: 290, end: 312 },
    { start: 352, end: 374 },
  ],
  { start: 148, end: 167 },
  { start: 180, end: 181, immediate: true },
  { start: 12, end: 20 },
  { start: 106, end: 114 },
  { start: 167, end: 180 },
  { start: 114, end: 122 },
  { start: 69, end: 85 },
]

function getRangeIndex(index, ranges) {
  for (let i = 0; i < ranges.length; i++) {
    const rangeArr = Array.isArray(ranges[i]) ? ranges[i] : [ranges[i]]
    for (let j = 0; j < rangeArr.length; j++) {
      if (index >= rangeArr[j].start && index < rangeArr[j].end) {
        return [i, index - rangeArr[j].start, index === rangeArr[j].end - 1]
      }
    }
  }
  return [-1]
}

function Words({ children }) {
  return children.split(' ').map((word, i) => (
    <motion.span key={i} layout className="inline-flex whitespace-pre">
      {word}{' '}
    </motion.span>
  ))
}

function augment(tokens, index = 0) {
  for (let i = 0; i < tokens.length; i++) {
    if (Array.isArray(tokens[i])) {
      const _type = tokens[i][0]
      const children = tokens[i][1]
      if (Array.isArray(children)) {
        index = augment(children, index)
      } else {
        const str = children
        const result = []
        for (let j = 0; j < str.length; j++) {
          const [rangeIndex, indexInRange, isLast] = getRangeIndex(index, ranges)
          if (rangeIndex > -1) {
            result.push([`char:${rangeIndex}:${indexInRange}${isLast ? ':last' : ''}`, str[j]])
          } else {
            if (typeof result[result.length - 1] === 'string') {
              result[result.length - 1] += str[j]
            } else {
              result.push(str[j])
            }
          }
          index++
        }
        if (!(result.length === 1 && typeof result[0] === 'string')) {
          tokens[i].splice(1, 1, result)
        }
      }
    } else {
      const str = tokens[i]
      const result = []
      for (let j = 0; j < str.length; j++) {
        const [rangeIndex, indexInRange, isLast] = getRangeIndex(index, ranges)
        if (rangeIndex > -1) {
          result.push([`char:${rangeIndex}:${indexInRange}${isLast ? ':last' : ''}`, str[j]])
        } else {
          if (typeof result[result.length - 1] === 'string') {
            result[result.length - 1] += str[j]
          } else {
            result.push(str[j])
          }
        }
        index++
      }
      tokens.splice(i, 1, ...result)
      i += result.length - 1
    }
  }
  return index
}

augment(tokens)

export function Hero() {
  const [step, setStep] = useState(-1)
  const [state, setState] = useState({ group: 0, char: 0 })

  return (
    <GradientLockup
      color="lightblue"
      rotate={-2}
      left={
        <AnimateSharedLayout>
          <motion.div
            layout
            className={`relative z-10 bg-white rounded-xl shadow-lg lg:-mr-8 text-black ${
              step >= 8 ? 'text-center' : ''
            } ${step >= 9 ? 'flex items-start' : ''}`}
            initial={false}
            animate={{ ...(step >= 0 ? { padding: 24 } : { padding: 0 }) }}
          >
            <motion.img
              layout
              src="https://unsplash.it/256/256?random"
              alt=""
              width="128"
              height="128"
              initial={false}
              animate={{
                ...(step >= 1 ? { borderRadius: 64 } : { borderRadius: 0 }),
              }}
              className={`mb-6 ${step >= 2 ? 'mx-auto' : ''}`}
            />
            <motion.div layout>
              <motion.div
                layout
                className="mb-4"
                initial={false}
                animate={{
                  ...(step >= 3 ? { fontWeight: 600 } : { fontWeight: 400 }),
                }}
              >
                <Words>
                  “If I had to recommend a way of getting into programming today, it would be HTML +
                  CSS with Tailwind CSS.”
                </Words>
              </motion.div>
              <motion.div
                className={`flex flex-col ${step >= 8 ? 'items-center' : 'items-start'}`}
                initial={false}
                animate={{
                  ...(step >= 4 ? { fontWeight: 500 } : { fontWeight: 400 }),
                }}
              >
                <motion.p
                  layout
                  initial={false}
                  animate={{
                    ...(step >= 5 ? { color: '#0891b2' } : { color: '#000' }),
                  }}
                >
                  Guillermo Rauch
                </motion.p>
                <motion.p
                  layout
                  initial={false}
                  animate={{
                    ...(step >= 6 ? { color: '#71717a' } : { color: '#000' }),
                  }}
                >
                  CEO, Vercel
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimateSharedLayout>
      }
      right={
        <CodeWindow className="bg-lightBlue-500">
          <CodeWindow.Code
            tokens={tokens}
            tokenComponent={HeroToken}
            tokenProps={{
              currentGroup: state.group,
              currentChar: state.char,
              onCharComplete(charIndex) {
                setState((state) => ({ ...state, char: charIndex + 1 }))
              },
              onGroupComplete(groupIndex) {
                setStep(groupIndex)
                if (ranges[groupIndex + 1] && ranges[groupIndex + 1].immediate) {
                  setState({ char: 0, group: groupIndex + 1 })
                }
                window.setTimeout(() => {
                  setState({ char: 0, group: groupIndex + 1 })
                }, GROUP_DELAY)
              },
            }}
          />
        </CodeWindow>
      }
    />
  )
}

function AnimatedToken({ current, onComplete, children }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) {
      onComplete()
    }
  }, [visible])

  useEffect(() => {
    if (current) {
      window.setTimeout(() => {
        setVisible(true)
      }, CHAR_DELAY)
    }
  }, [current])

  return (
    <>
      <span style={{ display: visible ? 'inline' : 'none' }}>{children}</span>
      {current && <span className="border -mx-px" style={{ height: '1.125rem' }} />}
    </>
  )
}

function HeroToken({ currentChar, onCharComplete, currentGroup, onGroupComplete, ...props }) {
  const { token } = props

  if (token[0].startsWith('char:')) {
    const [, groupIndex, indexInGroup] = token[0].split(':').map((x) => parseInt(x, 10))

    return (
      <AnimatedToken
        current={currentGroup === groupIndex && currentChar === indexInGroup}
        onComplete={() => {
          if (token[0].endsWith(':last')) {
            onGroupComplete(groupIndex)
          } else {
            onCharComplete(indexInGroup)
          }
        }}
        {...props}
      />
    )
  }

  return <Token {...props} />
}
