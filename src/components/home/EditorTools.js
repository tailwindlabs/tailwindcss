import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import { motion } from 'framer-motion'
import { Fragment, useEffect, useState } from 'react'
import iconUrl from '@/img/icons/home/editor-tools.png'
import { useInView } from 'react-intersection-observer'
import colors from 'tailwindcss/colors'
import dlv from 'dlv'
import { GridLockup } from '../GridLockup'
import { lines } from '../../samples/editor-tools.html?highlight'
import clsx from 'clsx'

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
                            <ColorDecorator color={color} />
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
    <span className="token attr-value">
      <span className="hidden sm:inline-flex items-baseline">
        <ColorDecorator color={colors.teal[600]} />
        text-teal-600
        {stage >= 1 && stage < 2 && ' '}
      </span>
      {stage >= 1 && stage < 2 && <ColorDecorator color={colors.teal[400]} />}
      {stage >= 0 &&
        stage < 2 &&
        ' bg-t'
          .split('')
          .filter((char) => (stage >= 1 && stage < 6 ? char !== ' ' : true))
          .map((char, i) => (
            <span key={char} className={char === ' ' ? 'hidden sm:inline' : undefined}>
              <motion.span
                initial={{ display: 'none' }}
                animate={{ display: 'inline' }}
                transition={{ delay: (i + 1) * 0.3 }}
                onAnimationComplete={() => setTyped(typed + char)}
              >
                {char}
              </motion.span>
            </span>
          ))}
      {stage === 1 && 'eal-400'}
      {(stage < 2 || stage === 6) && <span className="border -mx-px h-5" />}
      {stage >= 2 && stage <= 5 && (
        <Fragment key={stage}>
          <span className="hidden sm:inline">{stage < 5 && ' '}</span>
          {stage < 5 && <ColorDecorator color={colors.teal[400]} />}
          {stage >= 4 && <span className="relative border -mx-px h-5" />}
          {stage === 5 && (
            <>
              <span
                className="inline-flex items-baseline"
                style={{ background: 'rgba(81, 92, 126, 0.4)' }}
              >
                <span className="hidden sm:inline">&nbsp;</span>
                &#8203;
                <ColorDecorator color={colors.teal[400]} />
              </span>
            </>
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
          <div className="absolute top-full left-full m-0.5 -ml-16 sm:ml-0.5 rounded-lg shadow-xl">
            <div className="relative w-96 bg-gray-700 overflow-hidden rounded-lg">
              <ul className="relative leading-5 text-white py-3">
                {completions
                  .filter((completion) => completion[0].startsWith(typed.trim()))
                  .slice(0, 12)
                  .map((completion, i) => (
                    <li
                      key={completion[0]}
                      className={clsx('px-3 flex items-center space-x-2', {
                        'bg-gray-600': i === selectedCompletionIndex,
                      })}
                    >
                      <span className="w-5 flex-none flex justify-center">
                        {completion[2] ? (
                          <span
                            className="flex-none w-3 h-3 rounded ring-1 ring-gray-900/30"
                            style={{ background: completion[2] }}
                          />
                        ) : (
                          <svg className="w-5 h-5">
                            <path
                              className="!text-gray-400"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M16 5H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1ZM4 4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm1 4h10v1H5V8Zm10 3H5v1h10v-1Z"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="flex-none !text-gray-50">
                        {completion[0].split(new RegExp(`(^${typed.trim()})`)).map((part, j) =>
                          part ? (
                            j % 2 === 0 ? (
                              part
                            ) : (
                              <span key={j} className="!text-teal-200">
                                {part}
                              </span>
                            )
                          ) : null
                        )}
                      </span>
                      {i === selectedCompletionIndex && completion[1] ? (
                        <span className="hidden sm:block flex-auto text-right !text-gray-400 truncate pl-4">
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

function ColorDecorator({ color }) {
  return (
    <span
      className="inline-flex w-3 h-3 rounded ring-1 ring-gray-900/30 relative top-px mr-1"
      style={{ background: color }}
    />
  )
}

export function EditorTools() {
  return (
    <section id="editor-tools">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <IconContainer>
          <img src={iconUrl} alt="" />
        </IconContainer>
        <Caption className="text-sky-500">Editor tools</Caption>
        <BigText>World-class IDE integration.</BigText>
        <Paragraph as="div">
          <p>
            Worried about remembering all of these class names? The Tailwind CSS IntelliSense
            extension for VS Code has you covered.
          </p>
          <p>
            Get intelligent autocomplete suggestions, linting, class definitions and more, all
            within your editor and with no configuration required.
          </p>
        </Paragraph>
        <Link href="/docs/intellisense" color="sky">
          Learn more<span className="sr-only">, editor setup</span>
        </Link>
      </div>
      <GridLockup
        className="mt-10"
        beams={7}
        left={
          <div className="relative">
            <img
              src={require('@/img/beams/overlay.webp').default}
              alt=""
              className="absolute z-10 bottom-0 -left-80 w-[45.0625rem] pointer-events-none"
            />
            <CodeWindow className="!h-[39.0625rem]">
              <div className="flex-auto flex min-h-0">
                <div className="hidden sm:flex flex-none w-14 border-r border-gray-500/30 flex-col items-center justify-between pt-3.5 pb-4">
                  <svg width="24" height="216" fill="none">
                    <path
                      d="M3 69l6-6m-2-5a7 7 0 1014 0 7 7 0 00-14 0z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 7H5a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1v-3m3.707-10.293l-3.414-3.414A1 1 0 0015.586 3H9a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V7.414a1 1 0 00-.293-.707zM7 103a2 2 0 100-4 2 2 0 000 4zm0 0v10m10-6a2 2 0 100-4 2 2 0 000 4zm0 0a3 3 0 01-3 3h-4a3 3 0 00-3 3m0 0a2 2 0 100 4 2 2 0 000-4z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M11.5 160.031a.75.75 0 00-1-1.118l1 1.118zm-8-1.118a.75.75 0 00-1 1.118l1-1.118zm6.972 6.149a.75.75 0 10.993-1.124l-.993 1.124zm-7.937-1.124a.75.75 0 10.993 1.124l-.993-1.124zm7.022-.368l-.64-.393.64.393zm-5.114 0l.64-.393-.64.393zM3 161.25a.75.75 0 000 1.5v-1.5zm8 1.5a.75.75 0 000-1.5v1.5zM8 147l.372-.651A.75.75 0 007.25 147H8zm14 8l.372.651a.75.75 0 000-1.302L22 155zm-14.75 0a.75.75 0 001.5 0h-1.5zm5.378 4.492a.75.75 0 10.744 1.302l-.744-1.302zM7 157.75A2.25 2.25 0 019.25 160h1.5A3.75 3.75 0 007 156.25v1.5zm0-1.5A3.75 3.75 0 003.25 160h1.5A2.25 2.25 0 017 157.75v-1.5zm2.624 3.298A5.225 5.225 0 017 160.25v1.5a6.73 6.73 0 003.376-.903l-.752-1.299zM9.25 160v.197h1.5V160h-1.5zm0 .197V162h1.5v-1.803h-1.5zM7 160.25a5.225 5.225 0 01-2.624-.702l-.752 1.299A6.73 6.73 0 007 161.75v-1.5zM4.75 162v-1.803h-1.5V162h1.5zm0-1.803V160h-1.5v.197h1.5zm5.75-1.284a5.209 5.209 0 01-.876.635l.752 1.299c.403-.234.78-.507 1.124-.816l-1-1.118zm-6.124.635a5.21 5.21 0 01-.876-.635l-1 1.118c.344.309.721.582 1.124.816l.752-1.299zm4.86 4.701c.451.212.867.487 1.236.813l.993-1.124a6.77 6.77 0 00-1.588-1.046l-.64 1.357zM9.25 162c0 .433-.122.835-.332 1.177l1.277.787A3.737 3.737 0 0010.75 162h-1.5zm-.332 1.177A2.247 2.247 0 017 164.25v1.5a3.748 3.748 0 003.195-1.786l-1.277-.787zm-5.39 1.885a5.25 5.25 0 011.235-.813l-.64-1.357a6.77 6.77 0 00-1.588 1.046l.993 1.124zM7 164.25c-.81 0-1.52-.427-1.918-1.073l-1.277.787A3.748 3.748 0 007 165.75v-1.5zm-1.918-1.073A2.235 2.235 0 014.75 162h-1.5c0 .719.203 1.392.555 1.964l1.277-.787zM4 161.25H3v1.5h1v-1.5zm7 0h-1v1.5h1v-1.5zm-3.372-13.599l14 8 .744-1.302-14-8-.744 1.302zM8.75 155v-8h-1.5v8h1.5zm12.878-.651l-9 5.143.744 1.302 9-5.143-.744-1.302z"
                      fill="currentColor"
                    />
                    <path
                      d="M3 205h8m-8 0v7a1 1 0 001 1h7m-8-8v-7a1 1 0 011-1h6a1 1 0 011 1v7m0 0v8m0-8h7a1 1 0 011 1v6a1 1 0 01-1 1h-7m4-11h6a1 1 0 001-1v-6a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <svg width="24" height="72" fill="none">
                    <path
                      d="M10.325 52.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 60a3 3 0 11-6 0 3 3 0 016 0zM5.121 17.804A13.936 13.936 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-auto flex flex-col min-w-0">
                  <CompletionDemo />
                  <div className="border-t border-gray-500/30 font-mono text-xs leading-6 text-gray-200 p-4 space-y-2">
                    <h3>Problems</h3>
                    <ul className="space-y-1 text-gray-300">
                      {problems.map((problem, i) => (
                        <li key={i} className="flex min-w-0">
                          <svg
                            width="24"
                            height="24"
                            fill="none"
                            className="flex-none text-yellow-400"
                          >
                            <path
                              d="m5.207 16.203 5.072-10.137c.711-1.422 2.736-1.421 3.447 0l5.067 10.137c.642 1.285-.29 2.797-1.723 2.797H6.93c-1.434 0-2.366-1.513-1.723-2.797ZM12 10v2"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12.5 16a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
                              stroke="currentColor"
                            />
                          </svg>
                          <p className="truncate ml-1">{problem[0]}</p>
                          <p className="hidden sm:block flex-none text-gray-500">
                            &nbsp;{problem[1]}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CodeWindow>
          </div>
        }
      />
    </section>
  )
}
