import stringify from 'stringify-object'
import { Fragment } from 'react'
import { castArray } from '@/utils/castArray'
import clsx from 'clsx'

function toObjectKey(str) {
  if (/^[a-z_$][a-z0-9_$]*$/i.test(str)) {
    return str
  }
  return `'${str}'`
}

function Value({ value }) {
  if (typeof value === 'string') {
    return <span className="token string">'{value}'</span>
  }
  if (Array.isArray(value)) {
    return (
      <>
        <span className="token punctuation">[</span>
        {value.map((v, i) => (
          <Fragment key={i}>
            <Value value={v} />
            {i === value.length - 1 ? null : <span className="token punctuation">, </span>}
          </Fragment>
        ))}
        <span className="token punctuation">]</span>
      </>
    )
  }
  if (typeof value === 'boolean') {
    return <span className="token boolean">{value.toString()}</span>
  }
  return value.toString()
}

function Edits({ edits, indent = '', type = 'inserted' }) {
  return (
    <span
      className={clsx('token', {
        'inserted-sign inserted': type === 'inserted',
        'deleted-sign deleted': type !== 'inserted',
      })}
    >
      {Object.keys(edits).map((key, i) => (
        <Fragment key={i}>
          <span
            className={clsx('token prefix', {
              inserted: type === 'inserted',
              deleted: type !== 'inserted',
            })}
          >
            {type === 'inserted' ? '+' : '-'}
          </span>{' '}
          {indent}
          {toObjectKey(key)}
          <span className="token operator">:</span> <Value value={edits[key]} />
          <span className="token punctuation">,</span>
          {'\n'}
        </Fragment>
      ))}
    </span>
  )
}

export function ConfigSample({ path, add, remove, before, after }) {
  path = typeof path === 'string' ? path.split('.') : path

  return (
    <div className="prose prose-slate dark:prose-dark">
      <div className="my-6 rounded-xl overflow-hidden bg-slate-800">
        <pre className="language-diff">
          <code className="language-diff">
            <span className="token unchanged">
              {'  '}
              <span className="token comment">{'// tailwind.config.js'}</span>
              {'\n'}
              {'  module'}
              <span className="token punctuation">.</span>
              <span className="token property-access">exports</span>{' '}
              <span className="token operator">=</span>{' '}
              <span className="token punctuation">{'{'}</span>
              {'\n'}
              {path.map((key, i) => (
                <Fragment key={i}>
                  {'  '}
                  {'  '.repeat(i + 1)}
                  {key}
                  <span className="token operator">:</span>{' '}
                  <span className="token punctuation">{'{'}</span>
                  {'\n'}
                </Fragment>
              ))}
              {before &&
                castArray(before).map((str, i) => (
                  <Fragment key={i}>
                    {'  '.repeat(path.length + 2)}
                    <span className="token comment">{`// ${str}`}</span>
                    {'\n'}
                  </Fragment>
                ))}
            </span>
            {remove && (
              <Edits edits={remove} type="deleted" indent={'  '.repeat(path.length + 1)} />
            )}
            {add && <Edits edits={add} type="inserted" indent={'  '.repeat(path.length + 1)} />}
            <span className="token unchanged">
              {after && castArray(after).map((str) => `${'  '.repeat(path.length + 2)}${str}\n`)}
              {path.map((key, i) => (
                <Fragment key={i}>
                  {'  '}
                  {'  '.repeat(path.length - i)}
                  {'}\n'}
                </Fragment>
              ))}
              {'  }'}
            </span>
          </code>
        </pre>
      </div>
    </div>
  )
}
