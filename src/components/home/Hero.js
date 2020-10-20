import { CodeWindow } from '@/components/CodeWindow'
import { GradientLockup } from '@/components/GradientLockup'
import tokenize from '../../macros/tokenize.macro'
import { Token } from '@/components/Code'
import { motion } from 'framer-motion'
import { useState } from 'react'

const { tokens } = tokenize.html('<div class="bg-red-500 rounded-xl ml-16"></div>')

const ranges = [
  { start: 12, end: 22 },
  { start: 22, end: 33 },
  { start: 33, end: 39 },
]

function getRangeIndex(index, ranges) {
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i]
    if (index >= range.start && index < range.end) {
      return [i, index - range.start, index === range.end - 1]
    }
  }
  return [-1]
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
  const [lastCompletedGroup, setLastCompletedGroup] = useState(-1)
  const [currentGroup, setCurrentGroup] = useState(0)

  return (
    <GradientLockup
      color="lightblue"
      rotate={-2}
      left={
        <div
          className="relative z-10 bg-white rounded-xl shadow-lg lg:-mr-8 p-8"
          style={{ height: 304 }}
        >
          <motion.div
            layout
            className="w-20 h-20"
            initial={{ backgroundColor: '#fff', borderRadius: 0 }}
            animate={{
              ...(lastCompletedGroup >= 0 ? { backgroundColor: '#ef4444' } : {}),
              ...(lastCompletedGroup >= 1 ? { borderRadius: 12 } : {}),
            }}
            style={{ marginLeft: lastCompletedGroup >= 2 ? 64 : 0 }}
          />
        </div>
      }
      right={
        <CodeWindow className="bg-lightBlue-500">
          <CodeWindow.Code
            tokens={tokens}
            tokenComponent={HeroToken}
            tokenProps={{
              currentGroup,
              onGroupComplete(groupIndex) {
                setLastCompletedGroup(groupIndex)
                window.setTimeout(() => {
                  setCurrentGroup(groupIndex + 1)
                }, 1000)
              },
            }}
          />
        </CodeWindow>
      }
    />
  )
}

function HeroToken({ currentGroup, onGroupComplete, ...props }) {
  const { token } = props

  if (token[0].startsWith('char:')) {
    const [, groupIndex, indexInGroup] = token[0].split(':').map((x) => parseInt(x, 10))

    return (
      <motion.span
        style={{ display: 'none' }}
        animate={currentGroup >= groupIndex ? { display: 'inline' } : {}}
        transition={{ delay: indexInGroup * 0.1 }}
        onAnimationComplete={
          token[0].endsWith(':last') ? () => onGroupComplete(groupIndex) : undefined
        }
        {...props}
      />
    )
  }

  return <Token {...props} />
}
