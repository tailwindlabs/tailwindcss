import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import styles from './EditorTools.module.css'
import tokenize from '../../macros/tokenize.macro'
import { Token } from '../Code'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ReactComponent as Icon } from '@/img/icons/home/editor-tools.svg'
import { useInView } from 'react-intersection-observer'
import { siteConfig } from '@/utils/siteConfig'

const problems = [
  [
    "'colors.red.50' does not exist in your theme config. Did you mean 'colors.red.500'?",
    'invaidConfigPath [4, 17]',
  ],
  [
    "'colors.red.50' does not exist in your theme config. Did you mean 'colors.red.500'?",
    'invaidConfigPath [4, 17]',
  ],
  ["The screen 'small' does not exist in your config. Did you mean 'sm'?", 'invalidScreen [8, 9]'],
]

const completions = [
  //
  ['sm:'],
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
  ['bg-fixed'],
  ['bg-local'],
  ['bg-scroll'],
  ['bg-clip-border'],
  ['bg-clip-padding'],
  ['bg-clip-content'],
  ['bg-clip-text'],
  ['bg-transparent'],
  ['bg-current'],
  ['bg-black', '#000'],
  ['bg-white', '#fff'],
  ['bg-gray-50', siteConfig.theme.colors.gray[50]],
  //
  ['bg-teal-50', siteConfig.theme.colors.teal[50]],
  ['bg-teal-100', siteConfig.theme.colors.teal[100]],
  ['bg-teal-200', siteConfig.theme.colors.teal[200]],
  ['bg-teal-300', siteConfig.theme.colors.teal[300]],
  ['bg-teal-400', siteConfig.theme.colors.teal[400]],
  ['bg-teal-500', siteConfig.theme.colors.teal[500]],
  ['bg-teal-600', siteConfig.theme.colors.teal[600]],
  ['bg-teal-700', siteConfig.theme.colors.teal[700]],
  ['bg-teal-800', siteConfig.theme.colors.teal[800]],
  ['bg-teal-900', siteConfig.theme.colors.teal[900]],
  ['bg-top'],
]

function CompletionDemo() {
  const [typed, setTyped] = useState('')
  const [selectedCompletionIndex, setSelectedCompletionIndex] = useState(0)
  const [stage, setStage] = useState(-1)
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true })

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
    if (stage === 1) {
      window.setTimeout(() => {
        setStage(-1)
      }, 2000)
      window.setTimeout(() => {
        setStage(0)
      }, 2000)
    }
  }, [stage])

  return (
    <CodeWindow.Code
      ref={ref}
      tokens={tokenize.html('<div class="__CLASS__"></div>').tokens}
      tokenComponent={EditorToolsToken}
      tokenProps={{ stage, typed, setTyped, selectedCompletionIndex }}
    />
  )
}

export function EditorTools() {
  return (
    <section>
      <div className="px-4 sm:px-6 md:px-8 mb-20">
        <IconContainer className={`${gradients.lightblue} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-lightBlue-600 mb-3">
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
        <Link href="#" className="text-lightBlue-600">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="lightblue"
        rotate={2}
        left={
          <CodeWindow className={`bg-lightBlue-500 ${styles.code}`}>
            <div className="flex-auto flex">
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
              <div className="flex-auto flex flex-col">
                <CompletionDemo />
                <div className="border-t border-white border-opacity-10 font-mono text-xs text-white p-4 space-y-2">
                  <h3 className="leading-4">Problems</h3>
                  <ul className="leading-5">
                    {problems.map((problem, i) => (
                      <li key={i} className="flex space-x-1">
                        <svg width="20" height="20" fill="none" className="flex-none text-red-400">
                          <circle
                            cx="10"
                            cy="10"
                            r="6.25"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M8 12l4-4M8 8l4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="flex-auto opacity-75 flex">
                          <p>
                            {problem[0]} <span className="opacity-50">{problem[1]}</span>
                          </p>
                        </div>
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

function EditorToolsToken(props) {
  const { token, stage, typed, setTyped, selectedCompletionIndex } = props

  if (token[0] === 'attr-value' && token[1].includes('__CLASS__')) {
    return (
      <span className="text-code-attr-value">
        <span className="text-code-punctuation">="</span>flex
        {stage >= 0 &&
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
        {stage >= 1 && 'eal-400'}
        <span className="border -mx-px" style={{ height: '1.125rem' }} />
        {typed && (
          <span className="relative">
            <div className="absolute top-full left-full m-0.5 rounded-md shadow-xl">
              <div className="relative w-96 bg-lightBlue-800 border border-black overflow-hidden rounded-md">
                <div className="bg-black bg-opacity-75 absolute inset-0" />
                <ul className="relative leading-5 text-white py-2">
                  {completions
                    .filter((completion) => completion[0].startsWith(typed.trim()))
                    .slice(0, 12)
                    .map((completion, i) => (
                      <li
                        key={i}
                        className={`pl-2.5 pr-3 flex items-center space-x-1.5 ${
                          i === selectedCompletionIndex ? 'bg-white bg-opacity-10' : ''
                        }`}
                      >
                        <span className="w-4 flex-none flex justify-center">
                          {completion[1] ? (
                            <span
                              className="flex-none w-3 h-3 rounded-sm shadow-px"
                              style={{ background: completion[1] }}
                            />
                          ) : (
                            <svg width="16" height="10" fill="none">
                              <rect x=".5" y=".5" width="15" height="9" rx="1.5" stroke="#9FA6B2" />
                              <path fill="#9FA6B2" d="M4 3h8v1H4zM4 6h8v1H4z" />
                            </svg>
                          )}
                        </span>
                        <span className="flex-auto">
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
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </span>
        )}
        "
      </span>
    )
  }

  return <Token {...props} />
}
