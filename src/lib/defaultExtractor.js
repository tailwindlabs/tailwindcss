const PATTERNS = [
  /(?:\['([^'\s]+[^<>"'`\s:\\])')/.source, // ['text-lg' -> text-lg
  /(?:\["([^"\s]+[^<>"'`\s:\\])")/.source, // ["text-lg" -> text-lg
  /(?:\[`([^`\s]+[^<>"'`\s:\\])`)/.source, // [`text-lg` -> text-lg
  /([^<>"'`\s]*\[\w*'[^"`\s]*'?\])/.source, // font-['some_font',sans-serif]
  /([^<>"'`\s]*\[\w*"[^'`\s]*"?\])/.source, // font-["some_font",sans-serif]
  /([^<>"'`\s]*\[\w*\('[^"'`\s]*'\)\])/.source, // bg-[url('...')]
  /([^<>"'`\s]*\[\w*\("[^"'`\s]*"\)\])/.source, // bg-[url("...")]
  /([^<>"'`\s]*\[\w*\('[^"`\s]*'\)\])/.source, // bg-[url('...'),url('...')]
  /([^<>"'`\s]*\[\w*\("[^'`\s]*"\)\])/.source, // bg-[url("..."),url("...")]
  /([^<>"'`\s]*\['[^"'`\s]*'\])/.source, // `content-['hello']` but not `content-['hello']']`
  /([^<>"'`\s]*\["[^"'`\s]*"\])/.source, // `content-["hello"]` but not `content-["hello"]"]`
  /([^<>"'`\s]*\[[^<>"'`\s]*:'[^"'`\s]*'\])/.source, // `[content:'hello']` but not `[content:"hello"]`
  /([^<>"'`\s]*\[[^<>"'`\s]*:"[^"'`\s]*"\])/.source, // `[content:"hello"]` but not `[content:'hello']`
  /([^<>"'`\s]*\[[^"'`\s]+\][^<>"'`\s]*)/.source, // `fill-[#bada55]`, `fill-[#bada55]/50`
  /([^<>"'`\s]*[^"'`\s:\\])/.source, //  `px-1.5`, `uppercase` but not `uppercase:`
].join('|')

const BROAD_MATCH_GLOBAL_REGEXP = new RegExp(PATTERNS, 'g')
const INNER_MATCH_GLOBAL_REGEXP = /[^<>"'`\s.(){}[\]#=%$]*[^<>"'`\s.(){}[\]#=%:$]/g

/**
 * @param {string} content
 */
export function defaultExtractor(content) {
  let broadMatches = content.matchAll(BROAD_MATCH_GLOBAL_REGEXP)
  let innerMatches = content.match(INNER_MATCH_GLOBAL_REGEXP) || []
  let results = [...broadMatches, ...innerMatches].flat().filter((v) => v !== undefined)

  return results
}
