import { Fragment, useEffect, useState } from 'react'
import { getClassNameForToken } from '@/components/CodeWindow'
import { lines } from './snippet.html?highlight'
import { Example } from '../Example'
import clsx from 'clsx'
import { useInView } from 'react-intersection-observer'

const STEP_DELAY = 300
const TYPE_DELAY = 100
const END_DELAY = 1500

function Demo({ text, position, anchor, highlighted }) {
  if (anchor === 'left') {
    return (
      <>
        <Selection isActive={highlighted}>{text.substr(0, position)}</Selection>
        <Cursor />
        {text.substr(position)}
      </>
    )
  }

  return (
    <>
      {text.substr(0, text.length - position)}
      <Cursor />
      <Selection isActive={highlighted}>{text.substr(text.length - position)}</Selection>
    </>
  )
}

function Cursor() {
  return <span className="border -mx-px" style={{ height: '1.125rem' }} />
}

function Selection({ isActive, children }) {
  return (
    <span
      className="inline-flex rounded"
      style={{ background: isActive ? 'rgba(81, 92, 126, 0.4)' : undefined }}
    >
      {children}
    </span>
  )
}

function Link({ className, ...props }) {
  return (
    // eslint-disable-next-line
    <a
      {...props}
      className={clsx(
        'rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900',
        className
      )}
    />
  )
}

let prefix = 'font'
let keys = ['medium', 'bold']
let initialState = {
  key: keys[0],
  nextKey: keys[1],
  text: `${prefix}-${keys[0]}`,
  position: 0,
  anchor: 'left',
  stage: -1,
  highlighted: true,
}

export function MultiCursorDemo() {
  let { ref: inViewRef, inView } = useInView({ threshold: 0 })
  let [{ text, key, nextKey, position, anchor, stage, highlighted }, setState] =
    useState(initialState)

  useEffect(() => {
    if (inView && stage === -1) {
      setState((state) => ({ ...state, stage: 0 }))
    } else if (!inView && stage !== -1) {
      setState(initialState)
    }
  }, [inView, stage])

  useEffect(() => {
    if (stage === -1) return

    function updateState(newState) {
      return setState((state) => ({ ...state, ...newState }))
    }

    let handle = window.setTimeout(() => {
      if (stage === 0) {
        if (position === 0) {
          updateState({ position: prefix.length })
        } else if (position !== text.length) {
          updateState({ position: text.length })
        } else {
          updateState({ stage: 1 })
        }
      } else if (stage <= 2) {
        updateState({ stage: stage + 1 })
      } else if (stage === 3) {
        if (position === 0) {
          updateState({ stage: 4 })
        } else {
          updateState({ position: 0, anchor: 'right' })
        }
      } else if (stage === 4) {
        // delete key
        updateState({
          text: `${prefix}-${key}`.substr(0, text.length - 1),
          stage: text.length - 1 === `${prefix}-`.length ? 5 : 4,
        })
      } else if (stage === 5) {
        // insert new key
        if (text.length < `${prefix}-${nextKey}`.length) {
          updateState({
            text: `${prefix}-${nextKey}`.substr(0, text.length + 1),
          })
        } else {
          updateState({ stage: 6 })
        }
      } else if (stage === 6) {
        updateState({ stage: 7 })
      } else if (stage === 7) {
        updateState({ position: nextKey.length, highlighted: false, stage: 8 })
      } else if (stage === 8) {
        updateState({
          position: 0,
          anchor: 'left',
          stage: 9,
        })
      } else if (stage === 9) {
        updateState({
          stage: 0,
          key: key === keys[0] ? keys[1] : keys[0],
          nextKey: key === keys[0] ? keys[0] : keys[1],
          highlighted: true,
        })
      }
    }, [STEP_DELAY, STEP_DELAY, STEP_DELAY, STEP_DELAY, TYPE_DELAY, TYPE_DELAY, STEP_DELAY, STEP_DELAY, STEP_DELAY, END_DELAY][stage])

    return () => {
      window.clearTimeout(handle)
    }
  }, [stage, position, text, prefix, key])

  let linkClassName =
    stage > 5
      ? nextKey === 'bold'
        ? 'font-bold'
        : 'font-medium'
      : key === 'bold'
      ? 'font-bold'
      : 'font-medium'

  return (
    <>
      <Example p="none" containerClassName="mt-4 -mb-3">
        <div className="sm:px-8 flex sm:justify-center">
          <div className="bg-white px-6 py-4 shadow">
            <nav className="flex justify-center space-x-4">
              <Link href="#/dashboard" className={linkClassName}>
                Home
              </Link>
              <Link href="#/team" className={linkClassName}>
                Team
              </Link>
              <Link href="#/projects" className={linkClassName}>
                Projects
              </Link>
              <Link href="#/reports" className={linkClassName}>
                Reports
              </Link>
            </nav>
          </div>
        </div>
      </Example>
      <pre className="language-html" ref={inViewRef}>
        <code className="language-html">
          {lines.map((tokens, lineIndex) => (
            <Fragment key={lineIndex}>
              {tokens.map((token, tokenIndex) => {
                if (token.content.startsWith('{class}')) {
                  return (
                    <span key={tokenIndex} className={getClassNameForToken(token)}>
                      {lineIndex === 1 || (stage >= lineIndex - 1 && stage < 7) ? (
                        <Demo {...{ text, position, anchor, stage, highlighted }} />
                      ) : (
                        text
                      )}
                      {token.content.replace(/^{class}/, '')}
                    </span>
                  )
                }
                return (
                  <span key={tokenIndex} className={getClassNameForToken(token)}>
                    {token.content}
                  </span>
                )
              })}
              {lineIndex === lines.length - 2 ? null : '\n'}
            </Fragment>
          ))}
        </code>
      </pre>
    </>
  )
}
