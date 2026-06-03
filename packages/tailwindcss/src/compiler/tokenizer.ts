// packages/tailwindcss/src/compiler/tokenizer.ts
export interface Token {
  type: string;
  value: string;
}

export function scanBalancedBrackets(input: string, startIndex: number): string | null {
  let depth = 0;
  let index = startIndex;
  while (index < input.length) {
    const char = input[index];
    if (char === '[') {
      depth++;
    } else if (char === ']') {
      depth--;
      if (depth === 0) {
        return input.slice(startIndex, index + 1);
      }
    }
    index++;
  }
  return null;
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < input.length) {
    const char = input[index];
    if (char === '[') {
      // FIX: Mitigate arbitrary parser regex backtracking loops
      const arbitraryBlock = scanBalancedBrackets(input, index);
      if (arbitraryBlock) {
        tokens.push({ type: 'arbitrary', value: arbitraryBlock });
        index += arbitraryBlock.length;
        continue;
      }
    }
    tokens.push({ type: 'char', value: char });
    index++;
  }
  return tokens;
}