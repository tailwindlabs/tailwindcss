export function addClassTokens(token, tokensArr, index) {
  if (
    token[0] === 'attr-value' &&
    tokensArr[index - 1] &&
    tokensArr[index - 1][0] === 'attr-name' &&
    tokensArr[index - 1][1][0] === 'class'
  ) {
    return [
      token[0],
      token[1]
        .map((t) => {
          if (typeof t !== 'string') return [t]
          return t.split(/(\s+)/).map((c, i) => (i % 2 !== 0 ? c : ['class', c]))
        })
        .flat(),
    ]
  }
  return token
}
