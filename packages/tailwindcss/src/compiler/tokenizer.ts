// packages/tailwindcss/src/compiler/tokenizer.ts
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
    // ... rest of compiler tokenizer code
  }
  return tokens;
}