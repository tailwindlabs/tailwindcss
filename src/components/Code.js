const colors = {
  punctuation: '#A1E8FF',
  tag: '#D58FFF',
  'attr-name': '#4BD0FB',
  'attr-value': '#A2F679',
}

export function Token({ token, parentTypes, children }) {
  return (
    <span style={{ color: colors[[...parentTypes, token[0]].join('.')] || colors[token[0]] }}>
      {children}
    </span>
  )
}

export function Code({
  tokens,
  parentTypes = [],
  transformTokens = (x) => x,
  tokenProps = {},
  tokenComponent: TokenComponent = Token,
}) {
  const tokensArr = Array.isArray(tokens) ? tokens : [tokens]

  return tokensArr.map((token, i) => {
    const t = transformTokens(token, tokensArr, i)

    if (typeof t === 'string') return t

    if (t[0] === parentTypes[parentTypes.length - 1]) {
      return (
        <Code
          key={i}
          tokens={t[1]}
          parentTypes={parentTypes}
          tokenComponent={TokenComponent}
          tokenProps={tokenProps}
          transformTokens={transformTokens}
        />
      )
    }

    return (
      <TokenComponent key={i} token={t} parentTypes={parentTypes} {...tokenProps}>
        <Code
          tokens={t[1]}
          parentTypes={[...parentTypes, t[0]]}
          tokenComponent={TokenComponent}
          tokenProps={tokenProps}
          transformTokens={transformTokens}
        />
      </TokenComponent>
    )
  })
}
