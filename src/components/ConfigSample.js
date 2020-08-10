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
          {toObjectKey(key)}:{' '}
          {stringify(edits[key], { indent: '  ' })
            .replace(/\[([^\]]+)\]/g, (m, p1) => `[${p1.replace(/\n\s*/g, ' ').trim()}]`)
            .split('\n')
            .map((x, i) => `${i === 0 ? '' : '+ ' + indent}${x}`)
            .join('\n')}
          {',\n'}
        </Fragment>
      ))}
    </span>
  )
}

export function ConfigSample({ path, add, remove, before, after }) {
  path = typeof path === 'string' ? path.split('.') : path

  return (
    <pre className="language-diff">
      <code className="language-diff">
        <span className="token unchanged">
          {'  // tailwind.config.js\n'}
          {'  module.exports = {\n'}
          {path.map((key, i) => (
            <Fragment key={i}>
              {'  '}
              {'  '.repeat(i + 1)}
              {key}: {'{\n'}
            </Fragment>
          ))}
          {before && castArray(before).map((str) => `${'  '.repeat(path.length + 2)}${str}\n`)}
        </span>
        {remove && <Edits edits={remove} type="deleted" indent={'  '.repeat(path.length + 1)} />}
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
  )
}
