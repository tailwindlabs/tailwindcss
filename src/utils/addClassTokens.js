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

export function addClassTokens2(lines) {
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (
        lines[i][j - 3] &&
        lines[i][j - 3].content === 'class' &&
        lines[i][j - 3].types[lines[i][j - 3].types.length - 1] === 'attr-name'
      ) {
        lines[i].splice(
          j,
          1,
          ...lines[i][j].content.split(/(\s+)/).map((part, partIndex) => {
            if (partIndex % 2 === 0) {
              return { content: part, types: [...lines[i][j].types, 'class'] }
            }
            return { content: part, types: ['plain'] }
          })
        )
      }
    }
  }
}
