import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import styles from './EditorTools.module.css'
import { tokenizeWithLines } from '../../macros/tokenize.macro'
import { motion } from 'framer-motion'
import { Fragment, useEffect, useState } from 'react'
import { ReactComponent as Icon } from '@/img/icons/home/editor-tools.svg'
import { useInView } from 'react-intersection-observer'
import colors from 'tailwindcss/colors'
import dlv from 'dlv'

const problems = [
  ["'flex' applies the same CSS property as 'block'.", 'cssConflict [1, 20]'],
  ["'block' applies the same CSS property as 'flex'.", 'cssConflict [1, 54]'],
]

const completions = [
  //
  ['sm:', '@media (min-width: 640px)'],
  ['md:'],
  ['lg:'],
  ['xl:'],
  ['focus:'],
  ['group-hover:'],
  ['hover:'],
  ['container'],
  ['space-y-0'],
  ['space-x-0'],
  ['space-y-1'],
  ['space-x-1'],
  //
  ['bg-fixed', 'background-position: fixed;'],
  ['bg-local'],
  ['bg-scroll'],
  ['bg-clip-border'],
  ['bg-clip-padding'],
  ['bg-clip-content'],
  ['bg-clip-text'],
  ['bg-transparent', 'background-color: transparent;'],
  ['bg-current'],
  ['bg-black', '#000'],
  ['bg-white', '#fff'],
  ['bg-gray-50', colors.gray[50]],
  //
  ['bg-teal-50', `background-color: ${colors.teal[50]};`, colors.teal[50]],
  ['bg-teal-100', `background-color: ${colors.teal[100]};`, colors.teal[100]],
  ['bg-teal-200', `background-color: ${colors.teal[200]};`, colors.teal[200]],
  ['bg-teal-300', `background-color: ${colors.teal[300]};`, colors.teal[300]],
  ['bg-teal-400', `background-color: ${colors.teal[400]};`, colors.teal[400]],
  ['bg-teal-500', undefined, colors.teal[500]],
  ['bg-teal-600', undefined, colors.teal[600]],
  ['bg-teal-700', undefined, colors.teal[700]],
  ['bg-teal-800', undefined, colors.teal[800]],
  ['bg-teal-900', undefined, colors.teal[900]],
  ['bg-top'],
]

const { lines } = tokenizeWithLines.html(`<div class="__CONFLICT__">
  <div class="flex-1 truncate">
    <div class="flex items-center space-x-3">
      <h3 class="text-gray-900 text-sm font-medium truncate">Jane Cooper</h3>
      <span class="__COMPLETION__">Admin</span>
    </div>
    <p class="mt-1 text-gray-500 text-sm truncate">Regional Paradigm Technician</p>
  </div>
  <img class="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60" alt="">
</div>
<div class="border-t border-gray-200">
  <div class="-mt-px flex">
    <div class="w-0 flex-1 flex border-r border-gray-200">
      <a href="#" class="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 transition ease-in-out duration-150">
        <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        <span class="ml-3">Email</span>
      </a>
    </div>
  </div>
</div>`)

function CompletionDemo() {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true })

  return (
    <CodeWindow.Code2 ref={ref} lines={lines.length} overflow={false} className="overflow-hidden">
      {lines.map((tokens, lineIndex) => (
        <Fragment key={lineIndex}>
          {tokens.map((token, tokenIndex) => {
            if (token.content === '__CONFLICT__') {
              return (
                <span key={tokenIndex} className={getClassNameForToken(token)}>
                  w-full{' '}
                  <span className="inline-flex bg-squiggle bg-repeat-x bg-left-bottom">flex</span>{' '}
                  items-center justify-between{' '}
                  <span className="inline-flex bg-squiggle bg-repeat-x bg-left-bottom">block</span>{' '}
                  p-6 space-x-6
                </span>
              )
            }

            if (token.content === '__COMPLETION__') {
              return <Completion key={tokenIndex} inView={inView} />
            }

            if (
              token.types[token.types.length - 1] === 'attr-value' &&
              tokens[tokenIndex - 3].content === 'class'
            ) {
              return (
                <span key={tokenIndex} className={getClassNameForToken(token)}>
                  {token.content.split(' ').map((c, i) => {
                    const space = i === 0 ? '' : ' '
                    if (/^(bg|text|border)-/.test(c)) {
                      const color = dlv(colors, c.replace(/^(bg|text|border)-/, '').split('-'))
                      if (color) {
                        return (
                          <Fragment key={i}>
                            {space}
                            <span
                              className="inline-flex w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm shadow-px relative top-px mr-0.5 md:mr-1"
                              style={{ background: color }}
                            />
                            {c}
                          </Fragment>
                        )
                      }
                    }
                    return space + c
                  })}
                </span>
              )
            }

            return (
              <span key={tokenIndex} className={getClassNameForToken(token)}>
                {token.content}
              </span>
            )
          })}
          {'\n'}
        </Fragment>
      ))}
    </CodeWindow.Code2>
  )
}

function Completion({ inView }) {
  const [typed, setTyped] = useState('')
  const [selectedCompletionIndex, setSelectedCompletionIndex] = useState(0)
  const [stage, setStage] = useState(-1)

  useEffect(() => {
    if (inView) {
      setStage(0)
    }
  }, [inView])

  useEffect(() => {
    if (typed === ' bg-t') {
      let i = 0
      let id = window.setInterval(() => {
        if (i === 5) {
          setStage(1)
          setTyped('')
          setSelectedCompletionIndex(0)
          return window.clearInterval(id)
        }
        i++
        setSelectedCompletionIndex(i)
      }, 300)
      return () => window.clearInterval(id)
    }
  }, [typed])

  useEffect(() => {
    let id
    if (stage === 1) {
      id = window.setTimeout(() => {
        setStage(2)
      }, 2000)
    } else if (stage === 2 || stage === 3 || stage === 4 || stage === 5) {
      id = window.setTimeout(() => {
        setStage(stage + 1)
      }, 300)
    } else if (stage === 6) {
      id = window.setTimeout(() => {
        setStage(-1)
        setStage(0)
      }, 2000)
    }
    return () => {
      window.clearTimeout(id)
    }
  }, [stage])

  return (
    <span className="text-code-attr-value">
      text-teal-600
      {stage >= 0 &&
        stage < 2 &&
        ' bg-t'.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ display: 'none' }}
            animate={{ display: 'inline' }}
            transition={{ delay: (i + 1) * 0.3 }}
            onAnimationComplete={() => setTyped(typed + char)}
          >
            {char}
          </motion.span>
        ))}
      {stage === 1 && 'eal-400'}
      {(stage < 2 || stage === 6) && <span className="border -mx-px h-5" />}
      {stage >= 2 && stage <= 5 && (
        <Fragment key={stage}>
          {stage < 5 && ' '}
          {stage >= 4 && <span className="relative border -mx-px h-5" />}
          {stage === 5 && (
            <span className="inline-flex" style={{ background: 'rgba(81, 92, 126, 0.4)' }}>
              &nbsp;
            </span>
          )}
          <span
            className="inline-flex"
            style={{ background: stage >= 4 ? 'rgba(81, 92, 126, 0.4)' : undefined }}
          >
            bg-
          </span>
          {stage === 3 && <span className="relative border -mx-px h-5" />}
          <span
            className="inline-flex"
            style={{ background: stage >= 3 ? 'rgba(81, 92, 126, 0.4)' : undefined }}
          >
            teal-
          </span>
          {stage === 2 && <span className="relative border -mx-px h-5" />}
          <span
            className="inline-flex"
            style={{ background: stage >= 2 ? 'rgba(81, 92, 126, 0.4)' : undefined }}
          >
            400
          </span>
        </Fragment>
      )}
      {typed && (
        <span className="relative z-10">
          <div className="absolute top-full left-full m-0.5 -ml-16 sm:ml-0.5 rounded-md shadow-xl">
            <div className="relative w-96 bg-light-blue-800 border border-black overflow-hidden rounded-md">
              <div className="bg-black bg-opacity-75 absolute inset-0" />
              <ul className="relative leading-5 text-white py-2">
                {completions
                  .filter((completion) => completion[0].startsWith(typed.trim()))
                  .slice(0, 12)
                  .map((completion, i) => (
                    <li
                      key={completion[0]}
                      className={`pl-2.5 pr-3 flex items-center space-x-1.5 ${
                        i === selectedCompletionIndex ? 'bg-white bg-opacity-10' : ''
                      }`}
                    >
                      <span className="w-4 flex-none flex justify-center">
                        {completion[2] ? (
                          <span
                            className="flex-none w-3 h-3 rounded-sm shadow-px"
                            style={{ background: completion[2] }}
                          />
                        ) : (
                          <svg width="16" height="10" fill="none">
                            <rect x=".5" y=".5" width="15" height="9" rx="1.5" stroke="#9FA6B2" />
                            <path fill="#9FA6B2" d="M4 3h8v1H4zM4 6h8v1H4z" />
                          </svg>
                        )}
                      </span>
                      <span className="flex-none">
                        {completion[0].split(new RegExp(`(^${typed.trim()})`)).map((part, j) =>
                          part ? (
                            j % 2 === 0 ? (
                              part
                            ) : (
                              <span key={j} className="text-teal-300">
                                {part}
                              </span>
                            )
                          ) : null
                        )}
                      </span>
                      {i === selectedCompletionIndex && completion[1] ? (
                        <span className="hidden sm:block flex-auto text-right text-gray-500 truncate pl-4">
                          {completion[1]}
                        </span>
                      ) : null}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </span>
      )}
    </span>
  )
}

export function EditorTools() {
  return (
    <section id="editor-tools">
      <div className="px-4 sm:px-6 md:px-8 mb-10 sm:mb-16 md:mb-20">
        <IconContainer className={`${gradients.lightblue[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-light-blue-600 mb-3">
          Editor tools
        </Caption>
        <BigText className="mb-8">World-class IDE integration.</BigText>
        <Paragraph as="div" className="mb-6">
          <p>
            Worried about remembering all of these class names? The Tailwind CSS IntelliSense
            extension for VS Code has you covered.
          </p>
          <p>
            Get intelligent autocomplete suggestions, linting, class definitions and more, all
            within your editor and with no configuration required.
          </p>
        </Paragraph>
        <Link href="/docs/intellisense" className="text-light-blue-600 hover:text-light-blue-800">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="lightblue"
        rotate={2}
        left={
          <CodeWindow className={`bg-light-blue-500 ${styles.code}`} lineNumbersBackground={false}>
            <div className="flex-auto flex min-h-0">
              <div className="flex-none w-14 bg-white bg-opacity-10 flex flex-col items-center justify-between pt-3.5 pb-4">
                <svg width="24" height="216" fill="none">
                  <path
                    d="M3 69l6-6m-2-5a7 7 0 1014 0 7 7 0 00-14 0z"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity=".5"
                  />
                  <path
                    d="M8 7H5a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1v-3m3.707-10.293l-3.414-3.414A1 1 0 0015.586 3H9a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V7.414a1 1 0 00-.293-.707zM7 103a2 2 0 100-4 2 2 0 000 4zm0 0v10m10-6a2 2 0 100-4 2 2 0 000 4zm0 0a3 3 0 01-3 3h-4a3 3 0 00-3 3m0 0a2 2 0 100 4 2 2 0 000-4z"
                    stroke="#fff"
                    strokeWidth="1.5"
                    opacity=".5"
                  />
                  <path
                    d="M11.5 160.031a.75.75 0 00-1-1.118l1 1.118zm-8-1.118a.75.75 0 00-1 1.118l1-1.118zm6.972 6.149a.75.75 0 10.993-1.124l-.993 1.124zm-7.937-1.124a.75.75 0 10.993 1.124l-.993-1.124zm7.022-.368l-.64-.393.64.393zm-5.114 0l.64-.393-.64.393zM3 161.25a.75.75 0 000 1.5v-1.5zm8 1.5a.75.75 0 000-1.5v1.5zM8 147l.372-.651A.75.75 0 007.25 147H8zm14 8l.372.651a.75.75 0 000-1.302L22 155zm-14.75 0a.75.75 0 001.5 0h-1.5zm5.378 4.492a.75.75 0 10.744 1.302l-.744-1.302zM7 157.75A2.25 2.25 0 019.25 160h1.5A3.75 3.75 0 007 156.25v1.5zm0-1.5A3.75 3.75 0 003.25 160h1.5A2.25 2.25 0 017 157.75v-1.5zm2.624 3.298A5.225 5.225 0 017 160.25v1.5a6.73 6.73 0 003.376-.903l-.752-1.299zM9.25 160v.197h1.5V160h-1.5zm0 .197V162h1.5v-1.803h-1.5zM7 160.25a5.225 5.225 0 01-2.624-.702l-.752 1.299A6.73 6.73 0 007 161.75v-1.5zM4.75 162v-1.803h-1.5V162h1.5zm0-1.803V160h-1.5v.197h1.5zm5.75-1.284a5.209 5.209 0 01-.876.635l.752 1.299c.403-.234.78-.507 1.124-.816l-1-1.118zm-6.124.635a5.21 5.21 0 01-.876-.635l-1 1.118c.344.309.721.582 1.124.816l.752-1.299zm4.86 4.701c.451.212.867.487 1.236.813l.993-1.124a6.77 6.77 0 00-1.588-1.046l-.64 1.357zM9.25 162c0 .433-.122.835-.332 1.177l1.277.787A3.737 3.737 0 0010.75 162h-1.5zm-.332 1.177A2.247 2.247 0 017 164.25v1.5a3.748 3.748 0 003.195-1.786l-1.277-.787zm-5.39 1.885a5.25 5.25 0 011.235-.813l-.64-1.357a6.77 6.77 0 00-1.588 1.046l.993 1.124zM7 164.25c-.81 0-1.52-.427-1.918-1.073l-1.277.787A3.748 3.748 0 007 165.75v-1.5zm-1.918-1.073A2.235 2.235 0 014.75 162h-1.5c0 .719.203 1.392.555 1.964l1.277-.787zM4 161.25H3v1.5h1v-1.5zm7 0h-1v1.5h1v-1.5zm-3.372-13.599l14 8 .744-1.302-14-8-.744 1.302zM8.75 155v-8h-1.5v8h1.5zm12.878-.651l-9 5.143.744 1.302 9-5.143-.744-1.302z"
                    fill="#fff"
                    opacity=".5"
                  />
                  <path
                    d="M3 205h8m-8 0v7a1 1 0 001 1h7m-8-8v-7a1 1 0 011-1h6a1 1 0 011 1v7m0 0v8m0-8h7a1 1 0 011 1v6a1 1 0 01-1 1h-7m4-11h6a1 1 0 001-1v-6a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1z"
                    stroke="#fff"
                    strokeWidth="1.5"
                    opacity=".5"
                  />
                </svg>
                <svg width="24" height="72" fill="none">
                  <path
                    d="M10.325 52.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    stroke="#fff"
                    strokeOpacity=".5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 60a3 3 0 11-6 0 3 3 0 016 0zM5.121 17.804A13.936 13.936 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="#fff"
                    strokeOpacity=".5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-auto flex flex-col min-w-0">
                <CompletionDemo />
                <div className="border-t border-white border-opacity-10 font-mono text-xs text-white p-4 space-y-2">
                  <h3>Problems</h3>
                  <ul className="leading-5">
                    {problems.map((problem, i) => (
                      <li key={i} className="flex min-w-0">
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="flex-none text-amber-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <p className="truncate ml-1">{problem[0]}</p>
                        <p className="hidden sm:block flex-none opacity-50">&nbsp;{problem[1]}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CodeWindow>
        }
      />
    </section>
  )
}
